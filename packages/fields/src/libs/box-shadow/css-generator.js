/**
 * Publisher dependencies
 */
import { createCssRule } from '@publisher/style-engine';

export function cssGenerator(id, props, styleEngine) {
	const { attributes } = props;

	if (!attributes?.publisherBoxShadow?.length) {
		return '';
	}

	const value = attributes?.publisherBoxShadow
		?.map((item) => {
			if (!item.isVisible) {
				return null;
			}

			return `${item.type === 'inner' ? 'inset' : ''} ${item.x} ${
				item.y
			} ${item.blur} ${item.spread} ${item.color}`;
		})
		?.filter((item) => null !== item);

	return createCssRule({
		selector: `#block-${props.clientId}${
			styleEngine.selector ? ' ' + styleEngine.selector : ''
		}`,
		properties: {
			'box-shadow': value?.join(','),
		},
	});
}
