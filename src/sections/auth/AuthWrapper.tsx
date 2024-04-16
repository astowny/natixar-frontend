import { ReactNode } from "react"

// material-ui
import { Typography, Stack, Box, Grid, useMediaQuery } from "@mui/material"
import { useTheme } from "@mui/material/styles"

// project import
import Logo from "components/logo"
import AuthCard from "./AuthCard"
import { getImageUrl, ImagePath } from "utils/getImageUrl"

// assets

interface Props {
  children: ReactNode
}

// ==============================|| AUTHENTICATION - WRAPPER ||============================== //

const AuthWrapper = ({ children }: Props) => {
  const theme = useTheme()
  const aboveSM = useMediaQuery(theme.breakpoints.up("sm"))

  const bgImgUrl = getImageUrl(`bg-trees.jpg`, ImagePath.AUTH);

  const bgStyle = () => ({
    backgroundImage: `url("${bgImgUrl}")`,
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    position: 'relative',
    width: '100%',
    height: aboveSM ? '100vh' : '100%',
    zIndex: 1
  })

  const filterStyle = () => ({
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 0,
    backgroundImage: `linear-gradient(230.09deg, rgba(19, 83, 126, 0.1) 22.04%, rgba(0, 57, 125, 0.58) 87.33%)`
  })

  const z1 = () => ({ zIndex: 1, position: 'relative' })

  return (
    <Box position='relative' sx={bgStyle}>
      <Box sx={filterStyle} />
      <Grid
        container
        direction="column"
        justifyContent={'space-between'}
        sx={{ minHeight: "100vh", ...z1 }}
      >
        <Grid item xs={12} sx={{ ml: 3, mt: 3 }}>
          <Logo />
        </Grid>
        <Stack direction={aboveSM ? "row" : "column"}>
          <Grid
            item
            xs={12}
            container
            justifyContent="center"
            alignItems="center"
          >
            <Grid item>
              <Typography variant="h1" component="h1"
                color={"#fff"}
                fontWeight='medium'
                textAlign="left"
                zIndex={1}
                fontFamily='Urbanist'
                position='relative'
                fontSize={aboveSM ? 90 : 50}
              >
                Powering<br />
                the <Box component='span' color="success.main" fontWeight={'bold'}>future</Box><br />
                <Box
                  component='span'
                  sx={{
                    width: 'fit-content',
                    position: 'relative',
                    zIndex: 2,
                    "&::before": { // today text
                      content: '"today."',
                      position: 'relative',
                      zIndex: 2,
                    },
                    "&::after": { // green underline
                      content: '""',
                      zIndex: 1,
                      position: 'absolute',
                      bottom: '8px',
                      left: 0,
                      width: '100%',
                      height: '0px',
                      border: '2px solid #1DB648',
                      borderRadius: '4px',
                    }
                  }}></Box>
              </Typography>
            </Grid>
          </Grid>
          <Grid
            item
            xs={12}
            container
            justifyContent="center"
            alignItems="center"
          >
            <Grid item>
              <AuthCard>{children}</AuthCard>
            </Grid>
          </Grid>
        </Stack>
        <Box />
      </Grid>
    </Box>
  )
}

export default AuthWrapper
