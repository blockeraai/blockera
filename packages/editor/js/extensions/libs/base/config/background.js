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
};

const blockeraBackgroundColor: FeatureConfig = {
	show: true,
	force: true,
	status: true,
	isActiveOnInnerBlocksOnFree: true,
	label: __('Background Color', 'blockera'),
};

const blockeraBackgroundClip: FeatureConfig = {
	show: true,
	force: false,
	status: true,
	label: __('Background Clipping', 'blockera'),
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

export const backgroundConfig = {
	blockeraBackground,
	blockeraBackgroundColor,
	blockeraBackgroundClip,
};
