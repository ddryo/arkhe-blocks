/**
 * extension
 */
import '@src/extension/headbar.js';

/**
 * @FontAwesome dependencies
 */
import { library, dom } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
library.add(fas);
dom.watch();
