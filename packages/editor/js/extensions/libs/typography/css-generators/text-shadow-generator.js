/**
 * Blockera dependencies
 */
import { getValueAddonRealValue, getSortedRepeater } from '@blockera/controls';

/**
 * Internal dependencies
 */
import { createCssDeclarations } from '../../../../style-engine';
import { parseCssTextShadowToRepeaterValue } from '../../border-and-shadow/compatibilities/text-shadow-css';

export function TextShadowGenerator(id, props, options) {
	const { attributes } = props;

	if (!Object.values(attributes?.blockeraTextShadow)?.length) {
		return '';
	}

	const shadows = [];

	let textShadowValue = attributes?.blockeraTextShadow;

	if ('variable' === textShadowValue?.valueType) {
		let rawItems = null;
		try {
			rawItems = JSON.parse(
				textShadowValue?.settings?.value || '{}'
			)?.items;
		} catch (e) {
			rawItems = null;
		}

		if (rawItems === null || rawItems === undefined) {
			return '';
		}

		let rows = rawItems;
		if (!Array.isArray(rows)) {
			rows = Object.values(parseCssTextShadowToRepeaterValue(rows));
		}

		textShadowValue = rows.map((item, i) => [
			String(i),
			{ ...item, order: item.order ?? i },
		]);
	} else {
		textShadowValue = getSortedRepeater(attributes?.blockeraTextShadow);
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

	return createCssDeclarations({
		options,
		properties: { 'text-shadow': shadows.join(',') },
	});
}
