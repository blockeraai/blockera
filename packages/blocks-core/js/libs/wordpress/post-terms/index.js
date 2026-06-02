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
import sharedInnerBlocks from '../inners/shared';
import type { BlockType } from '../../../type';

export const PostTerms: BlockType = {
	name: 'blockeraPostTerms',
	targetBlock: 'core/post-terms',
	hasSizeVariations: true,
	blockeraInnerBlocks: {
		'elements/link': {
			...sharedInnerBlocks['elements/link'],
			label: __('Terms', 'blockera'),
			description: __('All term elements.', 'blockera'),
			settings: {
				...sharedInnerBlocks['elements/link'].settings,
				force: true,
			},
		},
		'elements/separator': {
			name: 'elements/separator',
			label: __('Separators', 'blockera'),
			description: __('The terms separator elements.', 'blockera'),
			icon: <Icon icon="block-post-terms-separator" iconSize="20" />,
			settings: {
				force: true,
			},
		},
		'elements/prefix': {
			name: 'elements/prefix',
			label: __('Prefix Text', 'blockera'),
			description: __('The terms prefix text element.', 'blockera'),
			icon: <Icon icon="block-post-terms-prefix" iconSize="20" />,
			settings: {
				force: true,
			},
		},
		'elements/suffix': {
			name: 'elements/suffix',
			label: __('Suffix Text', 'blockera'),
			description: __('The terms suffix text element.', 'blockera'),
			icon: <Icon icon="block-post-terms-suffix" iconSize="20" />,
			settings: {
				force: true,
			},
		},
	},
	edit: (props) => {
		return <SharedBlockExtension {...props} />;
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
