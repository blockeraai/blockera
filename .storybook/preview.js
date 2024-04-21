/**
 * Storybook dependencies
 */
import { withTests } from '@storybook/addon-jest';

/**
 *  Storybook dependencies
 */
import { defaultPreviewConfig } from '@blockera/storybook';

/**
 * Internal dependencies
 */
import results from '../.jest-test-results.json';

export default {
	...defaultPreviewConfig,
	globals: {
		direction: 'ltr',
		css: 'wordpress',
		marginChecker: 'hide',
		maxWidthWrapper: 'none',
		componentsTheme: 'classic',
	},
};

export const WithJestTests = withTests({ results });
export { WithPlaygroundStyles } from './decorators/with-playground-styles';

