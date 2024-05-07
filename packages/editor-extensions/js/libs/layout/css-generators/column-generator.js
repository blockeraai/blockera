/**
 * Blockera dependencies
 */
import { isUndefined } from '@blockera/utils';
import { createCssDeclarations } from '@blockera/style-engine';
import { getValueAddonRealValue } from '@blockera/editor';

export function GridColumnGenerator(id, props) {
	const { attributes } = props;

	if (
		isUndefined(attributes.blockeraGridColumns) ||
		!Object.values(attributes?.blockeraGridColumns)?.length
	) {
		return '';
	}
	const properties = {};

	const value = attributes.blockeraGridColumns.value
		?.map((item) => {
			if (item['auto-fit']) {
				switch (item['sizing-mode']) {
					case 'min/max':
						return `repeat(auto-fit,minmax(${getValueAddonRealValue(
							item['min-size']
						)}, ${getValueAddonRealValue(item['max-size'])}))`;

					default:
						return `repeat(auto-fit,${getValueAddonRealValue(
							item.size
						)})`;
				}
			}

			switch (item['sizing-mode']) {
				case 'min/max':
					return `minmax(${getValueAddonRealValue(
						item['min-size']
					)}, ${getValueAddonRealValue(item['max-size'])})`;

				default:
					return `${getValueAddonRealValue(item.size)}`;
			}
		})
		?.filter((item) => null !== item);

	properties['grid-template-columns'] = value?.join(' ');

	return createCssDeclarations({
		properties,
	});
}
