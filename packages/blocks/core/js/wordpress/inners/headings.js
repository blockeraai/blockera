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

const headings: InnerBlocks = {
	'core/heading': {
		name: 'core/heading',
		label: __('Headings', 'blockera'),
		icon: <Icon icon="heading" library="wp" iconSize="20" />,
		settings: {
			// because "core/heading" block default value for "level" attribute is "2".
			level: 2,
			force: true,
			dataCompatibility: [
				'font-color',
				'background-color',
				'background-image',
			],
		},
	},
	'core/heading-1': {
		name: 'core/heading',
		label: __('H1s', 'blockera'),
		icon: <Icon icon="heading-level-1" library="wp" iconSize="20" />,
		settings: {
			level: 1,
			force: false,
			dataCompatibility: [
				'font-color',
				'background-color',
				'background-image',
			],
		},
	},
	'core/heading-2': {
		name: 'core/heading',
		label: __('H2s', 'blockera'),
		icon: <Icon icon="heading-level-2" library="wp" iconSize="20" />,
		settings: {
			level: 2,
			force: false,
			dataCompatibility: [
				'font-color',
				'background-color',
				'background-image',
			],
		},
	},
	'core/heading-3': {
		name: 'core/heading',
		label: __('H3s', 'blockera'),
		icon: <Icon icon="heading-level-3" library="wp" iconSize="20" />,
		settings: {
			level: 3,
			force: false,
			dataCompatibility: [
				'font-color',
				'background-color',
				'background-image',
			],
		},
	},
	'core/heading-4': {
		name: 'core/heading',
		label: __('H4s', 'blockera'),
		icon: <Icon icon="heading-level-4" library="wp" iconSize="20" />,
		settings: {
			level: 4,
			force: false,
			dataCompatibility: [
				'font-color',
				'background-color',
				'background-image',
			],
		},
	},
	'core/heading-5': {
		name: 'core/heading',
		label: __('H5s', 'blockera'),
		icon: <Icon icon="heading-level-5" library="wp" iconSize="20" />,
		settings: {
			level: 5,
			force: false,
			dataCompatibility: [
				'font-color',
				'background-color',
				'background-image',
			],
		},
	},
	'core/heading-6': {
		name: 'core/heading',
		label: __('H6s', 'blockera'),
		icon: <Icon icon="heading-level-6" library="wp" iconSize="20" />,
		settings: {
			level: 6,
			force: false,
			dataCompatibility: [
				'font-color',
				'background-color',
				'background-image',
			],
		},
	},
};

export default headings;
