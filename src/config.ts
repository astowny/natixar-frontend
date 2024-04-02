// types
import {
  DefaultConfigProps,
  MenuOrientation,
  ThemeDirection,
  ThemeMode,
} from "types/config"

// ==============================|| THEME CONSTANT ||============================== //

export const twitterColor = "#1DA1F2"
export const facebookColor = "#3b5998"
export const linkedInColor = "#0e76a8"

export const APP_DEFAULT_PATH = "/dashboard/analytics"
export const HORIZONTAL_MAX_ITEM = 7
export const DRAWER_WIDTH = 260
export const MINI_DRAWER_WIDTH = 60

// ==============================|| THEME CONFIG ||============================== //

const configNatixar: DefaultConfigProps = {
  fontFamily: `'Public Sans', sans-serif`,
  i18n: "en",
  menuOrientation: MenuOrientation.VERTICAL,
  miniDrawer: false,
  container: true,
  mode: ThemeMode.LIGHT,
  presetColor: "default",
  themeDirection: ThemeDirection.LTR,
  isShowExtraHeader: false,
}

export const fusionConfig = {
  clientID: "5e9cba0b-4978-4a24-88c0-0a45b0ed067f",
  serverUrl: "http://localhost:8011",
  redirectUri: "http://localhost:3000",
}

export default configNatixar
