// third-party
import { FormattedMessage } from "react-intl"

// assets
import {
  BorderOutlined,
  BoxPlotOutlined,
  DeploymentUnitOutlined,
  GatewayOutlined,
  MenuUnfoldOutlined,
  QuestionOutlined,
  SmileOutlined,
  StopOutlined,
} from "@ant-design/icons"

// type
import { NavItemType } from "types/menu"

// icons
const icons = {
  BorderOutlined,
  BoxPlotOutlined,
  DeploymentUnitOutlined,
  GatewayOutlined,
  MenuUnfoldOutlined,
  QuestionOutlined,
  StopOutlined,
  SmileOutlined,
}

// ==============================|| MENU ITEMS - SUPPORT ||============================== //

const other: NavItemType = {
  id: "other",
  type: "group",
  children: [
    {
      id: "menu-level",
      title: <FormattedMessage id="menu-level" />,
      type: "collapse",
      icon: icons.MenuUnfoldOutlined,
      children: [
        {
          id: "menu-level-1.1",
          title: (
            <>
              <FormattedMessage id="level" /> 1
            </>
          ),
          type: "item",
          url: "#",
        },
        {
          id: "menu-level-1.2",
          title: (
            <>
              <FormattedMessage id="level" /> 1
            </>
          ),
          type: "collapse",
          children: [
            {
              id: "menu-level-2.1",
              title: (
                <>
                  <FormattedMessage id="level" /> 2
                </>
              ),
              type: "item",
              url: "#",
            },
            {
              id: "menu-level-2.2",
              title: (
                <>
                  <FormattedMessage id="level" /> 2
                </>
              ),
              type: "collapse",
              children: [
                {
                  id: "menu-level-3.1",
                  title: (
                    <>
                      <FormattedMessage id="level" /> 3
                    </>
                  ),
                  type: "item",
                  url: "#",
                },
                {
                  id: "menu-level-3.2",
                  title: (
                    <>
                      <FormattedMessage id="level" /> 3
                    </>
                  ),
                  type: "item",
                  url: "#",
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}

export default other
