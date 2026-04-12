/**
 * Blockera dependencies
 */
import { isUndefined } from '@blockera/utils';
import { getValueAddonRealValue, getSortedRepeater } from '@blockera/controls';

/**
 * Internal dependencies
 */
import { createCssDeclarations } from '../../../../style-engine';
import { getVariableRepeaterItemsFromSettings } from '../../value-addon-variable-payload';

function wrapCssVarIfVariable(field, cssValue) {
	if (
		'variable' === field?.valueType &&
		field?.settings?.var &&
		cssValue !== '' &&
		cssValue !== undefined
	) {
		return `var(${field.settings.var}, ${cssValue})`;
	}
	return cssValue;
}

export function FilterGenerator(id, props, options) {
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

	const filterAttr = attributes?.[_id];
	let filterValue = filterAttr;

	if ('variable' === filterValue?.valueType) {
		filterValue = getVariableRepeaterItemsFromSettings(
			filterValue?.settings
		);
		filterValue = filterValue.map((f, i) => [`${f.type}-${i}`, f]);
	} else {
		filterValue = getSortedRepeater(filterValue);
	}

	const value = filterValue
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

	const filterCss = wrapCssVarIfVariable(filterAttr, value?.join(' '));

	return createCssDeclarations({
		options,
		properties: {
			[property]: filterCss,
		},
	});
}
