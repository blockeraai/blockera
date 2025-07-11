// @flow

/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Blockera dependencies
 */
import { Icon } from '@blockera/icons';

export const iconsOptions = [
	{
		value: '',
		label: __('Choose Icon', 'blockera'),
		icon: '',
	},
	{
		value: `device-2xl-desktop`,
		label: __('2XL Desktop', 'blockera'),
		icon: <Icon icon="device-2xl-desktop" iconSize={24} />,
	},
	{
		value: `device-xl-desktop`,
		label: __('XL Desktop', 'blockera'),
		icon: <Icon icon="device-xl-desktop" iconSize={24} />,
	},
	{
		value: `device-l-desktop`,
		label: __('Large Desktop', 'blockera'),
		icon: <Icon icon="device-l-desktop" iconSize={24} />,
	},
	{
		value: `device-desktop`,
		label: __('Desktop', 'blockera'),
		icon: <Icon icon="device-desktop" iconSize={24} />,
	},
	{
		value: `device-tablet`,
		label: __('Tablet', 'blockera'),
		icon: <Icon icon="device-tablet" iconSize={24} />,
	},
	{
		value: `device-mobile`,
		label: __('Mobile Portrait', 'blockera'),
		icon: <Icon icon="device-mobile" iconSize={24} />,
	},
	{
		value: `device-mobile-landscape`,
		label: __('Mobile Landscape', 'blockera'),
		icon: <Icon icon="device-mobile-landscape" iconSize={24} />,
	},
	{
		value: 'custom',
		label: __('Custom', 'blockera'),
		icon: <Icon icon="custom" iconSize={24} />,
	},
];
