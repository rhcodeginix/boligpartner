import { createBrowserRouter, Navigate } from "react-router-dom";
import { Layout } from "./layouts";
import { Inventory, EditHouseModel, Husmodeller, SeHouseModel } from "./pages";
import { AuthLayout } from "./layouts/AuthLayout";
import { Login } from "./pages/public";

export const routes = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/login" replace />,
  },
  {
    path: "/",
    element: <AuthLayout />,
    children: [{ path: "login", element: <Login /> }],
  },
  {
    path: "/",
    element: <Layout />,
    children: [
      { path: "Inventory", element: <Inventory /> },
      { path: "Husmodell", element: <Husmodeller /> },
      { path: "se-husmodell/*", element: <SeHouseModel /> },
      { path: "edit-husmodell/*", element: <EditHouseModel /> },
      { path: "add-husmodell", element: <EditHouseModel /> },
    ],
  },
]);
