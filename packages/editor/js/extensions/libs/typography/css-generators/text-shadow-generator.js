/**
 * Blockera dependencies
 */
import {
	getSortedRepeater,
	getValueAddonRealValue,
	parseCssTextShadowToRepeaterValue,
} from '@blockera/controls';

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

export function TextShadowGenerator(id, props, options) {
	const { attributes } = props;

	if (!Object.values(attributes?.blockeraTextShadow)?.length) {
		return '';
	}

	const shadows = [];

	const textShadowAttr = attributes?.blockeraTextShadow;
	let textShadowValue = textShadowAttr;

	if ('variable' === textShadowValue?.valueType) {
		let rawItems = getVariableRepeaterItemsFromSettings(
			textShadowValue?.settings
		);

		if (typeof rawItems === 'string' && rawItems.trim() !== '') {
			rawItems = Object.values(
				parseCssTextShadowToRepeaterValue(rawItems)
			);
		} else if (!Array.isArray(rawItems)) {
			rawItems = [];
		}

		if (!rawItems.length) {
			return '';
		}

		const rows = rawItems;

		textShadowValue = rows.map((item, i) => [
			String(i),
			{ ...item, order: item.order ?? i },
		]);
	} else {
		textShadowValue = getSortedRepeater(textShadowAttr);
	}

	textShadowValue?.map(([, item]) => {
		if (!item.isVisible) {
			return null;
		}

		shadows.push(
			`${getValueAddonRealValue(item.x)} ${getValueAddonRealValue(
				item.y
			)} ${getValueAddonRealValue(item.blur)} ${getValueAddonRealValue(
				item.color
			)}`
		);

		return undefined;
	});

	const textShadowCss = wrapCssVarIfVariable(
		textShadowAttr,
		shadows.join(',')
	);

	return createCssDeclarations({
		options,
		properties: { 'text-shadow': textShadowCss },
	});
}
