/**
 * Publisher dependencies
 */
import { isUndefined } from '@publisher/utils';
import { createCssDeclarations } from '@publisher/style-engine';

/**
 * Internal dependencies
 */
import { calcGridTemplateAreas } from '../utils';

export function GridAreaGenerator(id, props) {
	const { attributes } = props;

	if (
		isUndefined(attributes.publisherGridAreas) ||
		!attributes.publisherGridAreas?.length
	) {
		return '';
	}

	const gridTemplateAreas = calcGridTemplateAreas({
		gridRows: attributes.publisherGridRows,
		gridColumns: attributes.publisherGridColumns,
		gridAreas: attributes.publisherGridAreas,
	});

	return createCssDeclarations({
		properties: {
			'grid-template-areas': gridTemplateAreas
				?.map((item) => `"${item.join(' ')}"`)
				.join(` `),
		},
	});
}
