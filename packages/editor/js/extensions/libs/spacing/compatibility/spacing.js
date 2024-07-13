// @flow

/**
 * Blockera dependencies
 */
import {
	getSpacingVAFromVarString,
	generateVariableStringFromVA,
} from '@blockera/data';
import { isEquals } from '@blockera/utils';
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
			paddingTop = getSpacingVAFromVarString(
				attributes?.style?.spacing?.padding?.top
			);
		}

		// padding right
		let paddingRight: ValueAddon | string = '';
		if (attributes?.style?.spacing?.padding?.right) {
			paddingRight = getSpacingVAFromVarString(
				attributes?.style?.spacing?.padding?.right
			);
		}

		// padding right
		let paddingBottom: ValueAddon | string = '';
		if (attributes?.style?.spacing?.padding?.bottom) {
			paddingBottom = getSpacingVAFromVarString(
				attributes?.style?.spacing?.padding?.bottom
			);
		}

		// padding right
		let paddingLeft: ValueAddon | string = '';
		if (attributes?.style?.spacing?.padding?.left) {
			paddingLeft = getSpacingVAFromVarString(
				attributes?.style?.spacing?.padding?.left
			);
		}

		// margin top
		let marginTop: ValueAddon | string = '';
		if (attributes?.style?.spacing?.margin?.top) {
			marginTop = getSpacingVAFromVarString(
				attributes?.style?.spacing?.margin?.top
			);
		}

		// margin right
		let marginRight: ValueAddon | string = '';
		if (attributes?.style?.spacing?.margin?.right) {
			marginRight = getSpacingVAFromVarString(
				attributes?.style?.spacing?.margin?.right
			);
		}

		// margin right
		let marginBottom: ValueAddon | string = '';
		if (attributes?.style?.spacing?.margin?.bottom) {
			marginBottom = getSpacingVAFromVarString(
				attributes?.style?.spacing?.margin?.bottom
			);
		}

		// padding right
		let marginLeft: ValueAddon | string = '';
		if (attributes?.style?.spacing?.margin?.left) {
			marginLeft = getSpacingVAFromVarString(
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
		top: newValue?.margin?.top
			? generateVariableStringFromVA(newValue?.margin?.top)
			: '',
		right: newValue?.margin?.right
			? generateVariableStringFromVA(newValue?.margin?.right)
			: '',
		bottom: newValue?.margin?.bottom
			? generateVariableStringFromVA(newValue?.margin?.bottom)
			: '',
		left: newValue?.margin?.left
			? generateVariableStringFromVA(newValue?.margin?.left)
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
			? generateVariableStringFromVA(newValue?.padding?.top)
			: '',
		right: newValue?.padding?.right
			? generateVariableStringFromVA(newValue?.padding?.right)
			: '',
		bottom: newValue?.padding?.bottom
			? generateVariableStringFromVA(newValue?.padding?.bottom)
			: '',
		left: newValue?.padding?.left
			? generateVariableStringFromVA(newValue?.padding?.left)
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
