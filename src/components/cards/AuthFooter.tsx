// material-ui
import { Theme } from "@mui/material/styles"
import {
  useMediaQuery,
  Container,
  Link,
  Typography,
  Stack,
} from "@mui/material"

// ==============================|| FOOTER - AUTHENTICATION ||============================== //

const AuthFooter = () => {
  const matchDownSM = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down("sm"),
  )

  const textStyle = (theme) => ({
    color: 'common.white'
  })

  return (
    <Container maxWidth="xl" sx={{ zIndex: 1, position: 'relative' }}>
      < Stack
        direction={matchDownSM ? "column" : "row"}
        justifyContent={matchDownSM ? "center" : "space-between"}
        spacing={2}
        textAlign={matchDownSM ? "center" : "inherit"}
      >
        <Typography
          sx={textStyle}
          variant="subtitle2"
          color="secondary"
          component="span"
        >
          This site is protected by{" "}
          <Typography
            sx={textStyle}
            component={Link}
            variant="subtitle2"
            href="#mantis-privacy"
            target="_blank"
            underline="hover"
          >
            Privacy Policy
          </Typography>
        </Typography>

        <Stack
          direction={matchDownSM ? "column" : "row"}
          spacing={matchDownSM ? 1 : 3}
          textAlign={matchDownSM ? "center" : "inherit"}
        >
          <Typography
            sx={textStyle}
            variant="subtitle2"
            color="secondary"
            component={Link}
            href="https://codedthemes.com"
            target="_blank"
            underline="hover"
          >
            Terms and Conditions
          </Typography>
          <Typography
            sx={textStyle}
            variant="subtitle2"
            color="secondary"
            component={Link}
            href="https://codedthemes.com"
            target="_blank"
            underline="hover"
          >
            Privacy Policy
          </Typography>
          <Typography
            sx={textStyle}
            variant="subtitle2"
            color="secondary"
            component={Link}
            href="https://codedthemes.com"
            target="_blank"
            underline="hover"
          >
            CA Privacy Notice
          </Typography>
        </Stack>
      </Stack >
    </Container >
  )
}

export default AuthFooter
