/**
 * Internal dependencies
 */
import { createCssRule } from '@publisher/style-engine';

export default {
	getCssRules: (id, props, cssGenerator) => {
		const { attributes } = props;

		if (!attributes?.boxShadowItems?.length) {
			return '';
		}

		const value = attributes?.boxShadowItems
			?.map((item) => {
				if (!item.isVisible) {
					return null;
				}
				return `${item.x} ${item.y} ${item.blur} ${item.spread} ${
					item.color
				} ${item.inset ? 'inset' : ''}`;
			})
			?.filter((item) => null !== item);

		return `${createCssRule({
			selector: `.publisher-core.extension.publisher-extension-ref.client-id-${props.clientId}`,
			properties: {
				'box-shadow': value?.join(','),
			},
		})}\n${createCssRule({
			selector: `.publisher-box-shadow-wrapper${
				cssGenerator.selector ?? ''
			}`,
			properties: {
				'box-shadow': value?.join(','),
			},
		})}`;
	},
};
