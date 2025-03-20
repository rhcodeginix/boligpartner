import { createBrowserRouter } from "react-router-dom";
import { Layout } from "./layouts";
import {
  AddSuppliers,
  Dashboard,
  EditHouseModel,
  Husmodeller,
  SeHouseModel,
  Suppliers,
} from "./pages";

export const routes = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { path: "", element: <Dashboard /> },
      { path: "/Leverandorer", element: <Suppliers /> },
      { path: "/legg-til-leverandor", element: <AddSuppliers /> },
      { path: "/edit-legg-til-leverandor/*", element: <AddSuppliers /> },
      { path: "/Husmodeller", element: <Husmodeller /> },
      { path: "/se-husmodell/*", element: <SeHouseModel /> },
      { path: "/edit-husmodell/*", element: <EditHouseModel /> },
      { path: "/add-husmodell", element: <EditHouseModel /> },
    ],
  },
]);
