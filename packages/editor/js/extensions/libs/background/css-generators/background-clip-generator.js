/**
 * Blockera dependencies
 */
import { createCssDeclarations } from '../../../../style-engine';

export function backgroundClipGenerator(id, props) {
	const { attributes } = props;

	const value = attributes.blockeraBackgroundClip;

	if (value === 'none') {
		return '';
	}

	if (value === 'text') {
		return createCssDeclarations({
			properties: {
				'background-clip': 'text !important',
				'-webkit-background-clip': 'text !important',
				'-webkit-text-fill-color': 'transparent !important',
			},
		});
	}

	return createCssDeclarations({
		properties: {
			'background-clip': value,
			'-webkit-background-clip': value,
		},
	});
}
