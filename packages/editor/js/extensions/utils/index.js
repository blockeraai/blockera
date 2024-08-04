// @flow

/**
 * External dependencies
 */
import { dispatch } from '@wordpress/data';

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
