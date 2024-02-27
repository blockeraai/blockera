/**
 * Publisher dependencies
 */
import { isUndefined } from '@publisher/utils';
import { createCssDeclarations } from '@publisher/style-engine';
import { getValueAddonRealValue } from '@publisher/hooks';

export function GridColumnGenerator(id, props) {
	const { attributes } = props;

	if (
		isUndefined(attributes.publisherGridColumns) ||
		!Object.values(attributes?.publisherGridColumns)?.length
	) {
		return '';
	}
	const properties = {};

	const value = attributes.publisherGridColumns.value
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
