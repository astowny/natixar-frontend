// material-ui
import { Stack } from "@mui/material"

import {
  FusionAuthLoginButton,
  FusionAuthRegisterButton,
} from "@fusionauth/react-sdk"

const LoginButtons = () => (
  <Stack>
    <FusionAuthLoginButton />
    <FusionAuthRegisterButton />
  </Stack>
)

export default LoginButtons
