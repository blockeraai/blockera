/**
 * Publisher dependencies
 */
import { createCssRule } from '@publisher/style-engine';
import { getValueAddonRealValue } from '@publisher/hooks';

export function BoxBorderGenerator(id, props, styleEngine) {
	const { attributes } = props;

	if (!attributes?.publisherBorder) {
		return '';
	}

	const properties = {};

	if (attributes?.publisherBorder?.type === 'all') {
		const borderAllWidth = getValueAddonRealValue(
			attributes.publisherBorder.all.width
		);
		if (borderAllWidth) {
			properties.border = `${borderAllWidth} ${
				getValueAddonRealValue(attributes.publisherBorder.all.style) ||
				'solid'
			} ${getValueAddonRealValue(attributes.publisherBorder.all.color)}`;
		}
	} else {
		const borderTopWidth = getValueAddonRealValue(
			attributes.publisherBorder.top.width
		);
		if (borderTopWidth) {
			properties['border-top'] = `${borderTopWidth} ${
				getValueAddonRealValue(attributes.publisherBorder.top.style) ||
				'solid'
			} ${getValueAddonRealValue(attributes.publisherBorder.top.color)}`;
		}

		const borderRightWidth = getValueAddonRealValue(
			attributes.publisherBorder.right.width
		);
		if (borderRightWidth) {
			properties['border-right'] = `${borderRightWidth} ${
				getValueAddonRealValue(
					attributes.publisherBorder.right.style
				) || 'solid'
			} ${getValueAddonRealValue(
				attributes.publisherBorder.right.color
			)}`;
		}

		const borderBottomWidth = getValueAddonRealValue(
			attributes.publisherBorder.bottom.width
		);
		if (borderBottomWidth) {
			properties['border-bottom'] = `${borderBottomWidth} ${
				getValueAddonRealValue(
					attributes.publisherBorder.bottom.style
				) || 'solid'
			} ${getValueAddonRealValue(
				attributes.publisherBorder.bottom.color
			)}`;
		}

		const borderLeftWidth = getValueAddonRealValue(
			attributes.publisherBorder.left.width
		);
		if (borderLeftWidth) {
			properties['border-left'] = `${borderLeftWidth} ${
				getValueAddonRealValue(attributes.publisherBorder.left.style) ||
				'solid'
			} ${getValueAddonRealValue(attributes.publisherBorder.left.color)}`;
		}
	}

	if (!Object.keys(properties).length) {
		return '';
	}

	return createCssRule({
		selector: `#block-${props.clientId}${
			styleEngine.selector ? ' ' + styleEngine.selector : ''
		}`,
		properties,
	});
}
