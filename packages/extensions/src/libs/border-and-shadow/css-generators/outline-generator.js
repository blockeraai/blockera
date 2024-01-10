/**
 * Publisher dependencies
 */
import { createCssRule } from '@publisher/style-engine';
import { getValueAddonRealValue } from '@publisher/hooks';

export function OutlineGenerator(id, props, { media, selector }) {
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

		properties.outlines.push(
			`${item.border.width} ${item.border.style} ${getValueAddonRealValue(
				item.border.color
			)}`
		);
		properties.offset.push(getValueAddonRealValue(item.offset));

		return undefined;
	});

	return createCssRule({
		media,
		selector,
		properties: {
			outline: properties.outlines?.join(', '),
			'outline-offset': properties.offset?.join(', '),
		},
	});
}
