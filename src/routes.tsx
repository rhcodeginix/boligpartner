import { createBrowserRouter, Navigate } from "react-router-dom";
import { Layout } from "./layouts";
import {
  Inventory,
  EditHouseModel,
  Husmodeller,
  BoligConfiurator,
  BoligConfiuratorStepper,
  KundeInfo,
} from "./pages";
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
      { path: "Bolig-configurator", element: <BoligConfiurator /> },
      { path: "Room-Configurator", element: <BoligConfiuratorStepper /> },
      { path: "Room-Configurator/*", element: <BoligConfiuratorStepper /> },
      { path: "Inventory", element: <Inventory /> },
      { path: "Husmodell", element: <Husmodeller /> },
      { path: "se-series/*", element: <KundeInfo /> },
      {
        path: "se-series/:seriesId/edit-husmodell/*",
        element: <EditHouseModel />,
      },
      {
        path: "se-series/:seriesId/add-husmodell",
        element: <EditHouseModel />,
      },
    ],
  },
]);
