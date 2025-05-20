// @flow

/**
 * External dependencies
 */
import { dispatch } from '@wordpress/data';
import { applyFilters } from '@wordpress/hooks';

/**
 * Internal dependencies
 */
import * as config from '../base/config';
import { STORE_NAME } from '../base/store';
import type { InnerBlocks } from './types';

export const registerInnerBlockExtensionsSupports = (
	blockName: string,
	innerBlockModels: InnerBlocks,
	externalConfig?: Object
): void => {
	/**
	 * Filterable innerBlocksExtensionConfig list before registration process.
	 *
	 * hook: `blockera.extensions.innerBlocks.config`
	 *
	 * @since 1.0.0
	 *
	 * @type {Object}
	 */
	const innerBlocksExtensionsConfig = applyFilters(
		'blockera.extensions.innerBlocks.config',
		externalConfig || config
	);

	Object.keys(innerBlockModels).forEach((definition: string): void => {
		Object.keys(innerBlocksExtensionsConfig).forEach(
			(name: string): void => {
				const { addDefinition } = dispatch(STORE_NAME);

				addDefinition({
					name,
					blockName,
					definition,
					extensions: innerBlocksExtensionsConfig[name],
				});
			}
		);
	});
};

export * from './extension';
export * from './helpers';
