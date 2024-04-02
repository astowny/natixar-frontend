import React, { createContext, useEffect, useReducer } from "react"

// third-party
import { Chance } from "chance"
import jwtDecode from "jwt-decode"

// reducer - state management
import { LOGIN, LOGOUT } from "contexts/auth-reducer/actions"
import authReducer from "contexts/auth-reducer/auth"

// project import
import Loader from "components/Loader"
import axios from "utils/axios"
import { KeyedObject } from "types/root"
import { AuthProps, JWTContextType } from "types/auth"
import { fusionConfig } from "config"
import { IFusionAuthContext, useFusionAuth } from "@fusionauth/react-sdk"

const chance = new Chance()

// constant
const initialState: AuthProps = {
  isLoggedIn: false,
  isInitialized: false,
  user: null,
}

const verifyToken: (st: string) => boolean = (serviceToken) => {
  if (!serviceToken) {
    return false
  }
  const decoded: KeyedObject = jwtDecode(serviceToken)
  /**
   * Property 'exp' does not exist on type '<T = unknown>(token: string, options?: JwtDecodeOptions | undefined) => T'.
   */
  return decoded.exp > Date.now() / 1000
}

const setSession = (serviceToken?: string | null) => {
  if (serviceToken) {
    localStorage.setItem("serviceToken", serviceToken)
    axios.defaults.headers.common.Authorization = `Bearer ${serviceToken}`
  } else {
    localStorage.removeItem("serviceToken")
    delete axios.defaults.headers.common.Authorization
  }
}

// ==============================|| JWT CONTEXT & PROVIDER ||============================== //

const JWTContext = createContext<IFusionAuthContext | null>(null)

export const JWTProvider = ({ children }: { children: React.ReactElement }) => {
  // @ts-ignore
  // const [state, dispatch] = useReducer(authReducer, initialState)

  useEffect(() => {
    const init = async () => {
      try {
        const serviceToken = window.localStorage.getItem("serviceToken")
        if (serviceToken && verifyToken(serviceToken)) {
          setSession(serviceToken)
          const response = await axios.get("/api/account/me")
          const { user } = response.data
          dispatch({
            type: LOGIN,
            payload: {
              isLoggedIn: true,
              user,
            },
          })
        } else {
          dispatch({
            type: LOGOUT,
          })
        }
      } catch (err) {
        console.error(err)
        dispatch({
          type: LOGOUT,
        })
      }
    }

    init()
  }, [])

  return (
    <JWTContext.Provider value={useFusionAuth()}>
      {children}
    </JWTContext.Provider>
  )
}

export default JWTContext
