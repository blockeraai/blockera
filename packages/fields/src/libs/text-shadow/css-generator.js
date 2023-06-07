/**
 * Publisher dependencies
 */
import { createCssRule } from '@publisher/style-engine';

export function cssGenerator(id, props, styleEngine) {
	const { attributes } = props;

	if (!attributes?.publisherTextShadow?.length) {
		return '';
	}

	const value = attributes?.publisherTextShadow
		?.map((item) => {
			if (!item.isVisible) {
				return null;
			}

			return `${item.x} ${item.y} ${item.blur} ${item.color}`;
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
