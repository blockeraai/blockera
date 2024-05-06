// @flow

/**
 * Internal dependencies
 */
import { __experimentalExtensionsSupportRegistration } from './base';
import { __experimentalRegistrationInnerBlockExtensionCustomConfigDefinition } from './inner-blocks';

__experimentalExtensionsSupportRegistration();
__experimentalRegistrationInnerBlockExtensionCustomConfigDefinition();

export * from './utils';
export {
	StyleVariationsExtension,
	attributes as styleVariationsExtensionAttributes,
} from './style-variations';
export {
	LayoutExtensionIcon,
	LayoutStyles,
	LayoutExtension,
	attributes as layoutAttributes,
	supports as layoutSupports,
} from './layout';
export {
	FlexChildExtensionIcon,
	FlexChildStyles,
	FlexChildExtension,
	attributes as flexChildAttributes,
	supports as flexChildSupports,
} from './flex-child';
export {
	SizeStyles,
	SizeExtension,
	SizeExtensionIcon,
	supports as sizeSupports,
	attributes as sizeAttributes,
} from './size';
export {
	PositionExtensionIcon,
	PositionStyles,
	PositionExtension,
	attributes as positionAttributes,
	supports as positionSupports,
} from './position';
export {
	SpacingExtensionIcon,
	SpacingStyles,
	SpacingExtension,
	attributes as spacingAttributes,
	supports as spacingSupports,
} from './spacing';
export {
	BackgroundExtensionIcon,
	BackgroundStyles,
	BackgroundExtension,
	attributes as backgroundAttributes,
	supports as backgroundSupports,
} from './background';
export {
	BorderAndShadowExtensionIcon,
	BorderAndShadowStyles,
	BorderAndShadowExtension,
	attributes as borderAndShadowExtensionAttributes,
	supports as borderAndShadowExtensionSupports,
} from './border-and-shadow';
export {
	EffectsExtensionIcon,
	EffectsStyles,
	EffectsExtension,
	attributes as effectsExtensionAttributes,
	supports as effectsExtensionSupports,
} from './effects';
export {
	MouseExtensionIcon,
	MouseStyles,
	MouseExtension,
	attributes as mouseExtensionAttributes,
	supports as mouseExtensionSupports,
} from './mouse';
export {
	CustomStyleExtensionIcon,
	CustomStyleStyles,
	CustomStyleExtension,
	attributes as customStyleAttributes,
	supports as customStyleSupports,
} from './custom-style';
export {
	TypographyStyles,
	TypographyExtension,
	TypographyExtensionIcon,
	supports as typographyExtensionSupports,
	attributes as typographyExtensionAttributes,
} from './typography';
export {
	definitionTypes,
	InnerBlocksExtension,
	attributes as innerBlocksExtensionsAttributes,
} from './inner-blocks';
export * from './inner-blocks/icons';
export {
	EntranceAnimationExtensionIcon,
	EntranceAnimationExtension,
	attributes as entranceAnimationExtensionAttributes,
	supports as entranceAnimationExtensionSupports,
} from './entrance-animation';
export {
	SharedBlockExtension,
	attributes as sharedBlockExtensionAttributes,
	supports as sharedBlockExtensionSupports,
} from './shared';
export * as extensionConfig from './base/config';
export { __experimentalExtensionsSupportRegistration } from './base';
export { __experimentalRegistrationInnerBlockExtensionCustomConfigDefinition } from './inner-blocks';

export { attributes as blockStatesAttributes } from './block-states';
