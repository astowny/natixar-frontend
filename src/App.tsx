import { RouterProvider } from "react-router-dom"

// project import
import router from "routes"

import ThemeCustomization from "themes"

import Locales from "components/Locales"
import RTLLayout from "components/RTLLayout"
import ScrollTop from "components/ScrollTop"
import Snackbar from "components/@extended/Snackbar"
import Notistack from "components/third-party/Notistack"

import { store } from "data/store"
import { Provider } from "react-redux"

// auth-provider
import { JWTProvider as AuthProvider } from "contexts/JWTContext"

// ==============================|| APP - THEME, ROUTER, LOCAL ||============================== //

const App = () => (
  <ThemeCustomization>
    <Provider store={store}>
      <RTLLayout>
        <Locales>
          <ScrollTop>
            <AuthProvider>
              <Notistack>
                <RouterProvider router={router} />
                <Snackbar />
              </Notistack>
            </AuthProvider>
          </ScrollTop>
        </Locales>
      </RTLLayout>
    </Provider>
  </ThemeCustomization>
)

export default App
