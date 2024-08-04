// @flow

/**
 * Blockera dependencies
 */
import {
	getSpacingVAFromVarString,
	generateAttributeVarStringFromVA,
} from '@blockera/data';
import { isEquals, isNumber } from '@blockera/utils';
import { boxPositionControlDefaultValue } from '@blockera/controls/js/libs/box-spacing-control/utils';
import type { ValueAddon } from '@blockera/controls/js/value-addons/types';

export function spacingFromWPCompatibility({
	attributes,
}: {
	attributes: Object,
}): Object {
	if (
		// WP have spacing value
		(attributes?.style?.spacing?.padding !== undefined ||
			attributes?.style?.spacing?.margin !== undefined) &&
		// Blockera have not custom spacing
		isEquals(attributes?.blockeraSpacing, boxPositionControlDefaultValue)
	) {
		// padding top
		let paddingTop: ValueAddon | string = '';
		if (attributes?.style?.spacing?.padding?.top) {
			paddingTop = convertFromValue(
				attributes?.style?.spacing?.padding?.top
			);
		}

		// padding right
		let paddingRight: ValueAddon | string = '';
		if (attributes?.style?.spacing?.padding?.right) {
			paddingRight = convertFromValue(
				attributes?.style?.spacing?.padding?.right
			);
		}

		// padding right
		let paddingBottom: ValueAddon | string = '';
		if (attributes?.style?.spacing?.padding?.bottom) {
			paddingBottom = convertFromValue(
				attributes?.style?.spacing?.padding?.bottom
			);
		}

		// padding right
		let paddingLeft: ValueAddon | string = '';
		if (attributes?.style?.spacing?.padding?.left) {
			paddingLeft = convertFromValue(
				attributes?.style?.spacing?.padding?.left
			);
		}

		// margin top
		let marginTop: ValueAddon | string = '';
		if (attributes?.style?.spacing?.margin?.top) {
			marginTop = convertFromValue(
				attributes?.style?.spacing?.margin?.top
			);
		}

		// margin right
		let marginRight: ValueAddon | string = '';
		if (attributes?.style?.spacing?.margin?.right) {
			marginRight = convertFromValue(
				attributes?.style?.spacing?.margin?.right
			);
		}

		// margin right
		let marginBottom: ValueAddon | string = '';
		if (attributes?.style?.spacing?.margin?.bottom) {
			marginBottom = convertFromValue(
				attributes?.style?.spacing?.margin?.bottom
			);
		}

		// padding right
		let marginLeft: ValueAddon | string = '';
		if (attributes?.style?.spacing?.margin?.left) {
			marginLeft = convertFromValue(
				attributes?.style?.spacing?.margin?.left
			);
		}

		attributes.blockeraSpacing = {
			padding: {
				top: paddingTop,
				right: paddingRight,
				bottom: paddingBottom,
				left: paddingLeft,
			},
			margin: {
				top: marginTop,
				right: marginRight,
				bottom: marginBottom,
				left: marginLeft,
			},
		};
	}

	return attributes;
}

export function convertFromValue(spacing: string | Object): string {
	spacing = getSpacingVAFromVarString(spacing);

	if (isNumber(spacing)) {
		//$FlowFixMe
		spacing = spacing + 'px';
	}

	//$FlowFixMe
	return spacing;
}

export function spacingToWPCompatibility({
	newValue,
	ref,
}: {
	newValue: Object,
	ref?: Object,
}): Object {
	if (
		'reset' === ref?.current?.action ||
		isEquals(newValue, boxPositionControlDefaultValue)
	) {
		return {
			style: {
				spacing: {
					padding: undefined,
					margin: undefined,
				},
			},
		};
	}

	const newSpacing: {
		margin?: {
			top?: string | void,
			right?: string | void,
			bottom?: string | void,
			left?: string | void,
		},
		padding?: {
			top?: string | void,
			right?: string | void,
			bottom?: string | void,
			left?: string | void,
		},
	} = {
		margin: {},
		padding: {},
	};

	//
	// margin
	//
	newSpacing.margin = {
		top: newValue?.margin?.top ? convertToValue(newValue?.margin?.top) : '',
		right: newValue?.margin?.right
			? convertToValue(newValue?.margin?.right)
			: '',
		bottom: newValue?.margin?.bottom
			? convertToValue(newValue?.margin?.bottom)
			: '',
		left: newValue?.margin?.left
			? convertToValue(newValue?.margin?.left)
			: '',
	};

	if (
		isEquals(newSpacing.margin, {
			top: '',
			right: '',
			bottom: '',
			left: '',
		})
	) {
		delete newSpacing.margin;
	}

	//
	// padding
	//
	newSpacing.padding = {
		top: newValue?.padding?.top
			? convertToValue(newValue?.padding?.top)
			: '',
		right: newValue?.padding?.right
			? convertToValue(newValue?.padding?.right)
			: '',
		bottom: newValue?.padding?.bottom
			? convertToValue(newValue?.padding?.bottom)
			: '',
		left: newValue?.padding?.left
			? convertToValue(newValue?.padding?.left)
			: '',
	};

	if (
		isEquals(newSpacing.padding, {
			top: '',
			right: '',
			bottom: '',
			left: '',
		})
	) {
		delete newSpacing.padding;
	}

	return {
		style: {
			spacing: newSpacing,
		},
	};
}

export function convertToValue(spacing: string | Object): string {
	spacing = generateAttributeVarStringFromVA(spacing);

	// css func not supported
	if (spacing.endsWith('css')) {
		spacing = '';
	}

	return spacing;
}
