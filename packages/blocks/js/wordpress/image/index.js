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
} from '@blockera/editor-extensions/js/libs';
import type { InnerBlocks } from '@blockera/editor-extensions/js/libs/inner-blocks/types';

/**
 * Internal dependencies
 */
import { InnerBlockImageCaptionIcon } from './icons/inner-block-image-caption';

const attributes = sharedBlockExtensionAttributes;

const supports = sharedBlockExtensionSupports;

const blockeraInnerBlocks: InnerBlocks = {
	caption: {
		name: 'core/caption',
		type: 'caption',
		label: __('Caption', 'blockera'),
		icon: <InnerBlockImageCaptionIcon />,
		selectors: {
			root: 'figcaption',
		},
		attributes,
		innerBlockSettings: {
			force: true,
		},
	},
};

export const Image = {
	name: 'blockeraImage',
	targetBlock: 'core/image',
	attributes,
	supports,
	blockeraInnerBlocks,
	edit: (props: Object): MixedElement => {
		return <SharedBlockExtension {...props} />;
	},
};
