// @flow

/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import type { MixedElement } from 'react';

/**
 * Blockera dependencies
 */
import { SharedBlockExtension } from '@blockera/editor';
import type { InnerBlocks } from '@blockera/editor/js/extensions/libs/inner-blocks/types';
import { Icon } from '@blockera/icons';

const blockeraInnerBlocks: InnerBlocks = {
	caption: {
		name: 'core/caption',
		type: 'caption',
		label: __('Caption', 'blockera'),
		icon: <Icon icon="block-image-caption" iconSize="20" />,
		selectors: {
			root: 'figcaption',
		},
		innerBlockSettings: {
			force: true,
		},
	},
};

export const Image = {
	name: 'blockeraImage',
	targetBlock: 'core/image',
	blockeraInnerBlocks,
	edit: (props: Object): MixedElement => {
		return <SharedBlockExtension {...props} />;
	},
};
