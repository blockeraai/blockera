// @flow

/**
 * External dependencies
 */
import { dispatch } from '@wordpress/data';

/**
 * Internal dependencies
 */
import * as config from './config';
import { STORE_NAME } from './store/constants';

export const __experimentalExtensionsSupportRegistration = (): void => {
	Object.keys(config).forEach((name: string) =>
		dispatch(STORE_NAME).addExtension({
			name,
			supports: config[name],
		})
	);
};

export * from './config';
export * from './types';
export { SideEffect } from './components/side-effect';
export { store as ExtensionsSupportStore } from './store';
