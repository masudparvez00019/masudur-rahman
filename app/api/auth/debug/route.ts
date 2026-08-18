import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth-options"
import { getToken } from "next-auth/jwt"

export async function GET(req: NextRequest) {
  try {
    // Get session using getServerSession
    const session = await getServerSession(authOptions)
    
    // Get token directly using getToken with the same options as middleware
    const token = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET,
      secureCookie: process.env.NODE_ENV === "production",
    })
    
    // Get environment info that affects auth
    const envInfo = {
      nodeEnv: process.env.NODE_ENV,
      nextAuthUrl: process.env.NEXTAUTH_URL,
      cookieDomain: process.env.COOKIE_DOMAIN,
      hasSecret: !!process.env.NEXTAUTH_SECRET,
      vercelEnv: process.env.VERCEL_ENV || 'not-vercel',
    }
    
    // Get cookies info without exposing values
    const cookieHeader = req.headers.get("cookie") || ""
    const cookieInfo = cookieHeader === "" 
      ? { count: 0, names: [] } 
      : {
          count: cookieHeader.split(';').length,
          names: cookieHeader.split(';').map(c => {
            const name = c.split('=')[0]?.trim()
            return name || "unnamed"
          }),
        }
        
    // Return enhanced diagnostics
    return NextResponse.json({
      status: "success",
      environment: process.env.NODE_ENV,
      timestamp: new Date().toISOString(),
      auth: {
        hasSession: !!session,
        hasToken: !!token,
        isAuthenticated: !!(session || token),
        userId: session?.user?.id || token?.id || null,
        userEmail: session?.user?.email || null,
        isAdmin: session?.user?.isAdmin === true,
        tokenError: token?.error || null,
      },
      environment: envInfo,
      cookies: cookieInfo,
      requestInfo: {
        url: req.url,
        host: req.headers.get("host") || "unknown",
        referrer: req.headers.get("referer") || "unknown",
        hasAuthorization: !!req.headers.get("authorization"),
      },
    })
  } catch (error) {
    console.error("Auth debug error:", error)
    return NextResponse.json({
      status: "error",
      message: error instanceof Error ? error.message : "Unknown error",
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
    }, { status: 500 })
  }
}
