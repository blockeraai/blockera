// @flow

/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Blockera dependencies
 */
import { Icon } from '@blockera/icons';
import type { InnerBlocks } from '@blockera/editor/js/extensions/libs/block-card/inner-blocks/types';
import {
	generalInnerBlockStates,
	sharedBlockStates,
	generalSimpleInnerBlockStates,
} from '@blockera/editor';

const sharedInnerBlocks: InnerBlocks = {
	// Functionality tests: ../column/test/block.cy.e2e.inner-blocks.js
	'core/paragraph': {
		name: 'core/paragraph',
		label: __('Paragraphs', 'blockera'),
		description: __('All paragraph elements.', 'blockera'),
		icon: <Icon icon="paragraph" library="wp" iconSize="20" />,
		settings: {
			force: false,
			priority: 10,
		},
	},
	// Compatibility tests: ../group/test/link.cy.e2e.inner-blocks-compatibility.js
	// Functionality tests: ../column/test/block.cy.e2e.inner-blocks.js
	'elements/link': {
		name: 'elements/link',
		label: __('Links', 'blockera'),
		description: __('All hyperlinks elements.', 'blockera'),
		icon: <Icon icon="link" library="wp" iconSize="20" />,
		settings: {
			force: false,
			dataCompatibilityElement: 'link',
			dataCompatibility: ['font-color', 'font-color-hover'],
			priority: 10,
		},
		availableBlockStates: {
			...generalInnerBlockStates,
			focus: {
				...generalInnerBlockStates.focus,
				force: true,
			},
			active: {
				...sharedBlockStates.active,
				force: true,
			},
			visited: sharedBlockStates.visited,
		},
	},
	// Compatibility tests: ../group/test/headings.cy.e2e.inner-blocks-compatibility.js
	// Functionality tests: ../column/test/block.cy.e2e.inner-blocks.js
	'core/heading': {
		name: 'core/heading',
		label: __('Headings', 'blockera'),
		description: __('All heading tag elements.', 'blockera'),
		icon: <Icon icon="heading" library="wp" iconSize="20" />,
		settings: {
			// because "core/heading" block default value for "level" attribute is "2".
			level: 2,
			force: false,
			dataCompatibilityElement: 'heading',
			dataCompatibility: [
				'font-color',
				'background-color',
				'background-image',
			],
			priority: 10,
		},
		availableBlockStates: generalSimpleInnerBlockStates,
	},
	// Compatibility tests: ../group/test/headings.cy.e2e.inner-blocks-compatibility.js
	// Functionality tests: ../column/test/block.cy.e2e.inner-blocks.js
	'core/heading-1': {
		name: 'core/heading',
		label: __('Headings: H1', 'blockera'),
		description: __('All H1 heading tag elements.', 'blockera'),
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
			priority: 10,
		},
		availableBlockStates: generalSimpleInnerBlockStates,
	},
	// Compatibility tests: ../group/test/headings.cy.e2e.inner-blocks-compatibility.js
	// Functionality tests: ../column/test/block.cy.e2e.inner-blocks.js
	'core/heading-2': {
		name: 'core/heading',
		label: __('Headings: H2', 'blockera'),
		description: __('All H2 heading tag elements.', 'blockera'),
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
			priority: 10,
		},
		availableBlockStates: generalSimpleInnerBlockStates,
	},
	// Compatibility tests: ../group/test/headings.cy.e2e.inner-blocks-compatibility.js
	// Functionality tests: ../column/test/block.cy.e2e.inner-blocks.js
	'core/heading-3': {
		name: 'core/heading',
		label: __('Headings: H3', 'blockera'),
		description: __('All H3 heading tag elements.', 'blockera'),
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
			priority: 10,
		},
		availableBlockStates: generalSimpleInnerBlockStates,
	},
	// Compatibility tests: ../group/test/headings.cy.e2e.inner-blocks-compatibility.js
	// Functionality tests: ../column/test/block.cy.e2e.inner-blocks.js
	'core/heading-4': {
		name: 'core/heading',
		label: __('Headings: H4', 'blockera'),
		description: __('All H4 heading tag elements.', 'blockera'),
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
			priority: 10,
		},
		availableBlockStates: generalSimpleInnerBlockStates,
	},
	// Compatibility tests: ../group/test/headings.cy.e2e.inner-blocks-compatibility.js
	// Functionality tests: ../column/test/block.cy.e2e.inner-blocks.js
	'core/heading-5': {
		name: 'core/heading',
		label: __('Headings: H5', 'blockera'),
		description: __('All H5 heading tag elements.', 'blockera'),
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
			priority: 10,
		},
		availableBlockStates: generalSimpleInnerBlockStates,
	},
	// Compatibility tests: ../group/test/headings.cy.e2e.inner-blocks-compatibility.js
	// Functionality tests: ../column/test/block.cy.e2e.inner-blocks.js
	'core/heading-6': {
		name: 'core/heading',
		label: __('Headings: H6', 'blockera'),
		description: __('All H6 heading tag elements.', 'blockera'),
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
			priority: 10,
		},
		availableBlockStates: generalSimpleInnerBlockStates,
	},
	// Compatibility tests: ../group/test/button.cy.e2e.inner-blocks-compatibility.js
	// Functionality tests: ../buttons/test/block.cy.e2e.inner-blocks.js
	// Functionality tests: ../column/test/block.cy.e2e.inner-blocks.js
	'core/button': {
		name: 'core/button',
		label: __('Buttons', 'blockera'),
		description: __('All button-style link elements.', 'blockera'),
		icon: <Icon icon="button" library="wp" iconSize="20" />,
		settings: {
			force: false,
			dataCompatibilityElement: 'button',
			dataCompatibility: [
				'font-color',
				'background-color',
				'background-image',
			],
			priority: 10,
		},
		availableBlockStates: {
			...generalInnerBlockStates,
			focus: {
				...generalInnerBlockStates.focus,
				force: true,
			},
			active: {
				...sharedBlockStates.active,
				force: true,
			},
			visited: sharedBlockStates.visited,
		},
	},
	// Functionality tests: ../packages/gallery/test/block.inner-blocks.e2e.cy.js
	'core/image': {
		name: 'core/image',
		label: __('Images', 'blockera'),
		description: __('All images elements.', 'blockera'),
		icon: <Icon icon="image" library="wp" iconSize="20" />,
		settings: {
			force: false,
			priority: 10,
		},
		availableBlockStates: generalSimpleInnerBlockStates,
	},
	'elements/bold': {
		name: 'elements/bold',
		label: __('Bold', 'blockera'),
		description: __('All bold text (strong or b) tags.', 'blockera'),
		icon: <Icon icon="format-bold" library="wp" iconSize="20" />,
		availableBlockStates: generalSimpleInnerBlockStates,
	},
	'elements/italic': {
		name: 'elements/italic',
		label: __('Italic', 'blockera'),
		description: __('All italic text (em or i) tags.', 'blockera'),
		icon: <Icon icon="format-italic" library="wp" iconSize="20" />,
		availableBlockStates: generalSimpleInnerBlockStates,
	},
	'elements/kbd': {
		name: 'elements/kbd',
		label: __('Keyboard Inputs', 'blockera'),
		description: __('All keyboard input (kbd) tags.', 'blockera'),
		icon: <Icon icon="button" library="wp" iconSize="20" />,
		availableBlockStates: generalSimpleInnerBlockStates,
	},
	'elements/code': {
		name: 'elements/code',
		label: __('Code', 'blockera'),
		description: __('All code tags.', 'blockera'),
		icon: <Icon icon="code" library="wp" iconSize="20" />,
		availableBlockStates: generalSimpleInnerBlockStates,
	},
	'elements/span': {
		name: 'elements/span',
		label: __('Span', 'blockera'),
		description: __('All span tags.', 'blockera'),
		icon: <Icon icon="code" library="wp" iconSize="20" />,
		availableBlockStates: generalSimpleInnerBlockStates,
	},
	'elements/mark': {
		name: 'elements/mark',
		label: __('Highlight', 'blockera'),
		description: __('All highlighted text (mark) elements.', 'blockera'),
		icon: <Icon icon="color" library="wp" iconSize="20" />,
		availableBlockStates: generalSimpleInnerBlockStates,
	},
};

export default sharedInnerBlocks;
