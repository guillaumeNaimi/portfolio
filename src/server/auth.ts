import { betterAuth } from "better-auth";

import { envServer } from "@/env/server";

export const auth = betterAuth({
  socialProviders: {
    github: {
      clientId: envServer.GITHUB_CLIENT_ID as string,
      clientSecret: envServer.GITHUB_CLIENT_SECRET as string,
    },
  },
});
