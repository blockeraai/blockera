// @flow

/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Blockera dependencies
 */
import { Icon } from '@blockera/icons';

export const icon = {
	originBlockType: 'core/image',
	variationConfig: {
		name: 'blockera/icon',
		label: 'Icon',
		description: __(
			'Insert an icon to make a design more engaging and attractive.',
			'blockera'
		),
		title: __('Icon', 'blockera'),
		icon: <Icon icon="star-filled" library="wp" iconSize="24px" />,
		attributes: {
			className: 'blockera-has-icon-style',
			blockeraIcon: {
				value: {
					icon: 'star-filled',
					library: 'wp',
					uploadSVG: '',
					renderedIcon: '',
				},
			},
			blockeraIconPosition: {
				value: 'left',
			},
			blockeraIconGap: {
				value: '5px',
			},
			blockeraIconSize: {
				value: '16px',
			},
			blockeraIconColor: {
				value: '#222',
			},
			blockeraIconLink: {
				value: [],
			},
		},
		category: 'media',
		scope: ['inserter'],
		isActive: (blockAttributes: Object) => {
			return (
				blockAttributes &&
				blockAttributes?.className?.includes('blockera-has-icon-style')
			);
		},
	},
};
