// material-ui
import { Box, Stack, Typography } from "@mui/material"
import Logo from "components/logo"
import authImage from "assets/images/auth/auth_img.png"

// project import
import AuthLogin from "sections/auth/auth-forms/AuthLogin"
import { width } from "@mui/system"

// ================================|| LOGIN ||================================ //

const Login = () => (
  <Stack
    direction="row"
    sx={{
      minHeight: "100dvh",
      maxHeight: "100dvh",
      height: "100%",
    }}
  >
    <Stack
      sx={{
        p: 4,
        pt: 6,
        minWidth: "40rem",
      }}
      direction="column"
      justifyContent="center"
      alignItems="center"
      gap={4}
    >
      <Logo />
      <Typography variant="h3">Welcome to Natixar SaaS</Typography>
      <AuthLogin sx={{ width: "80%" }} />
    </Stack>
    <Box
      sx={{
        flexGrow: 1,
        p: 4,
        py: 8,
        background:
          "linear-gradient(135deg, rgba(50,108,244,1) 0%, rgba(171,35,100,1) 100%)",
      }}
    >
      <img
        src={authImage}
        alt=""
        style={{
          width: "100%",
          height: "100%",
          objectFit: "scale-down",
          objectPosition: "center",
        }}
      />
    </Box>
  </Stack>
)
// const Login = () => {
//   const { isLoggedIn } = useAuth()

//   return (
//     <AuthWrapper>
//       <Grid container spacing={3}>
//         <Grid item xs={12}>
//           <Stack
//             direction="row"
//             justifyContent="space-between"
//             alignItems="baseline"
//             sx={{ mb: { xs: -0.5, sm: 0.5 } }}
//           >
//             <Typography variant="h3" sx={{
//               fontWeight: '800',
//               fontFamily: 'Urbanist',
//               color: '#30698E'
//             }}>Sign in</Typography>
//           </Stack>
//         </Grid>
//         <Grid item xs={12}>
//           <AuthLogin isDemo={isLoggedIn} />
//         </Grid>
//       </Grid>
//     </AuthWrapper>
//   )
// }

export default Login
