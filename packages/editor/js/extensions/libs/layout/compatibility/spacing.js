// @flow

/**
 * Blockera dependencies
 */
import {
	getSpacingVAFromVarString,
	generateAttributeVarStringFromVA,
} from '@blockera/data';
import { isEquals, isNumber } from '@blockera/utils';
import { boxSpacingControlDefaultValue } from '@blockera/controls/js/libs/box-spacing-control/utils';
import type { ValueAddon } from '@blockera/controls/js/value-addons/types';
import { isSpecialUnit } from '@blockera/controls';

/**
 * Internal dependencies
 */
import { runInsideBlockInspector } from '../../utils';

export function spacingFromWPCompatibility({
	attributes,
	editorSelectedBlockEvent,
	insideBlockInspector = true,
}: {
	attributes: Object,
	editorSelectedBlockEvent?: 'save-customizations' | 'detach-style',
	insideBlockInspector?: boolean,
}): Object {
	// Check block-level style (insideBlockInspector) or global style context
	// Block inspector: attributes.style.spacing.*
	// Global styles: attributes.spacing.*
	const spacing = runInsideBlockInspector(
		insideBlockInspector,
		editorSelectedBlockEvent
	)
		? attributes?.style?.spacing
		: attributes?.spacing;

	if (
		// WP have spacing value
		(spacing?.padding !== undefined || spacing?.margin !== undefined) &&
		// Blockera have not custom spacing
		isEquals(
			attributes?.blockeraSpacing?.value,
			boxSpacingControlDefaultValue
		)
	) {
		// padding top
		let paddingTop: ValueAddon | string = '';
		if (spacing?.padding?.top) {
			paddingTop = convertFromValue(spacing?.padding?.top);
		}

		// padding right
		let paddingRight: ValueAddon | string = '';
		if (spacing?.padding?.right) {
			paddingRight = convertFromValue(spacing?.padding?.right);
		}

		// padding bottom
		let paddingBottom: ValueAddon | string = '';
		if (spacing?.padding?.bottom) {
			paddingBottom = convertFromValue(spacing?.padding?.bottom);
		}

		// padding left
		let paddingLeft: ValueAddon | string = '';
		if (spacing?.padding?.left) {
			paddingLeft = convertFromValue(spacing?.padding?.left);
		}

		// margin top
		let marginTop: ValueAddon | string = '';
		if (spacing?.margin?.top) {
			marginTop = convertFromValue(spacing?.margin?.top);
		}

		// margin right
		let marginRight: ValueAddon | string = '';
		if (spacing?.margin?.right) {
			marginRight = convertFromValue(spacing?.margin?.right);
		}

		// margin bottom
		let marginBottom: ValueAddon | string = '';
		if (spacing?.margin?.bottom) {
			marginBottom = convertFromValue(spacing?.margin?.bottom);
		}

		// margin left
		let marginLeft: ValueAddon | string = '';
		if (spacing?.margin?.left) {
			marginLeft = convertFromValue(spacing?.margin?.left);
		}

		attributes.blockeraSpacing = {
			value: {
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
	editorSelectedBlockEvent,
	insideBlockInspector = true,
}: {
	newValue: Object,
	ref?: Object,
	editorSelectedBlockEvent?: 'save-customizations' | 'detach-style',
	insideBlockInspector?: boolean,
}): Object {
	if (
		'reset' === ref?.current?.action ||
		isEquals(newValue, boxSpacingControlDefaultValue)
	) {
		const spacingData = {
			spacing: {
				padding: undefined,
				margin: undefined,
			},
		};

		return runInsideBlockInspector(
			insideBlockInspector,
			editorSelectedBlockEvent
		)
			? {
					style: spacingData,
				}
			: spacingData;
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
		newSpacing.margin = undefined;
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
		newSpacing.padding = undefined;
	}

	if (
		runInsideBlockInspector(insideBlockInspector, editorSelectedBlockEvent)
	) {
		return {
			style: {
				spacing: newSpacing,
			},
		};
	}

	return {
		spacing: newSpacing,
	};
}

export function convertToValue(spacing: string | Object): string {
	spacing = generateAttributeVarStringFromVA(spacing);

	// Advanced css functions not supported by core.
	if (isSpecialUnit(spacing)) {
		spacing = '';
	}

	return spacing;
}
