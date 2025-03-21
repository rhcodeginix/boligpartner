import { createBrowserRouter, Navigate } from "react-router-dom";
import { Layout } from "./layouts";
import {
  AddSuppliers,
  Dashboard,
  EditHouseModel,
  Husmodeller,
  Login,
  Plot,
  PlotDetail,
  SeHouseModel,
  Suppliers,
} from "./pages";
import { AuthLayout } from "./layouts/AuthLayout";

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
      { path: "/dashboard", element: <Dashboard /> },
      { path: "/Leverandorer", element: <Suppliers /> },
      { path: "/legg-til-leverandor", element: <AddSuppliers /> },
      { path: "/edit-legg-til-leverandor/*", element: <AddSuppliers /> },
      { path: "/Husmodeller", element: <Husmodeller /> },
      { path: "/se-husmodell/*", element: <SeHouseModel /> },
      { path: "/edit-husmodell/*", element: <EditHouseModel /> },
      { path: "/add-husmodell", element: <EditHouseModel /> },
      { path: "/plot", element: <Plot /> },
      { path: "/se-plot/*", element: <PlotDetail /> },
    ],
  },
]);
