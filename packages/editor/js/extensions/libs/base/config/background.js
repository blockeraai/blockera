// @flow

/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { Icon } from '@blockera/icons';

/**
 * Internal dependencies
 */
import type { FeatureConfig } from '../types';

const blockeraBackground: FeatureConfig = {
	show: true,
	force: true,
	status: true,
	label: __('Image & Gradient', 'blockera'),
	keywords: ['background', 'image', 'gradient', 'picture', 'photo', 'mesh'],
};

const blockeraBackgroundColor: FeatureConfig = {
	show: true,
	force: true,
	status: true,
	onNativeOnInnerBlocks: false,
	label: __('Background Color', 'blockera'),
	keywords: ['background', 'color', 'colour', 'bg', 'fill'],
};

const blockeraBackgroundClip: FeatureConfig = {
	show: true,
	force: false,
	status: true,
	label: __('Background Clipping', 'blockera'),
	keywords: ['background', 'clip', 'clipping', 'mask'],
	config: {
		options: [
			{
				label: __('None', 'blockera'),
				value: 'none',
				icon: (
					<Icon
						icon="none-square"
						iconSize={18}
						className="icon-soft-color"
					/>
				),
			},
			{
				label: __('Clip to Padding', 'blockera'),
				value: 'padding-box',
				icon: <Icon icon="clip-padding" iconSize={18} />,
			},
			{
				label: __('Clip to Content', 'blockera'),
				value: 'content-box',
				icon: <Icon icon="clip-content" iconSize={18} />,
			},
			{
				label:
					__('Clip to Text', 'blockera') +
					' (' +
					__('Pro', 'blockera') +
					')',
				value: 'text',
				icon: <Icon icon="clip-text" iconSize={18} />,
				disabled: true,
			},
			{
				label: __('Inherit', 'blockera'),
				value: 'inherit',
				icon: <Icon icon="inherit-square" iconSize={18} />,
			},
		],
	},
};

const blockeraBlendMode: FeatureConfig = {
	show: false,
	force: false,
	status: true,
	label: __('Blending Mode', 'blockera'),
	keywords: ['blend', 'blending', 'mode', 'mix', 'overlay'],
};

export const backgroundConfig = {
	status: true,
	initialOpen: true,
	blockeraBackground,
	blockeraBackgroundColor,
	blockeraBackgroundClip,
	blockeraBlendMode,
};
