/**
 * Publisher dependencies
 */
import { createCssRule } from '@publisher/style-engine';

export function backgroundClipGenerator(id, props, { media, selector }) {
	const { attributes } = props;

	const value = attributes.publisherBackgroundClip;

	if (value === 'none') {
		return '';
	}

	if (value === 'text') {
		return createCssRule({
			media,
			selector,
			properties: {
				'background-clip': 'text !important',
				'-webkit-background-clip': 'text !important',
				'-webkit-text-fill-color': 'transparent !important',
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
