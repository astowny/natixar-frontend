// third-party
import { FormattedMessage } from "react-intl"

// assets
import {
  IdcardOutlined,
  DashboardOutlined,
  SettingOutlined,
  CloudUploadOutlined,
  FileTextOutlined,
  DatabaseOutlined,
  PieChartOutlined,
} from "@ant-design/icons"

// type
import { NavItemType } from "types/menu"
import { LCAIcon } from "../assets/images/icons/IconComponents/LCAIcon"
import { MapIcon } from "../assets/images/icons/IconComponents/MapIcon"

// icons
const icons = {
  IdcardOutlined,
  DashboardOutlined,
  SettingOutlined,
  CloudUploadOutlined,
  FileTextOutlined,
  DatabaseOutlined,
  PieChartOutlined,
}

// ==============================|| MENU ITEMS - DASHBOARD ||============================== //

const natixarNav: NavItemType[] = [
  {
    id: "contributor",
    icon: icons.IdcardOutlined,
    type: "group",
    children: [
      {
        id: "climate-change-dashboard",
        title: <FormattedMessage id="Climate Change Dashboard" />,
        type: "item",
        url: "/contributor/dashboard",
        icon: icons.PieChartOutlined,
      },
      {
        id: "map",
        title: <FormattedMessage id="Map" />,
        type: "item",
        url: "/contributor/map",
        icon: MapIcon,
      },
      {
        id: "data",
        title: <FormattedMessage id="Data" />,
        type: "item",
        url: "/contributor/data",
        icon: icons.DatabaseOutlined,
      },
      {
        id: "upload",
        title: <FormattedMessage id="Upload" />,
        type: "item",
        url: "/contributor/upload",
        icon: icons.CloudUploadOutlined,
      },
      {
        id: "report",
        title: <FormattedMessage id="Report" />,
        type: "item",
        url: "/contributor/report",
        icon: icons.FileTextOutlined,
      },
      {
        id: "lca",
        title: <FormattedMessage id="LCA (user permissions)" />,
        type: "item",
        url: "/contributor/lca",
        icon: LCAIcon,
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
