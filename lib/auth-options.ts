import type { NextAuthOptions, Adapter } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import clientPromise, { adapterClientPromise } from "./mongodb";
import bcrypt from "bcryptjs";
import type { JWT } from "next-auth/jwt";
import { User } from "./models";

// Validate environment variables
const requiredEnvVars = [
  "GOOGLE_CLIENT_ID",
  "GOOGLE_CLIENT_SECRET",
  "NEXTAUTH_SECRET",
];
requiredEnvVars.forEach((envVar) => {
  if (!process.env[envVar]) {
    throw new Error(`Environment variable ${envVar} is missing`);
  }
});

// Function to handle token rotation
async function refreshAccessToken(token: JWT) {
  try {
    if (!token.refreshToken) {
      console.warn("No refresh token available, cannot refresh");
      return {
        ...token,
        error: "NoRefreshToken",
        accessTokenExpires: Date.now() + 60 * 60 * 1000, // Extend by 1 hour
      };
    }

    const response = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID!,
        client_secret: process.env.GOOGLE_CLIENT_SECRET!,
        refresh_token: token.refreshToken as string,
        grant_type: "refresh_token",
      }).toString(),
    });

    const refreshedTokens = await response.json();

    if (!response.ok || !refreshedTokens.access_token) {
      console.error("Token refresh failed:", refreshedTokens);
      return {
        ...token,
        error: "RefreshFailed",
        accessTokenExpires: Date.now() + 60 * 60 * 1000, // Extend by 1 hour
      };
    }

    return {
      ...token,
      accessToken: refreshedTokens.access_token,
      accessTokenExpires: Date.now() + (refreshedTokens.expires_in || 3600) * 1000,
      refreshToken: refreshedTokens.refresh_token ?? token.refreshToken,
      error: undefined,
    };
  } catch (error) {
    console.error("Error refreshing access token:", error);
    return {
      ...token,
      error: "RefreshAccessTokenError",
      accessTokenExpires: Date.now() + 60 * 60 * 1000, // Extend by 1 hour
    };
  }
}

export const authOptions: NextAuthOptions = {
  adapter: MongoDBAdapter(adapterClientPromise, {
    databaseName: "portfolio",
  }) as Adapter,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required");
        }

        try {
          const client = await clientPromise;
          const db = client.db("portfolio");
          const user = await db.collection("users").findOne({ email: credentials.email });

          if (!user || !user.password) {
            throw new Error("Invalid credentials");
          }

          const passwordMatch = await bcrypt.compare(credentials.password, user.password);

          if (!passwordMatch) {
            throw new Error("Invalid credentials");
          }

          return {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            image: user.image,
            isAdmin: !!user.isAdmin, // Ensure boolean
          };
        } catch (error) {
          console.error("Authorize error:", error);
          throw new Error("Authentication failed");
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 24 hours
  },
  cookies: {
    sessionToken: {
      name: "next-auth.session-token",
      options: {
        httpOnly: true,
        sameSite: "strict", // Stricter for security
        path: "/",
        secure: process.env.NODE_ENV === "production",
        maxAge: 30 * 24 * 60 * 60, // 30 days
      },
    },
    callbackUrl: {
      name: "next-auth.callback-url",
      options: {
        httpOnly: true,
        sameSite: "strict",
        path: "/",
        secure: process.env.NODE_ENV === "production",
        maxAge: 30 * 24 * 60 * 60,
      },
    },
    csrfToken: {
      name: "next-auth.csrf-token",
      options: {
        httpOnly: true,
        sameSite: "strict",
        path: "/",
        secure: process.env.NODE_ENV === "production",
        maxAge: 30 * 24 * 60 * 60,
      },
    },
  },
  callbacks: {
    async signIn({ user, account }) {
      const client = await clientPromise;
      const db = client.db("portfolio");

      // Update login history
      if (user.id) {
        try {
          const loginInfo = {
            timestamp: new Date(),
            ip: "127.0.0.1", // Replace with actual IP in production
            userAgent: "Unknown", // Replace with actual UA in production
          };

          await db.collection("users").updateOne(
            { _id: user.id },
            {
              $set: { lastLogin: new Date() },
              $push: { loginHistory: loginInfo },
            }
          );
        } catch (error) {
          console.error("Error updating login history:", error);
        }
      }

      // Handle Google sign-in
      if (account?.provider === "google") {
        try {
          const existingUser = await db.collection("users").findOne({ email: user.email });

          if (existingUser) {
            const existingAccount = await db.collection("accounts").findOne({
              provider: "google",
              providerAccountId: account.providerAccountId,
            });

            if (!existingAccount) {
              await db.collection("accounts").insertOne({
                provider: "google",
                providerAccountId: account.providerAccountId,
                access_token: account.access_token,
                expires_at: account.expires_at,
                refresh_token: account.refresh_token,
                token_type: account.token_type,
                scope: account.scope,
                userId: existingUser._id,
              });
            }
            user.id = existingUser._id.toString();
            user.isAdmin = !!existingUser.isAdmin; // Ensure boolean
          }
          return true;
        } catch (error) {
          console.error("SignIn error for Google:", error);
          return false;
        }
      }

      return true;
    },
    async jwt({ token, user, account }) {
      if (account && user) {
        return {
          ...token,
          accessToken: account.access_token,
          accessTokenExpires: account.expires_at ? account.expires_at * 1000 : Date.now() + 60 * 60 * 1000,
          refreshToken: account.refresh_token,
          id: user.id,
          isAdmin: !!user.isAdmin, // Ensure boolean
        };
      }

      if (token.accessTokenExpires && Date.now() < token.accessTokenExpires) {
        return token;
      }

      return await refreshAccessToken(token);
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.isAdmin = !!token.isAdmin; // Ensure boolean
        session.accessToken = token.accessToken;
        console.log("Session created:", {
          userId: session.user.id,
          isAdmin: session.user.isAdmin,
        });
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  debug: process.env.NODE_ENV === "development",
};