/**
 * Publisher dependencies
 */
import { createCssRule } from '@publisher/style-engine';
import { getValueAddonRealValue } from '@publisher/hooks';

export function BoxShadowGenerator(id, props, { media, selector }) {
	const { attributes } = props;

	if (!attributes?.publisherBoxShadow?.length) {
		return '';
	}

	const value = attributes?.publisherBoxShadow
		?.map((item) => {
			if (!item.isVisible) {
				return null;
			}

			return `${
				item.type === 'inner' ? 'inset' : ''
			} ${getValueAddonRealValue(item.x)} ${getValueAddonRealValue(
				item.y
			)} ${getValueAddonRealValue(item.blur)} ${getValueAddonRealValue(
				item.spread
			)} ${getValueAddonRealValue(item.color)}`;
		})
		?.filter((item) => null !== item);

	return createCssRule({
		media,
		selector,
		properties: {
			'box-shadow': value?.join(', '),
		},
	});
}
