/**
 * Blockera dependencies
 */
import { createCssDeclarations } from '@blockera/style-engine';
import { getValueAddonRealValue } from '@blockera/hooks';

export function TextShadowGenerator(id, props) {
	const { attributes } = props;

	if (!Object.values(attributes?.blockeraTextShadow)?.length) {
		return '';
	}

	const shadows = [];

	Object.entries(attributes?.blockeraTextShadow)?.map(([, item]) => {
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
		properties: { 'text-shadow': shadows.join(',') },
	});
}
