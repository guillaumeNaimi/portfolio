import { db } from '@/server/db';

import { createCV } from './cv';
import { createUsers } from './user';

async function main() {
  await createUsers();
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
