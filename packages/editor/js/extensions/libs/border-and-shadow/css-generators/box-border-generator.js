/**
 * Blockera dependencies
 */
import { getValueAddonRealValue } from '@blockera/controls';

/**
 * Internal dependencies
 */
import { createCssDeclarations } from '../../../../style-engine';

export function BoxBorderGenerator(id, props, options) {
	const { attributes } = props;

	if (!attributes?.blockeraBorder) {
		return '';
	}

	const properties = {};
	const borderValue = attributes.blockeraBorder;

	if (borderValue?.type === 'all') {
		let borderSides = borderValue?.all;
		if ('variable' === borderSides?.valueType) {
			borderSides = JSON.parse(borderSides?.settings?.value);
			borderSides = borderSides.all;
		}

		const borderAllWidth = borderSides?.width;
		if (borderAllWidth) {
			properties.border = `${borderAllWidth} ${
				borderSides.style || 'solid'
			} ${getValueAddonRealValue(borderSides.color)}`;
		}
	} else {
		let borderTSide = borderValue?.top;
		if ('variable' === borderTSide?.valueType) {
			borderTSide = JSON.parse(borderTSide?.settings?.value);
			borderTSide = borderTSide.all;
		}
		const borderTopWidth = borderTSide?.width;
		if (borderTopWidth) {
			properties['border-top'] = `${borderTopWidth} ${
				borderTSide.style || 'solid'
			} ${getValueAddonRealValue(borderTSide.color)}`;
		}

		let borderRSide = borderValue?.right;
		if ('variable' === borderRSide?.valueType) {
			borderRSide = JSON.parse(borderRSide?.settings?.value);
			borderRSide = borderRSide.all;
		}
		const borderRightWidth = borderRSide?.width;
		if (borderRightWidth) {
			properties['border-right'] = `${borderRightWidth} ${
				borderRSide.style || 'solid'
			} ${getValueAddonRealValue(borderRSide.color)}`;
		}

		let borderBSide = borderValue?.bottom;
		if ('variable' === borderBSide?.valueType) {
			borderBSide = JSON.parse(borderBSide?.settings?.value);
			borderBSide = borderBSide.all;
		}
		const borderBottomWidth = borderBSide?.width;
		if (borderBottomWidth) {
			properties['border-bottom'] = `${borderBottomWidth} ${
				borderBSide.style || 'solid'
			} ${getValueAddonRealValue(borderBSide.color)}`;
		}

		let borderLSide = borderValue?.left;
		if ('variable' === borderLSide?.valueType) {
			borderLSide = JSON.parse(borderLSide?.settings?.value);
			borderLSide = borderLSide.all;
		}
		const borderLeftWidth = borderLSide?.width;
		if (borderLeftWidth) {
			properties['border-left'] = `${borderLeftWidth} ${
				borderLSide.style || 'solid'
			} ${getValueAddonRealValue(borderLSide.color)}`;
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
