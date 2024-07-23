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
	'elements/item-icon': {
		name: 'elements/item-icon',
		label: __('Button Icon', 'blockera'),
		icon: <Icon icon="block-social-link-icon" iconSize="20" />,
		settings: {
			force: true,
		},
	},
	'elements/item-name': {
		name: 'elements/item-name',
		label: __('Button Name', 'blockera'),
		icon: <Icon icon="block-social-link-name" iconSize="20" />,
		settings: {
			force: true,
		},
	},
};

export const SocialLink = {
	name: 'blockeraSocialLink',
	targetBlock: 'core/social-link',
	blockeraInnerBlocks,
	edit: (props: Object): MixedElement => {
		return <SharedBlockExtension {...props} />;
	},
};
