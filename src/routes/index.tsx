import { lazy } from "react"
import { createBrowserRouter } from "react-router-dom"

// project import
import Loadable from "components/Loadable"
import { Box } from "@mui/material"
import MainRoutes from "./MainRoutes"
import LoginRoutes from "./LoginRoutes"

import AppLayout from "../app-layout"

// render - landing page
const PagesLanding = Loadable(lazy(() => import("pages/landing")))

// ==============================|| ROUTING RENDER ||============================== //

const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      {
        path: "/",
        element: <Box />,
        children: [
          {
            index: true,
            element: <PagesLanding />,
          },
        ],
      },
      MainRoutes,
    ],
  },
  LoginRoutes,
  // LandingPage 
  {
    path: '/landing',
    element: <PagesLanding />
  }
])

export default router
