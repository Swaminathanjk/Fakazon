import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import Home from "./Pages/Home.jsx";
import Cart from "./Pages/Cart.jsx";
import Order from "./Pages/Order.jsx";

import App from "./App.jsx";
import "bootstrap/dist/css/bootstrap.min.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Provider } from "react-redux";
import products from "./Store/product-store.js";
import Login from "./Components/Login/Login.jsx";
import Signup from "./Components/Signup/Signup.jsx";
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "/home", element: <Home /> },
      { path: "/cart", element: <Cart /> },
      { path: "/", element: <Login /> },
      { path: "/login", element: <Login /> },
      { path: "/signup", element: <Signup /> },
      { path: "/payment", element: <Order/> },
    ],
  },
]);
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={products}>
      <RouterProvider router={router} />
    </Provider>
  </StrictMode>
);
