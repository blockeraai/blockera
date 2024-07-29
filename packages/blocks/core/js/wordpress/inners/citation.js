// @flow

/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import type { MixedElement } from 'react';

/**
 * Blockera dependencies
 */
import type { InnerBlocks } from '@blockera/editor/js/extensions/libs/inner-blocks/types';
import { Icon } from '@blockera/icons';

const citation: InnerBlocks = {
	'elements/citation': {
		name: 'elements/citation',
		label: __('Citation', 'blockera'),
		icon: <Icon icon="verse" library="wp" iconSize="20" />,
		settings: {
			force: true,
		},
	},
};

export default citation;
