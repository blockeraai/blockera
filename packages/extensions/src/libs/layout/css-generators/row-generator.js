/**
 * Publisher dependencies
 */
import { isUndefined } from '@publisher/utils';
import { getValueAddonRealValue } from '@publisher/hooks';
import { createCssDeclarations } from '@publisher/style-engine';

export function GridRowGenerator(id, props) {
	const { attributes } = props;

	if (
		isUndefined(attributes.publisherGridRows) ||
		!Object.values(attributes?.publisherGridRows)?.length
	) {
		return '';
	}
	const properties = {};
	const value = attributes.publisherGridRows.value
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
