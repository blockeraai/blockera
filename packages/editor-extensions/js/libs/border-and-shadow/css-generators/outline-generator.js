/**
 * Blockera dependencies
 */
import { createCssDeclarations } from '@blockera/style-engine';
import { getValueAddonRealValue } from '@blockera/editor';

export function OutlineGenerator(id, props) {
	const { attributes } = props;

	if (!Object.values(attributes?.blockeraOutline)?.length) {
		return '';
	}

	const properties = {
		outlines: [],
		offset: [],
	};

	Object.entries(attributes?.blockeraOutline)?.map(([, item]) => {
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
