/**
 * Publisher dependencies
 */
import { createCssRule } from '@publisher/style-engine';
import { getValueAddonRealValue } from '@publisher/hooks';

export function TextShadowGenerator(id, props, { media, selector }) {
	const { attributes } = props;

	if (!attributes?.publisherTextShadow?.length) {
		return '';
	}

	const value = attributes?.publisherTextShadow
		?.map((item) => {
			if (!item.isVisible) {
				return null;
			}

			return `${getValueAddonRealValue(item.x)} ${getValueAddonRealValue(
				item.y
			)} ${getValueAddonRealValue(item.blur)} ${getValueAddonRealValue(
				item.color
			)}`;
		})
		?.filter((item) => null !== item);

	return createCssRule({
		media,
		selector,
		properties: {
			'text-shadow': value?.join(', '),
		},
	});
}
