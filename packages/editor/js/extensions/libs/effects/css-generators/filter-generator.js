/**
 * Blockera dependencies
 */
import { getSortedRepeater } from '@blockera/controls';
import { isUndefined } from '@blockera/utils';
import { createCssDeclarations } from '../../../../style-engine';
import { getValueAddonRealValue } from '@blockera/editor';

export function FilterGenerator(id, props) {
	const isBackdrop = 'blockeraBackdropFilter' === id;
	const property = isBackdrop ? 'backdrop-filter' : 'filter';
	const { attributes } = props;
	const _id = isBackdrop ? id : 'blockeraFilter';

	if (
		isUndefined(attributes[_id]) ||
		!Object.values(attributes[_id])?.length
	) {
		return '';
	}

	const value = getSortedRepeater(attributes[_id])
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
