/**
 * Blockera dependencies
 */
import { createCssDeclarations } from '../../../../style-engine';
import { getValueAddonRealValue } from '@blockera/editor';

export function BoxBorderGenerator(id, props) {
	const { attributes } = props;

	if (!attributes?.blockeraBorder) {
		return '';
	}

	const properties = {};

	if (attributes?.blockeraBorder?.type === 'all') {
		const borderAllWidth = attributes.blockeraBorder?.all?.width;
		if (borderAllWidth) {
			properties.border = `${borderAllWidth} ${
				attributes.blockeraBorder.all.style || 'solid'
			} ${getValueAddonRealValue(attributes.blockeraBorder.all.color)}`;
		}
	} else {
		const borderTopWidth = attributes.blockeraBorder?.top?.width;
		if (borderTopWidth) {
			properties['border-top'] = `${borderTopWidth} ${
				attributes.blockeraBorder.top.style || 'solid'
			} ${getValueAddonRealValue(attributes.blockeraBorder.top.color)}`;
		}

		const borderRightWidth = attributes.blockeraBorder?.right?.width;
		if (borderRightWidth) {
			properties['border-right'] = `${borderRightWidth} ${
				attributes.blockeraBorder.right.style || 'solid'
			} ${getValueAddonRealValue(attributes.blockeraBorder.right.color)}`;
		}

		const borderBottomWidth = attributes.blockeraBorder?.bottom?.width;
		if (borderBottomWidth) {
			properties['border-bottom'] = `${borderBottomWidth} ${
				attributes.blockeraBorder.bottom.style || 'solid'
			} ${getValueAddonRealValue(
				attributes.blockeraBorder.bottom.color
			)}`;
		}

		const borderLeftWidth = attributes.blockeraBorder?.left?.width;
		if (borderLeftWidth) {
			properties['border-left'] = `${borderLeftWidth} ${
				attributes.blockeraBorder.left.style || 'solid'
			} ${getValueAddonRealValue(attributes.blockeraBorder.left.color)}`;
		}
	}

	if (!Object.keys(properties).length) {
		return '';
	}

	return createCssDeclarations({
		properties,
		options: {
			important: true,
		},
	});
}
