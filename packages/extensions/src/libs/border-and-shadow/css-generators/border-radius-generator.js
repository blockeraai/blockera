/**
 * Publisher dependencies
 */
import { createCssRule } from '@publisher/style-engine';
import { getValueAddonRealValue } from '@publisher/hooks';

export function BorderRadiusGenerator(id, props, styleEngine) {
	const { attributes } = props;

	if (!attributes?.publisherBorderRadius) {
		return '';
	}

	const properties = {};

	if (attributes?.publisherBorderRadius?.type === 'all') {
		properties['border-radius'] = getValueAddonRealValue(
			attributes.publisherBorderRadius.all
		);
	} else {
		properties['border-top-left-radius'] = getValueAddonRealValue(
			attributes.publisherBorderRadius.topLeft
		);
		properties['border-top-right-radius'] = getValueAddonRealValue(
			attributes.publisherBorderRadius.topRight
		);
		properties['border-bottom-left-radius'] = getValueAddonRealValue(
			attributes.publisherBorderRadius.bottomLeft
		);
		properties['border-bottom-right-radius'] = getValueAddonRealValue(
			attributes.publisherBorderRadius.bottomRight
		);
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
