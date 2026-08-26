import { BrowserRouter } from "react-router-dom";
import { ConfigProvider } from "antd";
import trTR from "antd/locale/tr_TR";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AppRoutes from "./routes";
import antdTheme from "./constants/antdTheme";
import ErrorBoundary from "./components/ErrorBoundary";

function App() {
  return (
    <ConfigProvider locale={trTR} theme={antdTheme}>
      <BrowserRouter>
        <ToastContainer />
        <ErrorBoundary>
          <AppRoutes />
        </ErrorBoundary>
      </BrowserRouter>
    </ConfigProvider>
  );
}

export default App;
