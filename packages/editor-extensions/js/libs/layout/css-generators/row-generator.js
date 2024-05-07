/**
 * Blockera dependencies
 */
import { isUndefined } from '@blockera/utils';
import { getValueAddonRealValue } from '@blockera/editor';
import { createCssDeclarations } from '@blockera/style-engine';

export function GridRowGenerator(id, props) {
	const { attributes } = props;

	if (
		isUndefined(attributes.blockeraGridRows) ||
		!Object.values(attributes?.blockeraGridRows)?.length
	) {
		return '';
	}
	const properties = {};
	const value = attributes.blockeraGridRows.value
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

	properties['grid-template-rows'] = value?.join(' ');

	return createCssDeclarations({
		properties,
	});
}
