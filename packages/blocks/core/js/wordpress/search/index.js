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

/**
 * Internal dependencies
 */
import inputs from '../inners/inputs';
import button from '../inners/button';

const attributes = sharedBlockExtensionAttributes;

const supports = sharedBlockExtensionSupports;

// We not needs to "input_label" in search block!
delete inputs?.input_label;
// We not needs to "remember" in search block!
delete inputs?.remember;

const blockeraInnerBlocks: InnerBlocks = {
	label: {
		name: 'core/title',
		type: 'title',
		label: __('Form Label', 'blockera'),
		icon: <Icon icon="block-paragraph" iconSize="20" />,
		attributes,
		settings: {
			force: true,
		},
	},
};

export const Search = {
	name: 'blockeraSearch',
	targetBlock: 'core/search',
	attributes,
	supports,
	blockeraInnerBlocks: {
		...blockeraInnerBlocks,
		...inputs,
		...button,
	},
	edit: (props: Object): MixedElement => {
		return <SharedBlockExtension {...props} />;
	},
};
