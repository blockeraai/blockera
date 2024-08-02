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

const sharedInnerBlocks: InnerBlocks = {
	'core/paragraph': {
		name: 'core/paragraph',
		label: __('Paragraph', 'blockera'),
		icon: <Icon icon="paragraph" library="wp" iconSize="20" />,
		settings: {
			force: true,
		},
	},
	// Compatibility tests: ../group/test/link.cy.e2e.inner-blocks-compatibility.js
	'elements/link': {
		name: 'elements/link',
		label: __('Link', 'blockera'),
		icon: <Icon icon="link" library="wp" iconSize="20" />,
		settings: {
			force: true,
			dataCompatibilityElement: 'link',
			dataCompatibility: ['font-color', 'font-color-hover'],
		},
	},
	// Compatibility tests: ../group/test/headings.cy.e2e.inner-blocks-compatibility.js
	'core/heading': {
		name: 'core/heading',
		label: __('Heading', 'blockera'),
		icon: <Icon icon="heading" library="wp" iconSize="20" />,
		settings: {
			// because "core/heading" block default value for "level" attribute is "2".
			level: 2,
			force: true,
			dataCompatibilityElement: 'heading',
			dataCompatibility: [
				'font-color',
				'background-color',
				'background-image',
			],
		},
	},
	// Compatibility tests: ../group/test/headings.cy.e2e.inner-blocks-compatibility.js
	'core/heading-1': {
		name: 'core/heading',
		label: __('Heading: H1', 'blockera'),
		icon: <Icon icon="heading-level-1" library="wp" iconSize="20" />,
		settings: {
			level: 1,
			force: false,
			dataCompatibilityElement: 'h1',
			dataCompatibility: [
				'font-color',
				'background-color',
				'background-image',
			],
		},
	},
	// Compatibility tests: ../group/test/headings.cy.e2e.inner-blocks-compatibility.js
	'core/heading-2': {
		name: 'core/heading',
		label: __('Heading: H2', 'blockera'),
		icon: <Icon icon="heading-level-2" library="wp" iconSize="20" />,
		settings: {
			level: 2,
			force: false,
			dataCompatibilityElement: 'h2',
			dataCompatibility: [
				'font-color',
				'background-color',
				'background-image',
			],
		},
	},
	// Compatibility tests: ../group/test/headings.cy.e2e.inner-blocks-compatibility.js
	'core/heading-3': {
		name: 'core/heading',
		label: __('Heading: H3', 'blockera'),
		icon: <Icon icon="heading-level-3" library="wp" iconSize="20" />,
		settings: {
			level: 3,
			force: false,
			dataCompatibilityElement: 'h3',
			dataCompatibility: [
				'font-color',
				'background-color',
				'background-image',
			],
		},
	},
	// Compatibility tests: ../group/test/headings.cy.e2e.inner-blocks-compatibility.js
	'core/heading-4': {
		name: 'core/heading',
		label: __('Heading: H4', 'blockera'),
		icon: <Icon icon="heading-level-4" library="wp" iconSize="20" />,
		settings: {
			level: 4,
			force: false,
			dataCompatibilityElement: 'h4',
			dataCompatibility: [
				'font-color',
				'background-color',
				'background-image',
			],
		},
	},
	// Compatibility tests: ../group/test/headings.cy.e2e.inner-blocks-compatibility.js
	'core/heading-5': {
		name: 'core/heading',
		label: __('Heading: H5', 'blockera'),
		icon: <Icon icon="heading-level-5" library="wp" iconSize="20" />,
		settings: {
			level: 5,
			force: false,
			dataCompatibilityElement: 'h5',
			dataCompatibility: [
				'font-color',
				'background-color',
				'background-image',
			],
		},
	},
	// Compatibility tests: ../group/test/headings.cy.e2e.inner-blocks-compatibility.js
	'core/heading-6': {
		name: 'core/heading',
		label: __('Heading: H6', 'blockera'),
		icon: <Icon icon="heading-level-6" library="wp" iconSize="20" />,
		settings: {
			level: 6,
			force: false,
			dataCompatibilityElement: 'h6',
			dataCompatibility: [
				'font-color',
				'background-color',
				'background-image',
			],
		},
	},
	// Compatibility tests: ../group/test/button.cy.e2e.inner-blocks-compatibility.js
	// Functionality tests: ../buttons/test/block.cy.e2e.inner-blocks.js
	'core/button': {
		name: 'core/button',
		label: __('Button', 'blockera'),
		icon: <Icon icon="button" library="wp" iconSize="20" />,
		settings: {
			force: true,
			dataCompatibilityElement: 'button',
			dataCompatibility: [
				'font-color',
				'background-color',
				'background-image',
			],
		},
	},
};

export default sharedInnerBlocks;
