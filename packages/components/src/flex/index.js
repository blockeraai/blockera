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
	children,
	className,
	style,
	...props
}) {
	return (
		<div
			style={{
				display: 'flex',
				flexDirection: direction,
				justifyContent,
				gap,
				alignItems,
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
	direction: PropTypes.oneOf([
		'column',
		'column-reverse',
		'row',
		'row-reverse',
	]),
	gap: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
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
	]),
	className: PropTypes.string,
	children: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
	style: PropTypes.object,
};

Flex.defaultProps = {
	direction: 'column',
	gap: '8px',
	justifyContent: '',
	alignItems: '',
	className: '',
	style: {},
};
