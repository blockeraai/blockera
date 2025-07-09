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
		value: {
			icon: `device-2xl-desktop`,
			library: 'ui',
			uploadSVG: '',
		},
		label: __('2XL Desktop', 'blockera'),
		icon: <Icon icon="device-2xl-desktop" iconSize={24} />,
	},
	{
		value: {
			icon: `device-xl-desktop`,
			library: 'ui',
			uploadSVG: '',
		},
		label: __('XL Desktop', 'blockera'),
		icon: <Icon icon="device-xl-desktop" iconSize={24} />,
	},
	{
		value: {
			icon: `device-l-desktop`,
			library: 'ui',
			uploadSVG: '',
		},
		label: __('Large Desktop', 'blockera'),
		icon: <Icon icon="device-l-desktop" iconSize={24} />,
	},
	{
		value: {
			icon: `device-desktop`,
			library: 'ui',
			uploadSVG: '',
		},
		label: __('Desktop', 'blockera'),
		icon: <Icon icon="device-desktop" iconSize={24} />,
	},
	{
		value: {
			icon: `device-tablet`,
			library: 'ui',
			uploadSVG: '',
		},
		label: __('Tablet', 'blockera'),
		icon: <Icon icon="device-tablet" iconSize={24} />,
	},
	{
		value: {
			icon: `device-mobile`,
			library: 'ui',
			uploadSVG: '',
		},
		label: __('Mobile Portrait', 'blockera'),
		icon: <Icon icon="device-mobile" iconSize={24} />,
	},
	{
		value: {
			icon: `device-mobile-landscape`,
			library: 'ui',
			uploadSVG: '',
		},
		label: __('Mobile Landscape', 'blockera'),
		icon: <Icon icon="device-mobile-landscape" iconSize={24} />,
	},
	{
		value: 'custom',
		label: __('Custom', 'blockera'),
		icon: <Icon icon="custom" iconSize={24} />,
	},
];
