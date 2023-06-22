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
	alignContent,
	justifyContent,
	alignItems,
	justifyItems,
	gridTemplateColumns,
	children,
	className,
	style,
	...props
}) {
	return (
		<div
			style={{
				display: 'grid',
				alignContent,
				justifyContent,
				alignItems,
				justifyItems,
				columnGap,
				rowGap,
				gap, // gap should be after row and column gap!
				gridTemplateColumns,
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
	gap: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
	columnGap: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
	rowGap: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
	alignContent: PropTypes.oneOf([
		'center',
		'space-between',
		'space-around',
		'space-evenly',
		'stretch',
	]),
	justifyContent: PropTypes.oneOf([
		'flex-start',
		'center',
		'flex-end',
		'space-between',
		'space-around',
		'space-evenly',
	]),
	alignItems: PropTypes.oneOf([
		'flex-start',
		'center',
		'flex-end',
		'stretch',
		'baseline',
	]),
	justifyItems: PropTypes.oneOf([
		'flex-start',
		'center',
		'flex-end',
		'stretch',
	]),
	gridTemplateColumns: PropTypes.string,
	className: PropTypes.string,
	children: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
	style: PropTypes.object,
};

Grid.defaultProps = {
	gap: '',
	columnGap: '',
	rowGap: '',
	alignContent: '',
	justifyContent: '',
	alignItems: '',
	justifyItems: '',
	gridTemplateColumns: '',
	className: '',
	style: {},
};
