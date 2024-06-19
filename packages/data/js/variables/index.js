// @flow
/**
 * External dependencies
 */
import { select } from '@wordpress/data';

export const getBlockEditorSettings = (): Object => {
	const { getSettings } = select('core/block-editor');

	return getSettings();
};

export {
	getLinearGradients,
	getLinearGradientBy,
	getLinearGradient,
} from './linear-gradient';
export {
	getRadialGradients,
	getRadialGradientBy,
	getRadialGradient,
} from './radial-gradient';
export {
	getLinearGradientVAFromIdString,
	getRadialGradientVAFromIdString,
	getGradientVAFromVarString,
	getGradientVAFromIdString,
	getGradientType,
} from './gradient';
export { getFontSizes, getFontSizeBy, getFontSize } from './font-size';
export { getSpacings, getSpacingBy, getSpacing } from './spacing';
export { getWidthSizes, getWidthSizeBy, getWidthSize } from './width-size';
export {
	getColors,
	getColorBy,
	getColor,
	getColorVAFromIdString,
	getColorVAFromVarString,
} from './color';
export { getVariable } from './get-variable';
export { generateVariableString } from './utils';

export * from './types';
