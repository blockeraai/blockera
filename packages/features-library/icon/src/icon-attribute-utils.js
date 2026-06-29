// @flow

/**
 * Blockera dependencies
 */
import { getValueAddonRealValue } from '@blockera/controls';
import { isStrokeIconLibrary, NativeIconLibrariesList } from '@blockera/icons';
import { addAngle } from '@blockera/utils';

/**
 * Shared attribute readers for icon feature (editor + canvas).
 * Keep icon value / presentation logic here so JS mirrors PHP helpers in functions.php.
 */

/**
 * Resolve className from Blockera state or WordPress-compatible attributes.
 *
 * @param {Object}   attributes     Attributes passed to setAttributes filters.
 * @param {Function} getAttributes  Getter for full compatible attributes.
 * @return {string} className string.
 */
export const getClassNameFromAttributes = (
	attributes?: Object,
	getAttributes?: () => Object
): string => {
	const className =
		attributes?.className ?? getAttributes?.()?.className ?? '';

	if (typeof className === 'string') {
		return className;
	}

	if (
		className &&
		typeof className === 'object' &&
		className.value !== undefined
	) {
		return String(className.value);
	}

	return '';
};

/**
 * Whether the current block uses Blockera standalone icon canvas (core/icon).
 *
 * @param {Object}   attributes     Attributes passed to setAttributes filters.
 * @param {Function} getAttributes  Getter for full compatible attributes.
 * @param {Object}   blockDetail    Block context from the attributes reducer.
 * @return {boolean} True for core/icon blocks.
 */
export const isStandaloneIconBlockContext = (
	attributes?: Object,
	getAttributes?: () => Object,
	blockDetail?: Object
): boolean => {
	const className = getClassNameFromAttributes(attributes, getAttributes);

	if (className.includes('wp-block-icon-blockera')) {
		return true;
	}

	return blockDetail?.blockId === 'core/icon';
};

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
 * Resolve a Blockera attribute (plain, wrapped, or value-addon) to CSS color.
 *
 * @param {Object | string | void} attr     Attribute value or `{ value }` wrapper.
 * @param {{ blockName?: string }} [options] Optional block scope for preset resolution.
 * @return {string} Resolved CSS color.
 */
export const getResolvedIconColorValue = (
	attr: Object | string | void,
	options?: {| blockName?: string |}
): string => {
	if (!attr) {
		return '';
	}

	let raw = attr;

	if (
		typeof attr === 'object' &&
		attr.value !== undefined &&
		!attr.isValueAddon
	) {
		raw = attr.value;
	}

	const resolved = getValueAddonRealValue(raw, options);

	if (resolved === undefined || resolved === null || resolved === '') {
		return '';
	}

	return String(resolved);
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

/**
 * Next rotate value when cycling the toolbar/extension rotate control (+90°).
 */
export const getNextIconRotateValue = (
	currentRotate: string | number
): string | number => {
	let newAngle =
		currentRotate !== ''
			? addAngle(currentRotate === '' ? 0 : currentRotate, 90)
			: 90;

	if (newAngle === 0 || newAngle === 360) {
		newAngle = '';
	}

	return newAngle;
};

/**
 * Toggle flip attribute between inactive ('') and active (true).
 */
export const getToggledIconFlipValue = (
	currentFlip: string | boolean
): string | boolean => (currentFlip ? '' : true);

export const getIconPresentationStyle = (attributes: Object): Object => {
	const iconColor =
		getResolvedIconColorValue(attributes?.blockeraFontColor) ||
		getResolvedIconColorValue(attributes?.blockeraIconColor);
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

/**
 * Decode blockeraIcon.renderedIcon (matches editor btoa(unescape(encodeURIComponent(svg)))).
 *
 * @param {string} encoded Base64-encoded SVG markup.
 * @return {string} Decoded SVG markup, or empty string on failure.
 */
export const decodeRenderedIcon = (encoded?: string): string => {
	if (!encoded || typeof encoded !== 'string') {
		return '';
	}

	if (encoded.startsWith('<')) {
		return encoded;
	}

	try {
		return decodeURIComponent(escape(atob(encoded)));
	} catch (error) {
		try {
			return atob(encoded);
		} catch (decodeError) {
			return '';
		}
	}
};

/**
 * Whether blockeraIcon is a custom uploaded/pasted SVG (no library slug).
 *
 * @param {Object} iconValue Normalized blockeraIcon value.
 * @return {boolean} True for custom SVG icons.
 */
export const isCustomUploadedIcon = (iconValue?: Object): boolean => {
	if (!iconValue || typeof iconValue !== 'object') {
		return false;
	}

	if (iconValue.icon || iconValue.library) {
		return false;
	}

	return !!(
		iconValue.renderedIcon ||
		iconValue.svgString ||
		iconValue.uploadSVG
	);
};

/**
 * Source SVG markup for a custom icon (prefer persisted svgString).
 *
 * @param {Object} iconValue Normalized blockeraIcon value.
 * @return {string} Raw SVG markup.
 */
export const getCustomIconSvgSource = (iconValue?: Object): string => {
	if (!iconValue || typeof iconValue !== 'object') {
		return '';
	}

	if (iconValue.svgString && typeof iconValue.svgString === 'string') {
		return iconValue.svgString;
	}

	return decodeRenderedIcon(iconValue.renderedIcon);
};

/** Pro-gated libraries (search-libraries-2.json) — same list as icon picker FeatureWrapper. */
const PRO_GATED_ICON_LIBRARIES: Set<string> = new Set(NativeIconLibrariesList);

/**
 * SVG from blockeraIcon.renderedIcon for pro-gated libraries in free Blockera.
 * Picker is locked, but content saved in Pro must still render in the canvas.
 *
 * @param {Object} iconValue Normalized blockeraIcon value.
 * @return {string} Decoded SVG markup or empty string.
 */
export const getProGatedLibraryIconSvgMarkup = (iconValue?: Object): string => {
	if (
		!iconValue?.renderedIcon ||
		!iconValue.library ||
		!PRO_GATED_ICON_LIBRARIES.has(iconValue.library)
	) {
		return '';
	}

	return decodeRenderedIcon(iconValue.renderedIcon);
};

/**
 * Encode custom SVG for storage without stroke/fill normalization.
 *
 * @param {string} svgMarkup Raw SVG markup.
 * @return {boolean} True when SVG has non-currentColor fill values.
 */
export const svgHasPreservedColors = (svgMarkup?: string): boolean => {
	if (!svgMarkup || typeof svgMarkup !== 'string') {
		return false;
	}

	const fills: Set<string> = new Set();

	const attrFills = svgMarkup.match(/\bfill=["']([^"']+)["']/gi) || [];

	for (const match of attrFills) {
		const value = match.replace(/^fill=["']/i, '').replace(/["']$/, '');

		if (
			value &&
			!['none', 'currentcolor', 'inherit', 'transparent'].includes(
				value.toLowerCase()
			)
		) {
			fills.add(value.toLowerCase());
		}
	}

	const styleFills = svgMarkup.match(/fill\s*:\s*([^;"'}]+)/gi) || [];

	for (const match of styleFills) {
		const value = match.replace(/fill\s*:\s*/i, '').trim();

		if (
			value &&
			!['none', 'currentcolor', 'inherit', 'transparent'].includes(
				value.toLowerCase()
			)
		) {
			fills.add(value.toLowerCase());
		}
	}

	return fills.size > 0;
};

export const encodeCustomSvgIcon = (
	svgString: string
): { encodedIcon: string, icon: string } => {
	const markup = svgString?.trim() || '';

	if (!markup) {
		return { encodedIcon: '', icon: '' };
	}

	return {
		encodedIcon: btoa(unescape(encodeURIComponent(markup))),
		icon: encodeURIComponent(markup),
	};
};
