/**
 * Publisher dependencies
 */
import { createCssDeclarations } from '@publisher/style-engine';
import { getValueAddonRealValue } from '@publisher/hooks';

export function OutlineGenerator(id, props) {
	const { attributes } = props;

	if (!Object.values(attributes?.publisherOutline)?.length) {
		return '';
	}

	const properties = {
		outlines: [],
		offset: [],
	};

	Object.entries(attributes?.publisherOutline)?.map(([, item]) => {
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

	return createCssDeclarations({
		properties: {
			outline: properties.outlines?.join(', '),
			'outline-offset': properties.offset?.join(', '),
		},
	});
}
