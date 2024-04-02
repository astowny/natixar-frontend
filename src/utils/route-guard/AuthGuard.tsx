// import { useEffect } from "react"
// import { useLocation, useNavigate } from "react-router-dom"
//
// // project import
// import useAuth from "hooks/useAuth"

// types
import { useFusionAuth } from "@fusionauth/react-sdk"
import { useEffect } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { GuardProps } from "types/auth"

// ==============================|| AUTH GUARD ||============================== //

const AuthGuard = ({ children }: GuardProps) => {
  // const { isLoggedIn } = useAuth()
  const { login, logout, register, isAuthenticated } = useFusionAuth()
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    if (false) {
      // if (!isAuthenticated) {
      navigate("login", {
        state: {
          from: location.pathname,
        },
        replace: true,
      })
    }
  }, [isAuthenticated, navigate, location])
  return children
}

export default AuthGuard
