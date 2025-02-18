/**
 * Blockera dependencies
 */
import { createCssDeclarations } from '../../../../style-engine';

export function backgroundClipGenerator(id, props, options) {
	const { attributes } = props;

	const value = attributes.blockeraBackgroundClip;

	if (value === 'none') {
		return '';
	}

	if (value === 'text') {
		return createCssDeclarations({
			options,
			properties: {
				'background-clip': 'text !important',
				'-webkit-background-clip': 'text !important',
				'-webkit-text-fill-color': 'transparent !important',
			},
		});
	}

	return createCssDeclarations({
		options,
		properties: {
			'background-clip': value,
			'-webkit-background-clip': value,
		},
	});
}
