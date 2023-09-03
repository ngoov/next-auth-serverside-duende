import NextAuth, { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import FacebookProvider from "next-auth/providers/facebook"
import GithubProvider from "next-auth/providers/github"
import TwitterProvider from "next-auth/providers/twitter"
import Auth0Provider from "next-auth/providers/auth0"

// For more information on each option (and a full list of options) go to
// https://next-auth.js.org/configuration/options
export const authOptions: NextAuthOptions = {
  // https://next-auth.js.org/configuration/providers/oauth
  providers: [
    {
      id: "idsrv",
      clientId: 'interactive.confidential',
      clientSecret: 'secret',
      name: "Duende IdentityServer",
      type: "oauth",
      wellKnown: "https://demo.duendesoftware.com/.well-known/openid-configuration",
      authorization: { params: { scope: "openid profile email api offline_access" } },
      idToken: true,
      checks: ['pkce'],
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
        }
      },
    }
  ],
  callbacks: {
    async jwt({ token }) {
      token.userRole = "admin"
      return token
    },
  },
  debug: true,
}

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
