// @flow

/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import type { MixedElement } from 'react';

/**
 * Blockera dependencies
 */
import {
	SharedBlockExtension,
	sharedBlockExtensionSupports,
	sharedBlockExtensionAttributes,
} from '@blockera/editor';
import type { InnerBlocks } from '@blockera/editor/js/extensions/libs/inner-blocks/types';
import { Icon } from '@blockera/icons';

const blockeraInnerBlocks: InnerBlocks = {
	'elements/caption': {
		name: 'elements/caption',
		label: __('Caption', 'blockera'),
		icon: <Icon icon="block-image-caption" iconSize="20" />,
		settings: {
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
