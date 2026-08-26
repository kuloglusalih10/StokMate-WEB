import { useEffect, useRef } from "react";
import type { ActivityLog, Product } from "../services/products";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5080";
const RECONNECT_DELAY_MS = 3000;

export type ProductEventType =
  | "product.created"
  | "product.updated"
  | "product.stock"
  | "product.deleted";

export type ProductEvent = {
  type: ProductEventType;
  productId: number;
  product: Product | null;
  log: ActivityLog | null;
};

type Listener = (event: ProductEvent) => void;

/**
 * Uygulama genelinde tek bir SSE bağlantısı (GET /events/products) paylaşılır; birden fazla
 * bileşen/sayfa aynı anda dinlese bile tarayıcı başına tek bağlantı açılır.
 *
 * EventSource, kurulduğu URL'ye otomatik olarak yeniden bağlanır; ancak erişim anahtarı (token)
 * 15 dakikada bir yenilendiği için o URL'deki eski token zamanla geçersiz kalır. Bu yüzden yerleşik
 * otomatik yeniden bağlanmaya güvenmek yerine hatada bağlantıyı elle kapatıp localStorage'daki
 * güncel token ile yeni bir bağlantı kuruyoruz.
 */
const listeners = new Set<Listener>();
let source: EventSource | null = null;
let reconnectTimer: ReturnType<typeof setTimeout> | null = null;

const clearReconnectTimer = () => {
  if (reconnectTimer) {
    clearTimeout(reconnectTimer);
    reconnectTimer = null;
  }
};

const disconnect = () => {
  clearReconnectTimer();

  if (source) {
    source.close();
    source = null;
  }
};

const connect = () => {
  clearReconnectTimer();

  if (listeners.size === 0) {
    return;
  }

  const token = localStorage.getItem("token");

  if (!token) {
    return;
  }

  const es = new EventSource(`${API_BASE}/events/products?token=${encodeURIComponent(token)}`);
  source = es;

  es.onmessage = (message) => {
    let parsed: ProductEvent | null = null;

    try {
      parsed = JSON.parse(message.data) as ProductEvent;
    } catch {
      return;
    }

    listeners.forEach((listener) => listener(parsed as ProductEvent));
  };

  es.onerror = () => {
    disconnect();

    if (listeners.size > 0) {
      reconnectTimer = setTimeout(connect, RECONNECT_DELAY_MS);
    }
  };
};

const addListener = (listener: Listener) => {
  const wasEmpty = listeners.size === 0;
  listeners.add(listener);

  if (wasEmpty) {
    connect();
  }

  return () => {
    listeners.delete(listener);

    if (listeners.size === 0) {
      disconnect();
    }
  };
};

/**
 * Ürün oluşturma/güncelleme/stok/silme olaylarını canlı olarak dinler. `onEvent` her render'da
 * güncellenir ama abonelik yalnızca bileşen mount/unmount olduğunda kurulur/kaldırılır.
 */
export const useProductEvents = (onEvent: Listener) => {
  const handlerRef = useRef(onEvent);
  handlerRef.current = onEvent;

  useEffect(() => {
    const listener: Listener = (event) => handlerRef.current(event);
    return addListener(listener);
  }, []);
};
