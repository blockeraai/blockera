// @flow

/**
 * External dependencies
 */
import { useSelect } from '@wordpress/data';

/**
 * Internal dependencies
 */
import { STORE_NAME } from '../../../extensions/store/constants';
import {
	getBlockVariationSupport,
	type BlockVariationSupport,
} from './block-variation-support';

/**
 * BlockType style/size variation flags for a WordPress block name.
 *
 * @param {?string} blockName e.g. core/button; when empty, defaults apply.
 */
export function useBlockVariationSupport(
	blockName?: ?string
): BlockVariationSupport {
	return useSelect(
		(select) => {
			const { getBlockExtensionBy } = select(STORE_NAME) || {};

			if (!blockName || typeof getBlockExtensionBy !== 'function') {
				return getBlockVariationSupport(null);
			}

			return getBlockVariationSupport(
				getBlockExtensionBy('targetBlock', blockName)
			);
		},
		[blockName]
	);
}
