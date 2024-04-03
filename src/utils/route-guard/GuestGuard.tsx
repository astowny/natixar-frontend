import { useFusionAuth } from "@fusionauth/react-sdk"
import { useEffect } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { GuardProps } from "types/auth"

// ==============================|| AUTH GUARD ||============================== //

const GuestGuard = ({ children }: GuardProps) => {
  const { isAuthenticated } = useFusionAuth()
  const navigate = useNavigate()
  const location = useLocation()
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/")
    }
  }, [isAuthenticated, navigate, location])
  return children
}

export default GuestGuard
