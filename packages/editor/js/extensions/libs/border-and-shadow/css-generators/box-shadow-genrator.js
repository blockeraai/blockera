/**
 * Blockera dependencies
 */
import { getValueAddonRealValue, getSortedRepeater } from '@blockera/controls';

/**
 * Internal dependencies
 */
import { createCssDeclarations } from '../../../../style-engine';
import { parseCssBoxShadowToRepeaterValue } from '../compatibilities/shadow';

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

export function BoxShadowGenerator(id, props, options) {
	const { attributes } = props;

	if (!Object.values(attributes?.blockeraBoxShadow)?.length) {
		return '';
	}

	const properties = {
		'box-shadow': [],
	};

	const boxShadowAttr = attributes?.blockeraBoxShadow;
	let boxShadowValue = boxShadowAttr;

	if ('variable' === boxShadowValue?.valueType) {
		boxShadowValue =
			JSON.parse(boxShadowValue?.settings?.value)?.items ||
			attributes?.blockeraBoxShadow;

		if (!Array.isArray(boxShadowValue)) {
			boxShadowValue = Object.values(
				parseCssBoxShadowToRepeaterValue(boxShadowValue)
			);
		}

		boxShadowValue = boxShadowValue.map((s, i) => [`${s.type}-${i}`, s]);
	} else {
		boxShadowValue = getSortedRepeater(boxShadowValue);
	}

	// Collect all properties
	boxShadowValue?.map(([, item]) => {
		if (!item.isVisible) {
			return undefined;
		}

		properties['box-shadow'].push(
			`${item.type === 'inner' ? 'inset' : ''} ${getValueAddonRealValue(
				item.x
			)} ${getValueAddonRealValue(item.y)} ${getValueAddonRealValue(
				item.blur
			)} ${getValueAddonRealValue(item.spread)} ${getValueAddonRealValue(
				item.color
			)}`
		);

		return undefined;
	});

	let boxShadowCss =
		properties['box-shadow'].length > 0
			? properties['box-shadow'].join(', ')
			: '';

	boxShadowCss = wrapCssVarIfVariable(boxShadowAttr, boxShadowCss);

	const toReturnProperties =
		boxShadowCss !== ''
			? {
					'box-shadow': boxShadowCss + ' !important',
				}
			: {};

	return createCssDeclarations({
		options,
		properties: toReturnProperties,
	});
}
