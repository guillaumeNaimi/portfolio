import { db } from '@/server/db';

import { createCV } from './cv';

async function main() {
  await createCV();
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => {
    db.$disconnect();
  });
