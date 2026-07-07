// @flow

/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Blockera dependencies
 */
import { SharedBlockExtension } from '@blockera/editor';
import { Icon } from '@blockera/icons';
import { mergeObjects } from '@blockera/utils';

/**
 * Internal dependencies
 */
import type { BlockType } from '../../../type';

export const SocialLinks: BlockType = {
	name: 'blockeraSocialLinks',
	targetBlock: 'core/social-links',
	hasSizeVariations: true,
	blockeraInnerBlocks: {
		'elements/item-containers': {
			name: 'elements/item-containers',
			label: __('Items', 'blockera'),
			description: __('The social link items.', 'blockera'),
			icon: <Icon icon="block-social-link-container" iconSize="20" />,
			settings: {
				force: true,
			},
		},
		'elements/item-icons': {
			name: 'elements/item-icons',
			label: __('Icons', 'blockera'),
			description: __('The social link icon elements.', 'blockera'),
			icon: <Icon icon="block-social-link-icon" iconSize="20" />,
			settings: {
				force: true,
			},
		},
		'elements/item-names': {
			name: 'elements/item-names',
			label: __('Names', 'blockera'),
			description: __('The social link name elements.', 'blockera'),
			icon: <Icon icon="block-social-link-name" iconSize="20" />,
			settings: {
				force: true,
			},
		},
	},
	edit: (props) => {
		return <SharedBlockExtension {...props} />;
	},
	selectors: {
		'blockera/elements/item-icons': {
			root: '.block-editor-block-icon svg',
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
