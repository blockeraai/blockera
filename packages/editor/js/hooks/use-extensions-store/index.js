// @flow

/**
 * External dependencies
 */
import { useSelect, select, dispatch } from '@wordpress/data';

/**
 * Internal dependencies
 */
import { getBaseBreakpoint } from '../../canvas-editor';
import type { ExtensionsStoreType } from './ExtensionsStoreType';
import { isInnerBlock } from '../../extensions/components/utils';
import { STORE_NAME } from '../../extensions/libs/base/store/constants';
import type { InnerBlockType } from '../../extensions/libs/block-card/inner-blocks/types';

/**
 * Get extensions config order by block name and current block type.
 *
 * @param {string} blockName the WordPress block name.
 * @param {'master' | InnerBlockType | string} currentBlock the current block type.
 *
 * @return {Object} the extensions config.
 */
export function getExtensionConfig(
	blockName: string,
	currentBlock: 'master' | InnerBlockType | string
): Object {
	// Access to extensions configuration for master and inner block from Blockera internal base extension store apis.
	const { getExtensions, getDefinition } = select(STORE_NAME);
	// By default config store master block configuration.
	let config = getExtensions(blockName);

	// Assume current block is one of inner block types,
	// in this case we should override extensions configuration order by current block identifier and selected block name.
	if (isInnerBlock(currentBlock)) {
		const innerBlockConfig = getDefinition(currentBlock, blockName);

		if (innerBlockConfig) {
			config = innerBlockConfig;
		}
	}

	return config;
}

export const useExtensionsStore = (props: Object): ExtensionsStoreType => {
	const {
		config,
		currentBlock = 'master',
		currentState = 'normal',
		currentInnerBlockState = 'normal',
		currentBreakpoint = getBaseBreakpoint(),
	} = useSelect((select) => {
		const { getSelectedBlock } = select('core/block-editor');
		const { name, clientId } = getSelectedBlock() || props || {};
		const {
			getActiveInnerState,
			getActiveMasterState,
			getExtensionCurrentBlock,
			getExtensionCurrentBlockStateBreakpoint,
		} = select('blockera/extensions');

		const currentBlock = getExtensionCurrentBlock();

		return {
			currentBlock,
			config: getExtensionConfig(name, currentBlock),
			currentState: getActiveMasterState(clientId, name),
			currentBreakpoint: getExtensionCurrentBlockStateBreakpoint(),
			currentInnerBlockState: getActiveInnerState(clientId, currentBlock),
		};
	});

	const { changeExtensionCurrentBlockStateBreakpoint } = dispatch(
		'blockera/extensions'
	);

	return {
		config,
		currentState,
		currentBlock,
		currentBreakpoint,
		currentInnerBlockState,
		setCurrentBreakpoint: changeExtensionCurrentBlockStateBreakpoint,
	};
};
