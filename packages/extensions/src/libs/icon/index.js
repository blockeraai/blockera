/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { IconField } from '@publisher/fields';

export const attributes = {
	publisherIcon: {
		type: 'string',
		default: 'home',
	},
	publisherIconSize: {
		type: 'number',
		default: 16,
	},
	publisherIconType: {
		type: 'string',
		default: 'wp',
	},
	publisherIconSVG: {
		type: 'object',
		default: '',
	},
};

export const supports = {
	//TODO: please implements or remove supports list from WordPress default support block type!
};

export function IconExtension({ children, ...props }) {
	return <IconField {...{ ...props, label: __('Icon', 'publisher-core') }} />;
}
