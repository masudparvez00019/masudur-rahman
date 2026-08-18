import { DefaultSession, DefaultUser } from "next-auth"
import { JWT as DefaultJWT } from "next-auth/jwt"

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string
      isAdmin: boolean
    } & DefaultSession["user"]
    accessToken?: string
  }

  interface User extends DefaultUser {
    isAdmin: boolean
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    id: string
    isAdmin: boolean
    accessToken?: string
    accessTokenExpires?: number
    refreshToken?: string
  }
}
