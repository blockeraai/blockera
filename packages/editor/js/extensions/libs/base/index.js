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

export const registerBlockExtensionsSupports = (
	blockName: string,
	externalConfig?: Object
): void => {
	Object.keys(externalConfig || config).forEach((name: string) =>
		dispatch(STORE_NAME).addExtension({
			name,
			blockName,
			supports: (externalConfig || config)[name],
		})
	);
};

export * from './config';
export * from './types';
export { SideEffect } from './components/side-effect';
export {
	store as ExtensionsSupportStore,
	STORE_NAME as EXTENSIONS_SUPPORT_STORE_NAME,
} from './store';
