// @flow

/**
 * Blockera dependencies
 */
import { classNames } from '@blockera/classnames';

/**
 * Internal dependencies
 */
import {
	getBlockeraIconValue,
	hasBlockeraIconValue,
} from './icon-attribute-utils';

export {
	hasBlockeraIconValue,
	getBlockeraIconValue,
} from './icon-attribute-utils';

export const DEFAULT_ICON_SIZE_ATTRIBUTE = 'blockeraIconSize';
export const DEFAULT_ICON_COLOR_ATTRIBUTE = 'blockeraIconColor';

/** Class marker for Blockera-managed core/icon blocks (not inline icon layout). */
export const CORE_ICON_BLOCKERA_CLASS = 'wp-block-icon-blockera';

export const isCoreIconBlock = (blockName?: string): boolean =>
	blockName === 'core/icon';

/** Standalone icon blocks (not inline icon on text/button blocks). */
export const isStandaloneIconBlock = (blockName?: string): boolean =>
	isCoreIconBlock(blockName);

/**
 * Block attribute used by the icon Size control (defaults to blockeraIconSize).
 *
 * @param {Object} iconSizeConfig blockeraIconSize entry from iconConfig.
 * @return {string} Attribute name for the icon size control.
 */
export const getIconSizeAttributeId = (iconSizeConfig?: Object): string =>
	iconSizeConfig?.config?.attribute ?? DEFAULT_ICON_SIZE_ATTRIBUTE;

/**
 * Block attribute used by the icon Color control (defaults to blockeraIconColor).
 *
 * @param {Object} iconColorConfig blockeraIconColor entry from iconConfig.
 * @return {string} Attribute name for the icon color control.
 */
export const getIconColorAttributeId = (iconColorConfig?: Object): string =>
	iconColorConfig?.config?.attribute ?? DEFAULT_ICON_COLOR_ATTRIBUTE;

export const getIconAttributes = (): string[] => [
	'blockeraIcon',
	'blockeraIconPosition',
];

export const addIconClassName = (
	attributes: Object,
	iconSettings: Object,
	blockName?: string
): Object => {
	attributes = removeIconClassName(attributes);

	const existingClassName = attributes?.className || '';

	if (isCoreIconBlock(blockName)) {
		return {
			...attributes,
			className: classNames(existingClassName, CORE_ICON_BLOCKERA_CLASS),
		};
	}

	return {
		...attributes,
		className: classNames(
			existingClassName,
			'blockera-has-icon-' +
				(iconSettings.blockeraIconPosition || 'start')
		),
	};
};

export const removeIconClassName = (attributes: {
	className?: string,
}): { className?: string } => {
	if (!attributes?.className) {
		return attributes;
	}

	const cleanedClassName = attributes.className
		.replace(/\s*blockera-has-icon-(start|end)\s*/g, ' ')
		.replace(/\s*wp-block-icon-blockera\s*/g, ' ')
		.trim();

	return {
		...attributes,
		className: cleanedClassName,
	};
};

/**
 * Sync className for icon feature (inline blocks vs standalone core/icon).
 *
 * @param {Object} attributes Block attributes.
 * @param {string} blockName  Block type name.
 * @return {Object} Attributes with icon-related className applied or removed.
 */
export const syncIconBlockClassName = (
	attributes: Object,
	blockName?: string
): Object => {
	const iconValue = getBlockeraIconValue(attributes);

	if (!hasBlockeraIconValue(iconValue)) {
		return removeIconClassName(attributes);
	}

	return addIconClassName(
		attributes,
		{
			blockeraIconPosition: attributes?.blockeraIconPosition?.value,
		},
		blockName
	);
};
