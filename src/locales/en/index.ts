import 'dayjs/locale/en.js';

import auth from './auth.json' with { type: 'json' };
import buildInfo from './build-info.json' with { type: 'json' };
import common from './common.json' with { type: 'json' };
import components from './components.json' with { type: 'json' };
import cv from './cv.json' with { type: 'json' };
import demo from './demo.json' with { type: 'json' };
import emails from './emails.json' with { type: 'json' };
import layout from './layout.json' with { type: 'json' };
import user from './user.json' with { type: 'json' };

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
} as const;
