// @flow

/**
 * Blockera dependencies
 */
import { SharedBlockExtension } from '@blockera/editor';
import { mergeObjects } from '@blockera/utils';
import { CoreIconCanvasEdit } from '@blockera/feature-icon';

/**
 * Internal dependencies
 */
import type { BlockType } from '../../../type';

export const Icon: BlockType = {
	name: 'blockeraIconCore',
	targetBlock: 'core/icon',
	edit: (props) => {
		return <SharedBlockExtension {...props} />;
	},
	canvasEdit: CoreIconCanvasEdit,
	hasSizeVariations: true,
	blockFeatures: {
		icon: {
			status: true,
			// Canvas preview is owned by canvasEdit — avoid editor DOM htmlEditable side effects.
			htmlEditable: {
				status: false,
			},
		},
	},
	selectors: {
		'blockera/elements/icon': {
			root: '&.wp-block-icon svg',
		},
	},
	supportsExtensions: (
		blockName: string,
		current: Object,
		variationSurface: 'size' | 'style'
	): Object => {
		if (variationSurface === 'style') {
			return current;
		}

		return mergeObjects(current, {
			advancedSettingsConfig: {
				status: false,
			},
			backgroundConfig: {
				status: false,
			},
			borderAndShadowConfig: {
				blockeraBoxShadow: {
					status: false,
				},
				blockeraOutline: {
					status: false,
				},
				blockeraBorder: {
					status: false,
				},
			},
			clickAnimationConfig: {
				status: false,
			},
			conditionsConfig: {
				status: false,
			},
			customStyleConfig: {
				status: true,
			},
			effectsConfig: {
				status: false,
			},
			entranceAnimationConfig: {
				status: false,
			},
			flexChildConfig: {
				status: false,
			},
			gridChildConfig: {
				status: false,
			},
			layoutConfig: {
				blockeraDisplay: {
					status: false,
				},
				blockeraFlexLayout: {
					status: false,
				},
				blockeraGap: {
					status: false,
				},
				blockeraFlexWrap: {
					status: false,
				},
			},
			typographyConfig: {
				blockeraFontFamily: {
					status: false,
				},
				blockeraFontColor: {
					status: false,
				},
				blockeraTextShadow: {
					status: false,
				},
				blockeraTextAlign: {
					status: false,
				},
				blockeraTextTransform: {
					status: false,
				},
				blockeraTextDecoration: {
					status: false,
				},
				blockeraDirection: {
					status: false,
				},
				blockeraTextIndent: {
					status: false,
				},
				blockeraTextOrientation: {
					status: false,
				},
				blockeraTextColumns: {
					status: false,
				},
				blockeraTextStroke: {
					status: false,
				},
				blockeraWordBreak: {
					status: false,
				},
				blockeraTextWrap: {
					status: false,
				},
			},
			sizeConfig: {
				blockeraOverflow: {
					status: false,
				},
			},
			mouseConfig: {
				status: false,
			},
			positionConfig: {
				status: false,
			},
			scrollAnimationConfig: {
				status: false,
			},
		});
	},
};
