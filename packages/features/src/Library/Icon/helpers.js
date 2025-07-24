// @flow

/**
 * Blockera dependencies
 */
import { classNames } from '@blockera/classnames';

export const getIconAttributes = () => [
	'blockeraIcon',
	'blockeraIconGap',
	'blockeraIconSize',
	'blockeraIconLink',
	'blockeraIconColor',
	'blockeraIconPosition',
];

export const addIconClassName = (attributes) => {
	return {
		...attributes,
		className: classNames(attributes?.className || '', {
			'blockera-has-icon-style': true,
		}),
	};
};
