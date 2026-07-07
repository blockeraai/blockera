// @flow

/**
 * Blockera dependencies
 */
import { applyCoreIconBlockCompatibility } from '@blockera/blocks-core/js/libs/wordpress/icon/compatibility/core-icon-block-sync';

/**
 * Internal dependencies
 */
import { syncIconBlockClassName } from './helpers';
import { encodeCustomSvgIcon } from './icon-attribute-utils';
import {
	CORE_ICON_EMPTY_RENDERED_ICON,
	getCoreIconColorFromAttributes,
	getCoreIconSizeFromAttributes,
	renderLibraryIconMarkup,
} from './icon-render-utils';

const CORE_ICON_BLOCK_NAME = 'core/icon';

/**
 * Build blockeraIcon value object from icon picker reducer output.
 *
 * @param {Object} pickerValue Icon value after iconReducer action.
 * @param {Object} attributes  Current block attributes (for color/size context).
 * @return {Promise<Object>} blockeraIcon inner value (without { value } wrapper).
 */
export async function buildBlockeraIconValueFromPicker(
	pickerValue: Object,
	attributes: Object
): Promise<Object> {
	if (pickerValue?.icon && pickerValue?.library) {
		const renderedIcon = await renderLibraryIconMarkup(pickerValue, {
			iconColor: getCoreIconColorFromAttributes(attributes),
			iconSize: getCoreIconSizeFromAttributes(attributes),
		});

		return {
			...pickerValue,
			svgString: '',
			uploadSVG: '',
			renderedIcon: renderedIcon.encodedIcon,
		};
	}

	if (pickerValue?.svgString) {
		const renderedIcon = encodeCustomSvgIcon(pickerValue.svgString);

		return {
			...pickerValue,
			icon: null,
			library: null,
			renderedIcon: renderedIcon.encodedIcon,
		};
	}

	if (
		!pickerValue?.icon &&
		!pickerValue?.library &&
		!pickerValue?.svgString &&
		!pickerValue?.uploadSVG
	) {
		return {
			icon: '',
			library: '',
			svgString: '',
			uploadSVG: '',
			renderedIcon: CORE_ICON_EMPTY_RENDERED_ICON,
		};
	}

	return pickerValue;
}

/**
 * Commit icon picker selection to core/icon canvas attributes via WP setAttributes.
 *
 * @param {Object}   attributes    Current block attributes.
 * @param {Object}   pickerValue   Icon value after iconReducer action.
 * @param {Function} setAttributes WordPress block setAttributes.
 * @return {Promise<void>}
 */
export async function commitCoreIconPickerSelection(
	attributes: Object,
	pickerValue: Object,
	setAttributes: (Object) => void
): Promise<void> {
	const blockeraIconValue = await buildBlockeraIconValueFromPicker(
		pickerValue,
		attributes
	);

	let nextAttributes = {
		...attributes,
		blockeraIcon: {
			value: blockeraIconValue,
		},
	};

	nextAttributes = applyCoreIconBlockCompatibility(
		nextAttributes,
		'blockeraIcon',
		blockeraIconValue
	);

	nextAttributes = syncIconBlockClassName(
		nextAttributes,
		CORE_ICON_BLOCK_NAME
	);

	const patch: Object = {
		blockeraIcon: nextAttributes.blockeraIcon,
		className: nextAttributes.className,
	};

	if (nextAttributes.icon) {
		patch.icon = nextAttributes.icon;
	} else if (attributes.icon) {
		patch.icon = undefined;
	}

	setAttributes(patch);
}
