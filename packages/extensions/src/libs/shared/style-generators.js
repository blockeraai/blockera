/**
 * Internal dependencies
 */
import { SizeStyles } from '../size';
import { IconStyles } from '../icon';
import { MouseStyles } from '../mouse';
import { LayoutStyles } from '../layout';
import { FlexChildStyles } from '../flex-child';
import { SpacingStyles } from '../spacing';
import { EffectsStyles } from '../effects';
import { PositionStyles } from '../position';
import { AdvancedStyles } from '../advanced';
import { TypographyStyles } from '../typography';
import { BackgroundStyles } from '../background';
import { BorderAndShadowStyles } from '../border-and-shadow';
import { GridChildStyles } from '../grid-child';

export default {
	publisherSize: {
		callback: SizeStyles,
	},
	publisherIcon: {
		callback: IconStyles,
	},
	publisherMouse: {
		callback: MouseStyles,
	},
	publisherLayout: {
		callback: LayoutStyles,
	},
	publisherFlexChild: {
		callback: FlexChildStyles,
	},
	publisherSpacing: {
		callback: SpacingStyles,
		fallbackSupportId: 'spacing',
	},
	publisherEffects: {
		callback: EffectsStyles,
	},
	publisherPosition: {
		callback: PositionStyles,
	},
	publisherAdvancedStyles: {
		callback: AdvancedStyles,
	},
	publisherTypography: {
		callback: TypographyStyles,
	},
	publisherBackground: {
		callback: BackgroundStyles,
	},
	publisherBorderAndShadow: {
		callback: BorderAndShadowStyles,
	},
	publisherGridChild: {
		callback: GridChildStyles,
	},
};
