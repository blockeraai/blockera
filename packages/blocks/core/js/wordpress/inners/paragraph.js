// @flow

/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Blockera dependencies
 */
import { Icon } from '@blockera/icons';
import type { InnerBlocks } from '@blockera/editor/js/extensions/libs/inner-blocks/types';

const paragraph: InnerBlocks = {
	'core/paragraph': {
		name: 'core/paragraph',
		label: __('Paragraphs', 'blockera'),
		icon: <Icon icon="block-paragraph" iconSize="20" />,
		settings: {
			force: true,
		},
	},
};

export default paragraph;
