// material-ui
import { Theme } from "@mui/material/styles"
import { Box, useMediaQuery } from "@mui/material"

// project import
import Profile from "./Profile"
import Notification from "./Notification"
import Customization from "./Customization"
import MobileSection from "./MobileSection"

const HeaderContent = () => {
  const downLG = useMediaQuery((theme: Theme) => theme.breakpoints.down("lg"))

  return (
    <>
      {!downLG && <Box sx={{ width: "100%" }} />}
      {downLG && <Box sx={{ width: "100%", ml: 1 }} />}

      <Notification />
      <Customization />
      {!downLG && <Profile />}
      {downLG && <MobileSection />}
    </>
  )
}

export default HeaderContent
