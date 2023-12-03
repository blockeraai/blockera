/**
 * Publisher dependencies
 */
import { createCssRule } from '@publisher/style-engine';
import { getValueAddonRealValue } from '@publisher/hooks';

export function OutlineGenerator(id, props, styleEngine) {
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
			`${getValueAddonRealValue(
				item.border.width
			)} ${getValueAddonRealValue(
				item.border.style
			)} ${getValueAddonRealValue(item.border.color)}`
		);
		properties.offset.push(getValueAddonRealValue(item.offset));

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
