// @flow

/**
 * External dependencies
 */
import { dispatch } from '@wordpress/data';

/**
 * Internal dependencies
 */
import size from '../../schemas/block-supports/size-block-supports-list.json';
import mouse from '../../schemas/block-supports/mouse-block-supports-list.json';
import border from '../../schemas/block-supports/border-block-supports-list.json';
import layout from '../../schemas/block-supports/layout-block-supports-list.json';
import effects from '../../schemas/block-supports/effects-block-supports-list.json';
import divider from '../../schemas/block-supports/divider-block-supports-list.json';
import outline from '../../schemas/block-supports/outline-block-supports-list.json';
import spacing from '../../schemas/block-supports/spacing-block-supports-list.json';
import position from '../../schemas/block-supports/position-block-supports-list.json';
import boxShadow from '../../schemas/block-supports/box-shadow-block-supports-list.json';
import background from '../../schemas/block-supports/background-block-supports-list.json';
import typography from '../../schemas/block-supports/typography-block-supports-list.json';
import textShadow from '../../schemas/block-supports/text-shadow-block-supports-list.json';

export const resetExtensionSettings = () => {
	const {
		changeExtensionCurrentBlock: setCurrentBlock,
		changeExtensionCurrentBlockState: setCurrentState,
		changeExtensionInnerBlockState: setInnerBlockState,
		// changeExtensionCurrentBlockStateBreakpoint: setCurrentBreakpoint,
	} = dispatch('blockera/extensions') || {};

	setCurrentBlock('master');
	setCurrentState('normal');
	setInnerBlockState('normal');
	// setCurrentBreakpoint('laptop');
};

/**
 * Get block support details with support name.
 *
 * @param {string} name the support name, useful to access support details.
 * @return {*} the block support category config.
 */
export const getBlockSupportCategory = (name: string): Object => {
	const supports = {
		size,
		mouse,
		border,
		layout,
		effects,
		divider,
		outline,
		spacing,
		position,
		boxShadow,
		background,
		typography,
		textShadow,
	};

	return supports[name]?.supports;
};

/**
 *
 * @param {Object} supports the block supports list of support category.
 * @param {string} support the support name.
 *
 * @return {Object} the support details.
 */
export const getBlockSupportFallback = (
	supports: Object,
	support: string
): Object => {
	return supports?.find((_support): boolean => _support?.name === support)
		?.fallback;
};
