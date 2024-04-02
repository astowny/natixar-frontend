import {
  FusionAuthLoginButton,
  FusionAuthLogoutButton,
  FusionAuthRegisterButton,
} from "@fusionauth/react-sdk"

export const LoginPage = () => (
  <>
    <h1>Welcome, please log in or register</h1>
    <FusionAuthLoginButton />
    <FusionAuthRegisterButton />
  </>
)

export const AccountPage = () => (
  <>
    <h1>Hello, user!</h1>
    <FusionAuthLogoutButton />
  </>
)
