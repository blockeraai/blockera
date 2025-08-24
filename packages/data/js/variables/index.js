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
	getLinearGradientsTitle,
	getLinearGradients,
	getLinearGradientBy,
	getLinearGradient,
} from './linear-gradient';
export {
	getRadialGradientsTitle,
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
export {
	getFontSizes,
	getFontSizeBy,
	getFontSize,
	getFontSizesTitle,
} from './font-size';
export {
	getSpacingsTitle,
	getSpacings,
	getSpacingBy,
	getSpacing,
	getSpacingVAFromIdString,
	getSpacingVAFromVarString,
} from './spacing';
export {
	getWidthSizesTitle,
	getWidthSizes,
	getWidthSizeBy,
	getWidthSize,
} from './width-size';
export {
	getColors,
	getColorBy,
	getColor,
	getColorVAFromIdString,
	getColorVAFromVarString,
} from './color';
export { getVariable } from './get-variable';
export {
	generateVariableString,
	generateAttributeVarStringFromVA,
} from './utils';

export * from './types';
export * from './store/types';
