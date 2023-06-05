/**
 * Publisher dependencies
 */
import { createCssRule } from '@publisher/style-engine';

export function filterFieldCSSGenerator(id, props, styleEngine) {
	const { attributes } = props;

	if (!attributes?.publisherFilter?.length) {
		return '';
	}

	const value = attributes?.publisherFilter
		?.map((item) => {
			if (!item.isVisible) {
				return null;
			}

			if (item.type === 'drop-shadow') {
				return `${item.type}(${item['drop-shadow-x']} ${item['drop-shadow-y']} ${item['drop-shadow-blur']} ${item['drop-shadow-color']})`;
			}

			return `${item.type}(${item[item.type]})`;
		})
		?.filter((item) => null !== item);

	return createCssRule({
		selector: `#block-${props.clientId}${
			styleEngine.selector ? ' ' + styleEngine.selector : ''
		}`,
		properties: {
			filter: value?.join(' '),
		},
	});
}

export function backdropFilterFieldCSSGenerator(id, props, styleEngine) {
	const { attributes } = props;

	if (!attributes?.publisherBackdropFilter?.length) {
		return '';
	}

	const value = attributes?.publisherBackdropFilter
		?.map((item) => {
			if (!item.isVisible) {
				return null;
			}

			if (item.type === 'drop-shadow') {
				return `${item.type}(${item['drop-shadow-x']} ${item['drop-shadow-y']} ${item['drop-shadow-blur']} ${item['drop-shadow-color']})`;
			}

			return `${item.type}(${item[item.type]})`;
		})
		?.filter((item) => null !== item);

	return createCssRule({
		selector: `#block-${props.clientId}${
			styleEngine.selector ? ' ' + styleEngine.selector : ''
		}`,
		properties: {
			'backdrop-filter': value?.join(' '),
		},
	});
}
