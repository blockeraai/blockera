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

export function BoxBorderGenerator(id, props, options) {
	const { attributes } = props;

	if (!attributes?.blockeraBorder) {
		return '';
	}

	const properties = {};
	const borderValue = attributes.blockeraBorder;

	if (borderValue?.type === 'all') {
		let borderSides = borderValue?.all;
		let sideVar = null;
		if ('variable' === borderSides?.valueType) {
			sideVar = borderSides?.settings?.var;
			borderSides = parseBorderVariablePayloadFromSettings(
				borderSides?.settings
			);
			borderSides = borderSides?.all;
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
			borderTSide = parseBorderVariablePayloadFromSettings(
				borderTSide?.settings
			);
			borderTSide = borderTSide?.all;
		}
		const borderTopCss = borderSideShorthand(borderTSide, topVar);
		if (borderTopCss) {
			properties['border-top'] = borderTopCss;
		}

		let borderRSide = borderValue?.right;
		let rightVar = null;
		if ('variable' === borderRSide?.valueType) {
			rightVar = borderRSide?.settings?.var;
			borderRSide = parseBorderVariablePayloadFromSettings(
				borderRSide?.settings
			);
			borderRSide = borderRSide?.all;
		}
		const borderRightCss = borderSideShorthand(borderRSide, rightVar);
		if (borderRightCss) {
			properties['border-right'] = borderRightCss;
		}

		let borderBSide = borderValue?.bottom;
		let bottomVar = null;
		if ('variable' === borderBSide?.valueType) {
			bottomVar = borderBSide?.settings?.var;
			borderBSide = parseBorderVariablePayloadFromSettings(
				borderBSide?.settings
			);
			borderBSide = borderBSide?.all;
		}
		const borderBottomCss = borderSideShorthand(borderBSide, bottomVar);
		if (borderBottomCss) {
			properties['border-bottom'] = borderBottomCss;
		}

		let borderLSide = borderValue?.left;
		let leftVar = null;
		if ('variable' === borderLSide?.valueType) {
			leftVar = borderLSide?.settings?.var;
			borderLSide = parseBorderVariablePayloadFromSettings(
				borderLSide?.settings
			);
			borderLSide = borderLSide?.all;
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
