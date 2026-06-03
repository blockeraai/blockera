// @flow

/**
 * Blockera dependencies
 */
import {
	extensionConfig,
	SharedBlockExtension,
	registerBlockExtensionsSupports,
} from '@blockera/editor';
import { mergeObjects } from '@blockera/utils';

/**
 * Internal dependencies
 */
import type { BlockType } from '../../../type';

export const Spacer: BlockType = {
	name: 'blockeraSpacer',
	targetBlock: 'core/spacer',
	edit: (props) => {
		return <SharedBlockExtension {...props} />;
	},
	registerExtensions: (blockName: string): void => {
		const config = mergeObjects(extensionConfig, {
			advancedSettingsConfig: {
				status: false,
			},
			spacingConfig: {
				status: false,
			},
			typographyConfig: {
				status: false,
			},
			layoutConfig: {
				status: false,
			},
			positionConfig: {
				status: false,
			},
			mouseConfig: {
				status: false,
			},
			flexChildConfig: {
				status: false,
			},
			backgroundConfig: {
				status: false,
			},
			borderAndShadowConfig: {
				status: false,
			},
			effectsConfig: {
				status: false,
			},
			sizeConfig: {
				blockeraWidth: {
					onBreakpoints: ['base'],
				},
				blockeraMinWidth: {
					onBreakpoints: ['base'],
				},
				blockeraMaxWidth: {
					onBreakpoints: ['base'],
				},
				blockeraHeight: {
					onBreakpoints: ['base'],
				},
				blockeraMinHeight: {
					onBreakpoints: ['base'],
				},
				blockeraMaxHeight: {
					onBreakpoints: ['base'],
				},
				blockeraOverflow: {
					status: false,
				},
				blockeraRatio: {
					status: false,
				},
				blockeraFit: {
					status: false,
				},
				blockeraBoxSizing: {
					status: false,
				},
			},
			clickAnimationConfig: {
				status: false,
			},
		});

		registerBlockExtensionsSupports(blockName, config);
	},
};
