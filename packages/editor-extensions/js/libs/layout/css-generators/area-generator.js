/**
 * Blockera dependencies
 */
import { isUndefined } from '@blockera/utils';
import { createCssDeclarations } from '@blockera/style-engine';

/**
 * Internal dependencies
 */
import { calcGridTemplateAreas } from '../utils';

export function GridAreaGenerator(id, props) {
	const { attributes } = props;

	if (
		isUndefined(attributes.blockeraGridAreas) ||
		!attributes.blockeraGridAreas?.length
	) {
		return '';
	}

	const gridTemplateAreas = calcGridTemplateAreas({
		gridRows: attributes.blockeraGridRows,
		gridColumns: attributes.blockeraGridColumns,
		gridAreas: attributes.blockeraGridAreas,
	});

	return createCssDeclarations({
		properties: {
			'grid-template-areas': gridTemplateAreas
				?.map((item) => `"${item.join(' ')}"`)
				.join(` `),
		},
	});
}
