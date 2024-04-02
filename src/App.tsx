import { RouterProvider } from "react-router-dom"

// project import
import router from "routes"

import ThemeCustomization from "themes"

import Locales from "components/Locales"
import RTLLayout from "components/RTLLayout"
import ScrollTop from "components/ScrollTop"
import Snackbar from "components/@extended/Snackbar"
import Notistack from "components/third-party/Notistack"
import { LocalizationProvider } from "@mui/x-date-pickers"
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns"

import { store } from "data/store"
import { Provider } from "react-redux"

// auth-provider
import { JWTProvider as AuthProvider } from "contexts/JWTContext"
import { FusionAuthProvider } from "@fusionauth/react-sdk"

// ==============================|| APP - THEME, ROUTER, LOCAL ||============================== //

const App = () => (
  <ThemeCustomization>
    <Provider store={store}>
      <RTLLayout>
        <Locales>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <ScrollTop>
              <FusionAuthProvider
                clientID="5e9cba0b-4978-4a24-88c0-0a45b0ed067f"
                serverUrl="http://auth.natixar.pro:9011"
                redirectUri="http://localhost:3000"
              >
                <AuthProvider>
                  <Notistack>
                    <RouterProvider router={router} />
                    <Snackbar />
                  </Notistack>
                </AuthProvider>
              </FusionAuthProvider>
            </ScrollTop>
          </LocalizationProvider>
        </Locales>
      </RTLLayout>
    </Provider>
  </ThemeCustomization>
)

export default App
