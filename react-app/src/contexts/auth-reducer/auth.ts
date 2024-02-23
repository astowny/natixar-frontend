// action - state management
import { AuthProps, AuthActionProps } from "types/auth"
import { REGISTER, LOGIN, LOGOUT } from "./actions"

// types

// initial state
export const initialState: AuthProps = {
  isLoggedIn: false,
  isInitialized: false,
  user: null,
}

// ==============================|| AUTH REDUCER ||============================== //

const auth = (action: AuthActionProps, state = initialState) => {
  switch (action.type) {
    case REGISTER: {
      const { user } = action.payload!
      return {
        ...state,
        user,
      }
    }
    case LOGIN: {
      const { user } = action.payload!
      return {
        ...state,
        isLoggedIn: true,
        isInitialized: true,
        user,
      }
    }
    case LOGOUT: {
      return {
        ...state,
        isInitialized: true,
        isLoggedIn: false,
        user: null,
      }
    }
    default: {
      return { ...state }
    }
  }
}

export default auth
