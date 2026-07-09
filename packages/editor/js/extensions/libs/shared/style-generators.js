/**
 * Internal dependencies
 */
import { SizeStyles } from '../size';
import { MouseStyles } from '../mouse';
import { LayoutStyles } from '../layout';
import { FlexChildStyles } from '../flex-child';
import { SpacingStyles } from '../spacing';
import { EffectsStyles } from '../effects';
import { PositionStyles } from '../position';
import { CustomStyleStyles } from '../custom-style';
import { TypographyStyles } from '../typography';
import { BackgroundStyles } from '../background';
import { BorderAndShadowStyles } from '../border-and-shadow';

export default {
	blockeraSize: {
		callback: SizeStyles,
	},
	blockeraIcon: {
		callback: IconStyles,
	},
	blockeraMouse: {
		callback: MouseStyles,
	},
	blockeraLayout: {
		callback: LayoutStyles,
	},
	blockeraFlexChild: {
		callback: FlexChildStyles,
	},
	blockeraSpacing: {
		callback: SpacingStyles,
		fallbackSupportId: 'spacing',
	},
	blockeraEffects: {
		callback: EffectsStyles,
	},
	blockeraPosition: {
		callback: PositionStyles,
	},
	blockeraCustomStyle: {
		callback: CustomStyleStyles,
	},
	blockeraTypography: {
		callback: TypographyStyles,
	},
	blockeraBackground: {
		callback: BackgroundStyles,
	},
	blockeraBorderAndShadow: {
		callback: BorderAndShadowStyles,
	},
};
