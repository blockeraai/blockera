// @flow

/**
 * External dependencies
 */
import { dispatch } from '@wordpress/data';

/**
 * Blockera dependencies
 */
import { mergeObject } from '@blockera/utils';

/**
 * Internal dependencies
 */
import * as config from './config';
import { STORE_NAME } from './store/constants';
import { applyFilters } from '@wordpress/hooks';

export const registerBlockExtensionsSupports = (
	blockName: string,
	externalConfig?: Object
): void => {
	const extensionsConfig = applyFilters(
		'blockera.extensions.supports.configuration',
		mergeObject(config, externalConfig || {})
	);

	Object.keys(extensionsConfig).forEach((name: string) => {
		const targetBlock = blockName.replace(/\//g, '.');
		dispatch(STORE_NAME).addExtension({
			name,
			blockName,
			supports: applyFilters(
				`blockera.block.${targetBlock}.extension.${name}`,
				extensionsConfig[name],
				name,
				targetBlock
			),
		});
	});
};

export * from './config';
export * from './types';
export { SideEffect } from './components/side-effect';
export {
	store as ExtensionsSupportStore,
	STORE_NAME as EXTENSIONS_SUPPORT_STORE_NAME,
} from './store';
