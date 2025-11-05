// utils/authNormalizer.ts
import type { User } from "@/redux/auth/authSlice"

// Define all possible response types
interface RegistrationResponse {
  status: boolean
  message: string
  data: User
  token: string
}

interface VerificationResponse {
  status: boolean
  message: string
  token: string
  user: User
}

interface LogInResponse {
  0: User
  token: string
}

type authResponse = RegistrationResponse | VerificationResponse | LogInResponse

export const normalizeAuthResponse = (response: authResponse): { user: User; token: string } => {

  if ('0' in response && response[0]) {
    return {
      user: response[0],
      token: response.token
    }
  }
  

  if ('user' in response) {
    return {
      user: response.user,
      token: response.token
    }
  }
  

  if ('data' in response) {
    return {
      user: response.data,
      token: response.token
    }
  }
  
  throw new Error('Invalid login response format')
}