import { lazy } from "react"
import { createBrowserRouter } from "react-router-dom"

// project import
import Loadable from "components/Loadable"
import MainRoutes from "./MainRoutes"
import LoginRoutes from "./LoginRoutes"

import AppLayout from "../app-layout"

// render - landing page
const PagesLanding = Loadable(lazy(() => import("pages/landing")))

// ==============================|| ROUTING RENDER ||============================== //

const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [MainRoutes],
  },
  LoginRoutes,
])

export default router
