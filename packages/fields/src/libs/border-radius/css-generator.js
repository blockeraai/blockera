/**
 * Publisher dependencies
 */
import { createCssRule } from '@publisher/style-engine';

export function cssGenerator(id, props, styleEngine) {
	const { attributes } = props;

	if (!attributes?.publisherBorderRadius) {
		return '';
	}

	const properties = {};

	if (attributes?.publisherBorderRadius?.type === 'all') {
		properties['border-radius'] = attributes.publisherBorderRadius.all;
	} else {
		properties['border-top-left-radius'] =
			attributes.publisherBorderRadius.topLeft;
		properties['border-top-right-radius'] =
			attributes.publisherBorderRadius.topRight;
		properties['border-bottom-left-radius'] =
			attributes.publisherBorderRadius.bottomLeft;
		properties['border-bottom-right-radius'] =
			attributes.publisherBorderRadius.bottomRight;
	}

	if (!Object.keys(properties).length) {
		return '';
	}

	return createCssRule({
		selector: `#block-${props.clientId}${
			styleEngine.selector ? ' ' + styleEngine.selector : ''
		}`,
		properties,
	});
}
