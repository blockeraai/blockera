/**
 * Publisher dependencies
 */
import { createCssRule } from '@publisher/style-engine';

export function backgroundClipCSSGenerator(id, props, styleEngine) {
	const { attributes } = props;

	if (attributes?.publisherBackgroundClip === 'none') {
		return '';
	}

	if (attributes.publisherBackgroundClip === 'text') {
		return createCssRule({
			selector: `#block-${props.clientId}${
				styleEngine.selector ? ' ' + styleEngine.selector : ''
			}`,
			properties: {
				'background-clip': attributes.publisherBackgroundClip,
				'-webkit-background-clip': attributes.publisherBackgroundClip,
				'-webkit-text-fill-color': 'transparent',
			},
		});
	}

	return createCssRule({
		selector: `#block-${props.clientId}${
			styleEngine.selector ? ' ' + styleEngine.selector : ''
		}`,
		properties: {
			'background-clip': attributes.publisherBackgroundClip,
			'-webkit-background-clip': attributes.publisherBackgroundClip,
		},
	});
}
