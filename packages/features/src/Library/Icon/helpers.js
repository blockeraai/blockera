// @flow

/**
 * Blockera dependencies
 */
import { classNames } from '@blockera/classnames';

export const getIconAttributes = (): string[] => [
	'blockeraIcon',
	'blockeraIconGap',
	'blockeraIconSize',
	'blockeraIconLink',
	'blockeraIconColor',
	'blockeraIconPosition',
];

export const addIconClassName = (attributes: {
	className?: string,
}): { className?: string } => {
	const existingClassName = attributes?.className || '';
	const hasIconClass = existingClassName.includes('blockera-has-icon-style');

	if (hasIconClass) {
		return attributes;
	}

	return {
		...attributes,
		className: classNames(
			existingClassName,
			!hasIconClass && 'blockera-has-icon-style'
		),
	};
};
