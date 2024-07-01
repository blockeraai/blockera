//@flow

export type GapProps = {
	/**
	 * Sets the gaps (gutters) between rows and columns.
	 * It is a shorthand for `rowGap` and `columnGap`.
	 */
	gap?: string | number,
	/**
	 * Sets the size of the gap (gutter) between grid columns.
	 */
	columnGap?: string,
	/**
	 * Sets the size of the gap (gutter) between grid rows.
	 */
	rowGap?: string | number,
	/**
	 * It is a shorthand property for defining grid columns, grid rows,
	 * and grid areas.
	 */
	gridTemplate?: string,
	/**
	 * Defines the line names and track sizing functions of the grid columns.
	 */
	gridTemplateColumns?: string,
	/**
	 * Defines the line names and track sizing functions of the grid rows.
	 */
	gridTemplateRows?: string,
	/**
	 * Sets the distribution of space between and around content items along a grid's block axis.
	 */
	alignContent?: GridAlignContent,
	/**
	 * Sets the align-self value on all direct children as a group.
	 * In Grid Layout, it controls the alignment of items on the Block Axis within their grid area.
	 */
	alignItems?: GridAlignItems,
	/**
	 * Defines the default justify-self for all items of the box,
	 * giving them all a default way of justifying each box along the appropriate axis..
	 */
	justifyItems?: GridJustifyItems,
	/**
	 * Sets the distribution of space between and around content items along a grid's inline axis.
	 */
	justifyContent?: GridJustifyContent,
	children?: any,
	style?: Object,
	className?: string,
};

export type GridAlignContent =
	| ''
	| 'center'
	| 'stretch'
	| 'space-evenly'
	| 'space-around'
	| 'space-between';

export type GridAlignItems =
	| ''
	| 'end'
	| 'start'
	| 'center'
	| 'stretch'
	| 'baseline';

export type GridJustifyItems = '' | 'start' | 'center' | 'end' | 'stretch';

export type GridJustifyContent =
	| ''
	| 'start'
	| 'center'
	| 'end'
	| 'space-evenly'
	| 'space-around'
	| 'space-between'
	| 'stretch';
