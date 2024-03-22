/**
 * Publisher dependencies
 */
import { createCssDeclarations } from '@publisher/style-engine';
import { getValueAddonRealValue } from '@publisher/hooks';

export function TextShadowGenerator(id, props) {
	const { attributes } = props;

	if (!Object.values(attributes?.publisherTextShadow)?.length) {
		return '';
	}

	const shadows = [];

	Object.entries(attributes?.publisherTextShadow)?.map(([, item]) => {
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
