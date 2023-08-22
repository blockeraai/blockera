/**
 * Publisher dependencies
 */
import { createCssRule } from '@publisher/style-engine';

export function BoxBorderGenerator(id, props, styleEngine) {
	const { attributes } = props;

	if (!attributes?.publisherBorder) {
		return '';
	}

	const properties = {};

	if (attributes?.publisherBorder?.type === 'all') {
		if (attributes.publisherBorder.all.width) {
			properties.border = `${attributes.publisherBorder.all.width} ${attributes.publisherBorder.all.style} ${attributes.publisherBorder.all.color}`;
		}
	} else if (attributes.publisherBorder.top.width) {
		if (attributes.publisherBorder.top.width) {
			properties[
				'border-top'
			] = `${attributes.publisherBorder.top.width} ${attributes.publisherBorder.top.style} ${attributes.publisherBorder.top.color}`;
		}

		if (attributes.publisherBorder.right.width) {
			properties[
				'border-right'
			] = `${attributes.publisherBorder.right.width} ${attributes.publisherBorder.right.style} ${attributes.publisherBorder.right.color}`;
		}

		if (attributes.publisherBorder.bottom.width) {
			properties[
				'border-bottom'
			] = `${attributes.publisherBorder.bottom.width} ${attributes.publisherBorder.bottom.style} ${attributes.publisherBorder.bottom.color}`;
		}

		if (attributes.publisherBorder.left.width) {
			properties[
				'border-left'
			] = `${attributes.publisherBorder.left.width} ${attributes.publisherBorder.left.style} ${attributes.publisherBorder.left.color}`;
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
