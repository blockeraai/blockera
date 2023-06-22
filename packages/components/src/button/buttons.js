/**
 * External dependencies
 */
import { PropTypes } from 'prop-types';

/**
 * Publisher dependencies
 */
import { componentClassNames } from '@publisher/classnames';

/**
 * Internal dependencies
 */
import { Flex } from '../index';

export default function Buttons({
	direction,
	gap,
	justifyContent,
	alignItems,
	className,
	children,
	...props
}) {
	return (
		<Flex
			gap={gap}
			direction={direction}
			alignItems={alignItems}
			className={componentClassNames('buttons', className)}
			{...props}
		>
			{children}
		</Flex>
	);
}

Buttons.propTypes = {
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
	children: PropTypes.element,
};

Buttons.defaultProps = {
	direction: 'row',
	gap: '8px',
	justifyContent: '',
	alignItems: '',
	className: '',
};
