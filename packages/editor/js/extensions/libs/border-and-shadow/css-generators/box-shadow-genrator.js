/**
 * Blockera dependencies
 */
import { getValueAddonRealValue, getSortedRepeater } from '@blockera/controls';

/**
 * Internal dependencies
 */
import { createCssDeclarations } from '../../../../style-engine';
import { parseCssBoxShadowToRepeaterValue } from '../compatibilities/shadow';

export function BoxShadowGenerator(id, props, options) {
	const { attributes } = props;

	if (!Object.values(attributes?.blockeraBoxShadow)?.length) {
		return '';
	}

	const properties = {
		'box-shadow': [],
	};

	let boxShadowValue = attributes?.blockeraBoxShadow;

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

	const toReturnProperties =
		properties['box-shadow'].length > 0
			? {
					'box-shadow':
						properties['box-shadow'].join(', ') + ' !important',
				}
			: {};

	return createCssDeclarations({
		options,
		properties: toReturnProperties,
	});
}
