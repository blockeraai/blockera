/**
 * External dependencies
 */
import PropTypes from 'prop-types';

/**
 * Internal dependencies
 */
import { componentClassNames } from '@publisher/classnames';

export default function Flex({
	direction,
	gap,
	justifyContent,
	alignItems,
	flexWrap,
	children,
	className,
	style,
	...props
}) {
	return (
		<div
			style={{
				flexDirection: direction,
				justifyContent,
				gap,
				alignItems,
				flexWrap,
				...style,
			}}
			{...props}
			className={componentClassNames('flex', className)}
		>
			{children}
		</div>
	);
}

Flex.propTypes = {
	/**
	 * The flex-direction sets how flex items are placed in the flex container defining the main axis and the direction (normal or reversed).
	 */
	direction: PropTypes.oneOf([
		'column',
		'column-reverse',
		'row',
		'row-reverse',
	]),
	/**
	 * The amount of space between each child element. Spacing in between each child can be adjusted by using `gap`. You can use px or all other css units.
	 *
	 * @default 10px
	 */
	gap: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
	/**
	 * The justify-content defines how the browser distributes space between and around content items along the main-axis of a flex container, and the inline axis of a grid container.
	 */
	justifyContent: PropTypes.oneOf([
		'flex-start',
		'center',
		'flex-end',
		'space-between',
		'space-around',
		'space-evenly',
	]),
	/**
	 * The justify-items defines the default justify-self for all items of the box, giving them all a default way of justifying each box along the appropriate axis.
	 */
	alignItems: PropTypes.oneOf([
		'flex-start',
		'center',
		'flex-end',
		'stretch',
	]),
	/**
	 * The flex-wrap sets whether flex items are forced onto one line or can wrap onto multiple lines. If wrapping is allowed, it sets the direction that lines are stacked.
	 */
	flexWrap: PropTypes.oneOf(['nowrap', 'wrap']),
	className: PropTypes.string,
};

Flex.defaultProps = {
	direction: 'row',
	className: '',
};
