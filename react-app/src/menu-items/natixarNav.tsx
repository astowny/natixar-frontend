// third-party
import { FormattedMessage } from "react-intl"

// assets
import {
  IdcardOutlined,
  DashboardOutlined,
  SettingOutlined,
} from "@ant-design/icons"

// type
import { NavItemType } from "types/menu"

// icons
const icons = {
  IdcardOutlined,
  DashboardOutlined,
  SettingOutlined,
}

// ==============================|| MENU ITEMS - DASHBOARD ||============================== //

const natixarNav: NavItemType[] = [
  {
    id: "contributor",
    icon: icons.IdcardOutlined,
    type: "group",
    children: [
      {
        id: "climat-change-dashboard",
        title: <FormattedMessage id="Climat Change Dashboard" />,
        type: "item",
        url: "/contributor/dashboard",
        icon: icons.DashboardOutlined,
      },
      {
        id: "map",
        title: <FormattedMessage id="Map" />,
        type: "item",
        url: "/contributor/map",
        icon: icons.DashboardOutlined,
      },
      {
        id: "map2",
        title: <FormattedMessage id="Leaflet Map" />,
        type: "item",
        url: "/contributor/map2",
        icon: icons.DashboardOutlined,
      },
      {
        id: "data",
        title: <FormattedMessage id="Data" />,
        type: "item",
        url: "/contributor/data",
        icon: icons.DashboardOutlined,
      },
      {
        id: "upload",
        title: <FormattedMessage id="Upload" />,
        type: "item",
        url: "/contributor/upload",
        icon: icons.DashboardOutlined,
      },
      {
        id: "report",
        title: <FormattedMessage id="Report" />,
        type: "item",
        url: "/contributor/report",
        icon: icons.DashboardOutlined,
      },
      {
        id: "lca",
        title: <FormattedMessage id="LCA (user permissions)" />,
        type: "item",
        url: "/contributor/lca",
        icon: icons.DashboardOutlined,
      },
    ],
  },
  {
    id: "group-settings",
    icon: icons.IdcardOutlined,
    type: "group",
    children: [
      {
        id: "settings",
        title: <FormattedMessage id="Settings" />,
        type: "item",
        url: "/contributor/settings",
        icon: icons.SettingOutlined,
      },
    ],
  },
]

export default natixarNav
