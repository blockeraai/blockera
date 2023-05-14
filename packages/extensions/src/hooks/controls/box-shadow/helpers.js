export default {
	getCssRules: (id, props, cssGenerator) => {
		const {
			attributes: { publisherAttributes },
		} = props;

		const value = publisherAttributes?.boxShadowItems
			?.map((item) => {
				if (!item.isVisible) {
					return;
				}
				return `${item.x} ${item.y} ${item.blur} ${item.spread} ${
					item.color
				} ${item.inset ? 'inset' : ''}`;
			})
			?.filter((item) => null !== item);

		return `.publisher-core.extension.publisher-extension-ref.client-id-${
			props.clientId
		}{
					box-shadow: ${value?.join(',')};
				}
				.publisher-box-shadow-wrapper.publisher-attrs-id-${publisherAttributes?.id}${
			cssGenerator.selector ?? ''
		}{
					box-shadow: ${value?.join(',')};
				}`;
	},
};
