import { createBrowserRouter, Navigate } from "react-router-dom";
import { Layout } from "./layouts";
import { Inventory, EditHouseModel, Husmodeller, SeHouseModel } from "./pages";

export const routes = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/Husmodell" replace />,
  },
  {
    path: "/",
    element: <Layout />,
    children: [
      { path: "/Inventory", element: <Inventory /> },
      { path: "/Husmodell", element: <Husmodeller /> },
      { path: "/se-husmodell/*", element: <SeHouseModel /> },
      { path: "/edit-husmodell/*", element: <EditHouseModel /> },
      { path: "/add-husmodell", element: <EditHouseModel /> },
    ],
  },
]);
