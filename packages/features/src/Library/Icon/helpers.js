// @flow

/**
 * Blockera dependencies
 */
import { classNames } from '@blockera/classnames';

export const getIconAttributes = (): string[] => [
	'blockeraIcon',
	// 'blockeraIconGap',
	// 'blockeraIconSize',
	// 'blockeraIconLink',
	// 'blockeraIconColor',
	'blockeraIconPosition',
];

export const addIconClassName = (attributes, iconSettings): Object => {
	attributes = removeIconClassName(attributes);

	const existingClassName = attributes?.className || '';
	const iconClassName = 'blockera-has-icon-';

	return {
		...attributes,
		className: classNames(
			existingClassName,
			iconClassName + (iconSettings.blockeraIconPosition || 'start')
		),
	};
};

export const removeIconClassName = (attributes: {
	className?: string,
}): { className?: string } => {
	if (!attributes?.className) {
		return attributes;
	}

	const existingClassName = attributes?.className || '';
	const cleanedClassName = existingClassName
		.replace(/\s*blockera-has-icon-(start|end)\s*/g, ' ')
		.trim();

	return {
		...attributes,
		className: cleanedClassName,
	};
};
