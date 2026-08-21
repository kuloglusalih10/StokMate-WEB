import { configureStore } from "@reduxjs/toolkit";

// TrackSem'deki desen: her domain kendi klasöründe (actions.ts, hooks.ts, index.ts)
// bir slice olarak tanımlanır ve burada reducer olarak eklenir.
// Örnek: import auth from "./auth"; ... reducer: { auth, ... }
const store = configureStore({
  reducer: {},
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
