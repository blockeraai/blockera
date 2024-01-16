// @flow

import { heading } from './heading';
import * as config from '../../base/config';

export default {
	heading: {
		...config,
		backgroundConfig: {
			...config.backgroundConfig,
			...heading,
		},
	},
};
