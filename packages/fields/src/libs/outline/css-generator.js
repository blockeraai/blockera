/**
 * Publisher dependencies
 */
import { createCssRule } from '@publisher/style-engine';

export function cssGenerator(id, props, styleEngine) {
	const { attributes } = props;

	if (!attributes?.publisherOutline?.length) {
		return '';
	}

	const properties = {
		outlines: [],
		offset: [],
	};

	attributes?.publisherOutline?.map((item) => {
		if (!item.isVisible) {
			return null;
		}

		properties.outlines.push(`${item.width} ${item.style} ${item.color}`);
		properties.offset.push(item.offset);

		return undefined;
	});

	return createCssRule({
		selector: `#block-${props.clientId}${
			styleEngine.selector ? ' ' + styleEngine.selector : ''
		}`,
		properties: {
			outline: properties.outlines?.join(', '),
			'outline-offset': properties.offset?.join(', '),
		},
	});
}
