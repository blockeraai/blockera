// @flow

/**
 * Blockera dependencies
 */
import { isStrokeIconLibrary } from '@blockera/icons';

/**
 * Shared attribute readers for icon feature (editor + canvas).
 * Keep icon value / presentation logic here so JS mirrors PHP helpers in functions.php.
 */

export const getBlockeraIconValue = (attributes: Object): Object => {
	const blockeraIcon = attributes?.blockeraIcon;

	if (blockeraIcon?.value && typeof blockeraIcon.value === 'object') {
		return blockeraIcon.value;
	}

	return blockeraIcon && typeof blockeraIcon === 'object' ? blockeraIcon : {};
};

export const getAttrValue = (attr: Object | string | void): string => {
	if (!attr) {
		return '';
	}

	if (typeof attr === 'object' && attr.value !== undefined) {
		return String(attr.value);
	}

	return String(attr);
};

/**
 * Whether a blockeraIcon value object is renderable (matches PHP blockera_core_icon_has_renderable_blockera_icon).
 *
 * @param {Object} iconValue Normalized blockeraIcon value.
 * @return {boolean} True when icon has rendered SVG, upload, or library slug.
 */
export const hasBlockeraIconValue = (iconValue?: Object): boolean => {
	if (!iconValue || typeof iconValue !== 'object') {
		return false;
	}

	if (iconValue.renderedIcon || iconValue.uploadSVG) {
		return true;
	}

	return !!(iconValue.icon && iconValue.library);
};

export const getResolvedIconSize = (
	attributes: Object,
	defaultSize: string = '24px'
): string => {
	const size =
		getAttrValue(attributes?.blockeraWidth) ||
		getAttrValue(attributes?.blockeraIconSize);

	return size || defaultSize;
};

/**
 * CSS transform for rotate + flip (shared by canvas edit and attribute sync paths).
 */
export const getIconTransform = (attributes: Object): string => {
	const iconRotate = getAttrValue(attributes?.blockeraIconRotate);
	const flipH = getAttrValue(attributes?.blockeraIconFlipHorizontal);
	const flipV = getAttrValue(attributes?.blockeraIconFlipVertical);

	let transform = '';

	if (iconRotate) {
		transform = `rotate(${iconRotate}deg)`;
	}

	if (flipH) {
		transform = `${transform} scaleX(-1)`.trim();
	}

	if (flipV) {
		transform = `${transform} scaleY(-1)`.trim();
	}

	return transform;
};

export const getIconPresentationStyle = (attributes: Object): Object => {
	const iconColor = getAttrValue(attributes?.blockeraIconColor);
	const transform = getIconTransform(attributes);
	const library = getBlockeraIconValue(attributes)?.library;
	const isStrokeLibrary = isStrokeIconLibrary(library);
	const resolvedColor = iconColor || 'currentColor';
	const style = {
		color: resolvedColor,
		...(isStrokeLibrary ? {} : { fill: resolvedColor }),
		...(transform ? { transform } : {}),
	};

	return style;
};

export const getCoreIconAriaLabel = (attributes: Object): string =>
	getAttrValue(attributes?.ariaLabel) || attributes?.ariaLabel || '';
