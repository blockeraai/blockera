// @flow

/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Blockera dependencies
 */
import {
	SharedBlockExtension,
	generalInnerBlockStates,
	sharedBlockStates,
} from '@blockera/editor';
import { Icon } from '@blockera/icons';
import { mergeObjects } from '@blockera/utils';

/**
 * Internal dependencies
 */
import type { BlockType } from '../../../type';

export const Search: BlockType = {
	name: 'blockeraSearch',
	targetBlock: 'core/search',
	hasSizeVariations: true,
	blockeraInnerBlocks: {
		'elements/label': {
			name: 'elements/label',
			type: 'title',
			label: __('Label', 'blockera'),
			description: __('The search form label element.', 'blockera'),
			icon: <Icon icon="block-search-label" iconSize="20" />,
			settings: {
				force: true,
			},
		},
		'elements/input': {
			name: 'elements/input',
			label: __('Input', 'blockera'),
			description: __('The search form text input element.', 'blockera'),
			icon: <Icon icon="block-search-input" iconSize="20" />,
			settings: {
				force: true,
			},
			availableBlockStates: {
				...generalInnerBlockStates,
				focus: {
					...generalInnerBlockStates.focus,
					force: true,
				},
				placeholder: {
					...sharedBlockStates.placeholder,
					force: true,
				},
			},
		},
		'elements/button': {
			name: 'elements/button',
			label: __('Button', 'blockera'),
			description: __('The search form button element.', 'blockera'),
			icon: <Icon icon="block-search-button" iconSize="20" />,
			settings: {
				force: true,
				dataCompatibilityElement: 'button',
				dataCompatibility: [
					'font-color',
					'background-color',
					'background-image',
					'font-size',
					'border',
					'border-radius',
					'spacing',
				],
			},
			availableBlockStates: {
				...generalInnerBlockStates,
				focus: {
					...generalInnerBlockStates.focus,
					force: true,
				},
				active: {
					...sharedBlockStates.active,
					force: true,
				},
				visited: sharedBlockStates.visited,
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
