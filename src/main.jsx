import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";
import Home from "./Pages/Home/Home.jsx";
import MainForm from "./Pages/MainForm/MainForm.jsx";
import "./index.css";
import Login from "./Pages/Login/Login.jsx";
import Dashboard from "./Pages/Dashboard/Dashboard.jsx";

const router = createBrowserRouter([
   {
      path: "/",
      element: <Home />,
   },
   {
      path: "/form",
      element: <MainForm />,
   },
   {
      path: "/login",
      element: <Login />,
   },
   {
      path: "/dashboard",
      element: <Dashboard />,
   },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
   <React.StrictMode>
      <MantineProvider>
         <RouterProvider router={router} />
      </MantineProvider>
   </React.StrictMode>
);
