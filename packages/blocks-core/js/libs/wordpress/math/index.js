// @flow
/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Blockera dependencies
 */
import { SharedBlockExtension } from '@blockera/editor';
import { Icon } from '@blockera/icons';

/**
 * Internal dependencies
 */
import sharedInnerBlocks from '../inners/shared';
import type { BlockType } from '../../../type';

export const Math: BlockType = {
	name: 'blockeraMath',
	targetBlock: 'core/math',
	blockeraInnerBlocks: {
		'elements/mi': {
			name: 'elements/mi',
			label: __('Variables', 'blockera'),
			description: __(
				'Represent variable names or identifiers like x, y, or sin.',
				'blockera'
			),
			icon: <Icon icon="block-math-mi" library="ui" iconSize="20" />,
			settings: {
				force: true,
			},
		},
		'elements/mn': {
			name: 'elements/mn',
			label: __('Numbers', 'blockera'),
			description: __(
				'Represent numeric values in formulas like 1, 2, 3, etc.',
				'blockera'
			),
			icon: <Icon icon="block-math-mn" library="ui" iconSize="20" />,
			settings: {
				force: true,
			},
		},
		'elements/mo': {
			name: 'elements/mo',
			label: __('Operators', 'blockera'),
			description: __(
				'Represent math symbols and operators such as +, -, x, Σ.',
				'blockera'
			),
			icon: <Icon icon="block-math-mo" library="ui" iconSize="20" />,
			settings: {
				force: true,
			},
		},
		'elements/mfrac': {
			name: 'elements/mfrac',
			label: __('Fractions', 'blockera'),
			description: __(
				'Represent fractions with numerator and denominator parts like 1/2, 3/4, etc.',
				'blockera'
			),
			icon: <Icon icon="block-math-mfrac" library="ui" iconSize="20" />,
			settings: {
				force: true,
			},
		},
		'elements/msup': {
			name: 'elements/msup',
			label: __('Superscripts', 'blockera'),
			description: __(
				'Represent raised elements like exponents (x², y³, etc.).',
				'blockera'
			),
			icon: <Icon icon="block-math-msup" library="ui" iconSize="20" />,
			settings: {
				force: true,
			},
		},
		'elements/msub': {
			name: 'elements/msub',
			label: __('Subscripts', 'blockera'),
			description: __(
				'Represent lowered elements like subscripts (a₁, b₂, etc.).',
				'blockera'
			),
			icon: <Icon icon="block-math-msub" library="ui" iconSize="20" />,
			settings: {
				force: true,
			},
		},
	},
	edit: (props) => {
		return <SharedBlockExtension {...props} />;
	},
};
