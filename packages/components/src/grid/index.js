/**
 * External dependencies
 */
import PropTypes from 'prop-types';

/**
 * Internal dependencies
 */
import { componentClassNames } from '@publisher/classnames';

export default function Grid({
	gap,
	columnGap,
	rowGap,
	gridTemplateColumns,
	gridTemplateRows,
	gridTemplate,
	alignContent,
	justifyContent,
	alignItems,
	justifyItems,
	children,
	className,
	style,
	...props
}) {
	return (
		<div
			style={{
				columnGap,
				rowGap,
				gap, // gap should be after row and column gap!
				gridTemplate,
				gridTemplateColumns,
				gridTemplateRows,
				alignContent,
				justifyContent,
				alignItems,
				justifyItems,
				...style,
			}}
			{...props}
			className={componentClassNames('grid', className)}
		>
			{children}
		</div>
	);
}

Grid.propTypes = {
	/**
	 * Sets the gaps (gutters) between rows and columns. It is a shorthand for `rowGap` and `columnGap`.
	 */
	gap: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
	/**
	 * Sets the size of the gap (gutter) between grid columns.
	 */
	columnGap: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
	/**
	 * Sets the size of the gap (gutter) between grid rows.
	 */
	rowGap: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
	/**
	 * It is a shorthand property for defining grid columns, grid rows, and grid areas.
	 */
	gridTemplate: PropTypes.string,
	/**
	 * Defines the line names and track sizing functions of the grid columns.
	 */
	gridTemplateColumns: PropTypes.string,
	/**
	 * Defines the line names and track sizing functions of the grid rows.
	 */
	gridTemplateRows: PropTypes.string,
	/**
	 * Sets the distribution of space between and around content items along a grid's block axis.
	 */
	alignContent: PropTypes.oneOf([
		'center',
		'space-between',
		'space-around',
		'space-evenly',
		'stretch',
	]),
	/**
	 * Defines how the browser distributes space between and around content items along the inline axis of a grid container.
	 */
	justifyContent: PropTypes.oneOf([
		'start',
		'center',
		'end',
		'space-between',
		'space-around',
		'space-evenly',
	]),
	/**
	 * Sets the align-self value on all direct children as a group. In Grid Layout, it controls the alignment of items on the Block Axis within their grid area.
	 */
	alignItems: PropTypes.oneOf([
		'start',
		'center',
		'end',
		'stretch',
		'baseline',
	]),
	/**
	 * Defines the default justify-self for all items of the box, giving them all a default way of justifying each box along the appropriate axis..
	 */
	justifyItems: PropTypes.oneOf(['start', 'center', 'end', 'stretch']),
};

Grid.defaultProps = {
	gap: '',
	columnGap: '',
	rowGap: '',
	gridTemplate: '',
	gridTemplateColumns: '',
	gridTemplateRows: '',
	alignContent: '',
	justifyContent: '',
	alignItems: '',
	justifyItems: '',
};
