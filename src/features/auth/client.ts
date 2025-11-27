import { createAuthClient } from 'better-auth/react';

import { envClient } from 'src/env/client';

export const authClient = createAuthClient({
  baseURL:
    typeof window === 'undefined'
      ? envClient.VITE_BASE_URL
      : window.location.origin,
});
