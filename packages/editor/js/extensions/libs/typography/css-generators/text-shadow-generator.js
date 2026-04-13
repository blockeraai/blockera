/**
 * Blockera dependencies
 */
import { getValueAddonRealValue, getSortedRepeater } from '@blockera/controls';

/**
 * Internal dependencies
 */
import { createCssDeclarations } from '../../../../style-engine';

export function TextShadowGenerator(id, props, options) {
	const { attributes } = props;

	if (!Object.values(attributes?.blockeraTextShadow)?.length) {
		return '';
	}

	const shadows = [];

	getSortedRepeater(attributes?.blockeraTextShadow)?.map(([, item]) => {
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
