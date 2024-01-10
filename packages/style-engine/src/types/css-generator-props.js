// @flow

/**
 * Publisher dependencies
 */
import type { TBreakpoint } from '@publisher/extensions/src/libs/block-states/types';

export type CssGeneratorProps = {
	blockName: string,
	supportId: string,
	attributes: Object,
	activeDeviceType: TBreakpoint,
	callbackProps: {
		typographyConfig: Object,
		backgroundConfig: Object,
		borderAndShadowConfig: Object,
		effectsConfig: Object,
		spacingConfig: Object,
		positionConfig: Object,
		sizeConfig: Object,
		layoutConfig: Object,
		iconConfig: Object,
		advancedConfig: Object,
		flexChildConfig: Object,
		mouseConfig: Object,
		blockProps: {
			clientId: string,
			supports: Object,
		},
	},
	callback: (stylesProps: Object) => string,
	fallbackSupportId?: string,
};
