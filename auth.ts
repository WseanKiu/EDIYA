import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import { AUTHOR_BY_GITHUB_ID_QUERY } from "./sanity/lib/queries";
import { client } from "./sanity/lib/client";
import { writeClient } from "./sanity/lib/write-client";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [GitHub, Google],
  callbacks: {
    async signIn({ user, account, profile }) {
      let id, login, bio;
      if (account.provider === "github") {
        id = profile.id.toString();
        login = profile.login;
        bio = profile.bio;
      } else if (account.provider === "google") {
        id = profile.sub;
        login = profile.email.split("@")[0];
        bio = profile.bio || "";
      } else {
        return true;
      }

      const existingUser = await client
        .withConfig({ useCdn: false })
        .fetch(AUTHOR_BY_GITHUB_ID_QUERY, { id });

      if (!existingUser) {
        await writeClient.create({
          _type: "author",
          id,
          name: user.name,
          username: login,
          email: user.email,
          image: user.image,
          bio,
        });
      }

      return true;
    },
    async jwt({ token, account, profile }) {
      if (account && profile) {
        const id =
          account.provider === "github" ? profile?.id.toString() : profile.sub;

        const user = await client
          .withConfig({ useCdn: false })
          .fetch(AUTHOR_BY_GITHUB_ID_QUERY, { id });
        token.id = user?._id;
      }
      return token;
    },

    async session({ session, token }) {
      Object.assign(session, { id: token.id });
      return session;
    },

    async redirect({ url, baseUrl }) {
      // Prevent redirecting to /login after successful authentication
      if (url.endsWith("/login")) {
        return baseUrl;
      }
      // Allows relative callback URLs
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
  },
});
