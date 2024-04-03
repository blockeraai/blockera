/**
 * Publisher dependencies
 */
import { isUndefined } from '@publisher/utils';
import { createCssDeclarations } from '@publisher/style-engine';
import { getValueAddonRealValue } from '@publisher/hooks';

export function FilterGenerator(id, props) {
	const isBackdrop = 'publisherBackdropFilter' === id;
	const property = isBackdrop ? 'backdrop-filter' : 'filter';
	const { attributes } = props;
	const _id = isBackdrop ? id : 'publisherFilter';

	if (
		isUndefined(attributes[_id]) ||
		!Object.values(attributes[_id])?.length
	) {
		return '';
	}

	const value = Object.entries(attributes[_id])
		?.map(([, item]) => {
			if (!item.isVisible) {
				return null;
			}

			if (item.type === 'drop-shadow') {
				return `${item.type}(${getValueAddonRealValue(
					item['drop-shadow-x']
				)} ${getValueAddonRealValue(
					item['drop-shadow-y']
				)} ${getValueAddonRealValue(
					item['drop-shadow-blur']
				)} ${getValueAddonRealValue(item['drop-shadow-color'])})`;
			}

			return `${item.type}(${getValueAddonRealValue(item[item.type])})`;
		})
		?.filter((item) => null !== item);

	return createCssDeclarations({
		properties: {
			[property]: value?.join(' '),
		},
	});
}
