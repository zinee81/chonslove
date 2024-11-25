import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import Register from "./pages/Register/Register.jsx";
import Login from "./pages/Login/Login.jsx";
import HostResve from "./pages/HostResve/HostResve.jsx";
import HostResveList from "./pages/HostResveList/HostResveList.jsx";
import GuestResve from "./pages/GuestResve/GuestResve.jsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/host/resve",
    element: <HostResve />,
  },
  {
    path: "/host/:id",
    element: <HostResveList />,
  },
  {
    path: "/guest/:id",
    element: <GuestResve />,
  },
]);

createRoot(document.getElementById("root")).render(
  <AuthProvider>
    <RouterProvider router={router} />
  </AuthProvider>
);
