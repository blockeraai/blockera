/**
 * Internal dependencies
 */
import { createCssRule } from '@publisher/style-engine';

export default {
	getCssRules: (id, props, cssGenerator) => {
		const { attributes } = props;

		if (!attributes?.publisherBoxShadowItems?.length) {
			return '';
		}

		const value = attributes?.publisherBoxShadowItems
			?.map((item) => {
				if (!item.isVisible) {
					return null;
				}
				return `${item.x} ${item.y} ${item.blur} ${item.spread} ${
					item.color
				} ${item.inset ? 'inset' : ''}`;
			})
			?.filter((item) => null !== item);

		return createCssRule({
			selector: `#block-${props.clientId}${
				cssGenerator.selector ? ' ' + cssGenerator.selector : ''
			}`,
			properties: {
				'box-shadow': value?.join(','),
			},
		});
	},
};
