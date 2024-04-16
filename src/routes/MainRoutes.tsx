import { lazy } from "react"

// project import
import Loadable from "components/Loadable"
import PagesLayout from "layout/Pages"
import SimpleLayout from "layout/Simple"

// types
import { SimpleLayoutType } from "types/config"

// render - dashboard
const DashboardDefault = Loadable(lazy(() => import("pages/dashboard/default")))
const DashboardAnalytics = Loadable(
  lazy(() => import("pages/dashboard/analytics")),
)

// render - contributor
const ContributorAnalysis = Loadable(
  lazy(() => import("pages/contributor/analysis")),
)
const CategoryAnalysis = Loadable(
  lazy(() => import("pages/contributor/categoryanalysis")),
)
const ContributorUpload = Loadable(
  lazy(() => import("pages/contributor/upload")),
)

// render - widget
const WidgetStatistics = Loadable(lazy(() => import("pages/widget/statistics")))
const WidgetData = Loadable(lazy(() => import("pages/widget/data")))
const WidgetChart = Loadable(lazy(() => import("pages/widget/chart")))
const NatixarChart = Loadable(lazy(() => import("pages/natixar/charts")))
const ScopePage = Loadable(lazy(() => import("pages/natixar/ScopePage")))
const ContributorsPage = Loadable(
  lazy(() => import("pages/natixar/ContributorsPage")),
)
const DataPage = Loadable(lazy(() => import("pages/natixar/DataPage")))

// render - charts & map
const ChartApexchart = Loadable(lazy(() => import("pages/charts/apexchart")))
const ChartOrganization = Loadable(lazy(() => import("pages/charts/org-chart")))
const ClustersLeafletMap = Loadable(lazy(() => import("pages/maps-leaflet")))

const MaintenanceError = Loadable(lazy(() => import("pages/maintenance/404")))
const MaintenanceError500 = Loadable(
  lazy(() => import("pages/maintenance/500")),
)
const MaintenanceUnderConstruction = Loadable(
  lazy(() => import("pages/maintenance/under-construction")),
)
const MaintenanceComingSoon = Loadable(
  lazy(() => import("pages/maintenance/coming-soon")),
)

const AppContactUS = Loadable(lazy(() => import("pages/contact-us")))

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
  path: "/",
  children: [
    {
      path: "/",
      children: [
        {
          path: "dashboard",
          children: [
            {
              path: "default",
              element: <DashboardDefault />,
            },
            {
              path: "analytics",
              element: <DashboardAnalytics />,
            },
          ],
        },
        {
          path: "contributor",
          children: [
            {
              path: "dashboard",
              element: <NatixarChart />,
            },
            {
              path: "scope/:id",
              element: <ScopePage />,
            },
            {
              path: "scope-details/:id",
              element: <ContributorsPage />,
            },
            {
              path: "category-analysis/:id",
              element: <CategoryAnalysis />,
            },
            {
              path: "map",
              element: <ClustersLeafletMap />,
            },
            {
              path: "analysis",
              element: <ContributorAnalysis />,
            },
            {
              path: "upload",
              element: <ContributorUpload />,
            },
            {
              path: "statistics",
              element: <WidgetStatistics />,
            },
            {
              path: "data1",
              element: <WidgetData />,
            },
            {
              path: "data",
              element: <DataPage />,
            },
            {
              path: "chart",
              element: <WidgetChart />,
            },
          ],
        },
        {
          path: "charts",
          children: [
            {
              path: "apexchart",
              element: <ChartApexchart />,
            },
            {
              path: "org-chart",
              element: <ChartOrganization />,
            },
          ],
        },
        {
          path: "map",
          element: <ClustersLeafletMap />,
        },
      ],
    },
    {
      path: "/maintenance",
      element: <PagesLayout />,
      children: [
        {
          path: "404",
          element: <MaintenanceError />,
        },
        {
          path: "500",
          element: <MaintenanceError500 />,
        },
        {
          path: "under-construction",
          element: <MaintenanceUnderConstruction />,
        },
        {
          path: "coming-soon",
          element: <MaintenanceComingSoon />,
        },
      ],
    },
    {
      path: "/",
      element: <SimpleLayout layout={SimpleLayoutType.SIMPLE} />,
      children: [
        {
          path: "contact-us",
          element: <AppContactUS />,
        },
      ],
    },
  ],
}

export default MainRoutes
