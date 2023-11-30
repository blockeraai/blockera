// @flow
/**
 * External dependencies
 */
import PropTypes from 'prop-types';
import type { MixedElement } from 'react';

/**
 * Publisher dependencies
 */
import { controlClassNames } from '@publisher/classnames';

/**
 * Internal dependencies
 */
import { useControlContext } from '../../context';
import { BaseControl } from './../index';
import type { TTextAreaItem } from './types';

export default function TextAreaControl({
	id,
	label,
	columns,
	defaultValue = '',
	onChange,
	field,
	className,
	disabled = false,
	height = 55,
	...props
}: TTextAreaItem): MixedElement {
	const { value, setValue } = useControlContext({
		id,
		defaultValue,
		onChange,
	});

	function onKeyUp(e: Object): void {
		e.target.style.height = `${Math.max(
			e.target.scrollHeight,
			height + 10
		)}px`;
	}

	return (
		<BaseControl
			label={label}
			columns={columns}
			controlName={field}
			className={className}
		>
			<textarea
				value={value}
				disabled={disabled}
				className={controlClassNames('textarea', className)}
				style={{ height: height + 10 + 'px' }}
				{...props}
				onChange={(e) => setValue(e.target.value)}
				onKeyUp={onKeyUp}
				{...props}
			/>
		</BaseControl>
	);
}

TextAreaControl.propTypes = {
	/**
	 * ID for retrieving value from control context
	 */
	id: PropTypes.string,
	/**
	 * It sets the control default value if the value not provided. By using it the control will not fire onChange event for this default value on control first render,
	 */
	defaultValue: PropTypes.string,
	/**
	 * Function that will be fired while the control value state changes.
	 */
	onChange: PropTypes.func,
	/**
	 * By using this you can disable the control.
	 */
	disabled: PropTypes.bool,
	/**
	 * Textarea custom height
	 */
	height: PropTypes.number,
};

TextAreaControl.defaultProps = {
	field: 'textarea',
	defaultValue: '',
};
