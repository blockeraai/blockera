/**
 * Publisher dependencies
 */
import { isUndefined } from '@publisher/utils';
import { createCssRule } from '@publisher/style-engine';
import { getValueAddonRealValue } from '@publisher/hooks';

export function GridRowGenerator(id, props, { media, selector }) {
	const { attributes } = props;

	if (
		isUndefined(attributes.publisherGridRows) ||
		!attributes.publisherGridRows.value?.length
	) {
		return '';
	}
	const properties = {};

	const value = attributes.publisherGridRows.value
		?.map((item) => {
			// if (item['auto-generated']) {
			// 	switch (item['sizing-mode']) {
			// 		case 'min/max':
			// 			properties[
			// 				'grid-auto-columns'
			// 			] = `minmax(${getValueAddonRealValue(
			// 				item['min-size']
			// 			)}, ${getValueAddonRealValue(item['max-size'])})`;
			// 			break;
			// 		default:
			// 			properties[
			// 				'grid-auto-rows'
			// 			] = `${getValueAddonRealValue(item.size)}`;
			// 			break;
			// 	}

			// 	return null;
			// }

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

	return createCssRule({
		media,
		selector,
		properties,
	});
}
