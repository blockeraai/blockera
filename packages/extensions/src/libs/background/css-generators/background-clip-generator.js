/**
 * Publisher dependencies
 */
import { createCssRule } from '@publisher/style-engine';
import { getValueAddonRealValue } from '@publisher/hooks';

export function backgroundClipGenerator(id, props, { media, selector }) {
	const { attributes } = props;

	const value = getValueAddonRealValue(attributes.publisherBackgroundClip);

	if (value === 'none') {
		return '';
	}

	if (value === 'text') {
		return createCssRule({
			selector: `#block-${props.clientId}${
				styleEngine.selector ? ' ' + styleEngine.selector : ''
			}`,
			properties: {
				'background-clip': 'text',
				'-webkit-background-clip': 'text',
				'-webkit-text-fill-color': 'transparent',
			},
		});
	}

	return createCssRule({
		media,
		selector,
		properties: {
			'background-clip': value,
			'-webkit-background-clip': value,
		},
	});
}
