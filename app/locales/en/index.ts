import zod from 'zod-i18n-map/locales/en/zod.json' assert { type: 'json' };
import 'dayjs/locale/en.js';

import auth from './auth.json' assert { type: 'json' };
import buildInfo from './build-info.json' assert { type: 'json' };
import common from './common.json' assert { type: 'json' };
import components from './components.json' assert { type: 'json' };
import cv from './cv.json' assert { type: 'json' };
import demo from './demo.json' assert { type: 'json' };
import emails from './emails.json' assert { type: 'json' };
import layout from './layout.json' assert { type: 'json' };
import user from './user.json' assert { type: 'json' };

export default {
  auth,
  buildInfo,
  common,
  components,
  cv,
  demo,
  emails,
  layout,
  user,
  zod,
} as const;
