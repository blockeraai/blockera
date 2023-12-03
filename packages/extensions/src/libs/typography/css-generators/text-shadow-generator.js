/**
 * Publisher dependencies
 */
import { createCssRule } from '@publisher/style-engine';
import { getValueAddonRealValue } from '@publisher/hooks';

export function TextShadowGenerator(id, props, styleEngine) {
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
		selector: `#block-${props.clientId}${
			styleEngine.selector ? ' ' + styleEngine.selector : ''
		}`,
		properties: {
			'text-shadow': value?.join(', '),
		},
	});
}
