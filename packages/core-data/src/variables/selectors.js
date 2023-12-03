// @flow
/**
 * External dependencies
 */
import { select } from '@wordpress/data';

export const getBlockEditorSettings = (): Object => {
	const { getSettings } = select('core/block-editor');

	return getSettings();
};

export { getGradients, getGradientBy, getGradient } from './gradient';
export { getFontSizes, getFontSizeBy, getFontSize } from './font-size';
