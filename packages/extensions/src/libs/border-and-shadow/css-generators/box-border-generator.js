/**
 * Publisher dependencies
 */
import { createCssRule } from '@publisher/style-engine';
import { getValueAddonRealValue } from '@publisher/hooks';

export function BoxBorderGenerator(id, props, { media, selector }) {
	const { attributes } = props;

	if (!attributes?.publisherBorder) {
		return '';
	}

	const properties = {};

	if (attributes?.publisherBorder?.type === 'all') {
		const borderAllWidth = attributes.publisherBorder.all.width;
		if (borderAllWidth) {
			properties.border = `${borderAllWidth} ${
				attributes.publisherBorder.all.style || 'solid'
			} ${getValueAddonRealValue(attributes.publisherBorder.all.color)}`;
		}
	} else {
		const borderTopWidth = attributes.publisherBorder.top.width;
		if (borderTopWidth) {
			properties['border-top'] = `${borderTopWidth} ${
				attributes.publisherBorder.top.style || 'solid'
			} ${getValueAddonRealValue(attributes.publisherBorder.top.color)}`;
		}

		const borderRightWidth = attributes.publisherBorder.right.width;
		if (borderRightWidth) {
			properties['border-right'] = `${borderRightWidth} ${
				attributes.publisherBorder.right.style || 'solid'
			} ${getValueAddonRealValue(
				attributes.publisherBorder.right.color
			)}`;
		}

		const borderBottomWidth = attributes.publisherBorder.bottom.width;
		if (borderBottomWidth) {
			properties['border-bottom'] = `${borderBottomWidth} ${
				attributes.publisherBorder.bottom.style || 'solid'
			} ${getValueAddonRealValue(
				attributes.publisherBorder.bottom.color
			)}`;
		}

		const borderLeftWidth = attributes.publisherBorder.left.width;
		if (borderLeftWidth) {
			properties['border-left'] = `${borderLeftWidth} ${
				attributes.publisherBorder.left.style || 'solid'
			} ${getValueAddonRealValue(attributes.publisherBorder.left.color)}`;
		}
	}

	if (!Object.keys(properties).length) {
		return '';
	}

	return createCssRule({
		media,
		selector,
		properties,
	});
}
