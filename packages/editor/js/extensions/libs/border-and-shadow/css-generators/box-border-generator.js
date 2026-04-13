/**
 * Blockera dependencies
 */
import { getValueAddonRealValue } from '@blockera/controls';

/**
 * Internal dependencies
 */
import { createCssDeclarations } from '../../../../style-engine';
import { parseBorderVariablePayloadFromSettings } from '../../value-addon-variable-payload';

function borderSideShorthand(side, varName) {
	const width = side?.width;
	if (!width) {
		return '';
	}
	const shorthand = `${width} ${side.style || 'solid'} ${getValueAddonRealValue(
		side.color
	)}`;
	if (varName) {
		return `var(${varName}, ${shorthand})`;
	}
	return shorthand;
}

/**
 * Border variable payload: flat `{ width, style, color }` (global-styles presets) or legacy `{ type, all }`.
 */
function sideFromBorderVariablePayload(payload) {
	if (!payload || typeof payload !== 'object') {
		return null;
	}
	if (payload.type === 'all' || payload.type === 'custom') {
		if (
			payload.type === 'all' &&
			payload.all &&
			typeof payload.all === 'object'
		) {
			return payload.all;
		}
		return null;
	}
	if (
		typeof payload.width === 'string' &&
		typeof payload.style === 'string'
	) {
		return payload;
	}
	if (payload.all && typeof payload.all === 'object') {
		return payload.all;
	}
	return null;
}

export function BoxBorderGenerator(id, props, options) {
	const { attributes } = props;

	if (!attributes?.blockeraBorder) {
		return '';
	}

	const properties = {};
	const borderValue =
		attributes.blockeraBorder?.value ?? attributes.blockeraBorder;

	if (
		!borderValue?.type &&
		typeof borderValue?.width === 'string' &&
		typeof borderValue?.style === 'string'
	) {
		const shorthand = borderSideShorthand(borderValue, null);
		if (shorthand) {
			properties.border = shorthand;
		}
	} else if (borderValue?.type === 'all') {
		let borderSides = borderValue?.all;
		let sideVar = null;
		if ('variable' === borderSides?.valueType) {
			sideVar = borderSides?.settings?.var;
			const payload = parseBorderVariablePayloadFromSettings(
				borderSides?.settings
			);
			borderSides = sideFromBorderVariablePayload(payload);
		}

		const borderAllWidth = borderSides?.width;
		if (borderAllWidth) {
			properties.border = borderSideShorthand(borderSides, sideVar);
		}
	} else {
		let borderTSide = borderValue?.top;
		let topVar = null;
		if ('variable' === borderTSide?.valueType) {
			topVar = borderTSide?.settings?.var;
			borderTSide = sideFromBorderVariablePayload(
				parseBorderVariablePayloadFromSettings(borderTSide?.settings)
			);
		}
		const borderTopCss = borderSideShorthand(borderTSide, topVar);
		if (borderTopCss) {
			properties['border-top'] = borderTopCss;
		}

		let borderRSide = borderValue?.right;
		let rightVar = null;
		if ('variable' === borderRSide?.valueType) {
			rightVar = borderRSide?.settings?.var;
			borderRSide = sideFromBorderVariablePayload(
				parseBorderVariablePayloadFromSettings(borderRSide?.settings)
			);
		}
		const borderRightCss = borderSideShorthand(borderRSide, rightVar);
		if (borderRightCss) {
			properties['border-right'] = borderRightCss;
		}

		let borderBSide = borderValue?.bottom;
		let bottomVar = null;
		if ('variable' === borderBSide?.valueType) {
			bottomVar = borderBSide?.settings?.var;
			borderBSide = sideFromBorderVariablePayload(
				parseBorderVariablePayloadFromSettings(borderBSide?.settings)
			);
		}
		const borderBottomCss = borderSideShorthand(borderBSide, bottomVar);
		if (borderBottomCss) {
			properties['border-bottom'] = borderBottomCss;
		}

		let borderLSide = borderValue?.left;
		let leftVar = null;
		if ('variable' === borderLSide?.valueType) {
			leftVar = borderLSide?.settings?.var;
			borderLSide = sideFromBorderVariablePayload(
				parseBorderVariablePayloadFromSettings(borderLSide?.settings)
			);
		}
		const borderLeftCss = borderSideShorthand(borderLSide, leftVar);
		if (borderLeftCss) {
			properties['border-left'] = borderLeftCss;
		}
	}

	if (!Object.keys(properties).length) {
		return '';
	}

	return createCssDeclarations({
		options,
		properties,
	});
}
