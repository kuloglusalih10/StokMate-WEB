import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { ConfigProvider } from "antd";
import trTR from "antd/locale/tr_TR";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import store from "./stores";
import AppRoutes from "./routes";
import antdTheme from "./constants/antdTheme";

function App() {
  return (
    <Provider store={store}>
      <ConfigProvider locale={trTR} theme={antdTheme}>
        <BrowserRouter>
          <ToastContainer />
          <AppRoutes />
        </BrowserRouter>
      </ConfigProvider>
    </Provider>
  );
}

export default App;
