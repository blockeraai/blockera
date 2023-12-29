// @flow
/**
 * External dependencies
 */
import PropTypes from 'prop-types';
import type { MixedElement } from 'react';
import { ToggleControl as WPToggleControl } from '@wordpress/components';

/**
 * Publisher dependencies
 */
import { controlClassNames } from '@publisher/classnames';

/**
 * Internal dependencies
 */
import type { TToggleControlProps } from './types/toggle-control-props';
import { useControlContext } from '../../context';
import { BaseControl } from '../index';

export default function ToggleControl({
	id,
	label,
	labelPopoverTitle,
	labelDescription,
	repeaterItem,
	singularId,
	defaultValue,
	field = 'toggle',
	columns,
	onChange,
	className,
	...props
}: TToggleControlProps): MixedElement {
	const {
		value,
		setValue,
		attribute,
		blockName,
		resetToDefault,
		getControlPath,
	} = useControlContext({
		id,
		defaultValue,
		onChange,
	});

	const labelProps = {
		value,
		singularId,
		attribute,
		blockName,
		label,
		labelPopoverTitle,
		labelDescription,
		repeaterItem,
		defaultValue,
		resetToDefault,
		mode: 'advanced',
		path: getControlPath(attribute, id),
	};

	return (
		<BaseControl
			columns={columns}
			controlName={field}
			className={className}
			{...labelProps}
		>
			<WPToggleControl
				label={label}
				checked={value}
				onChange={setValue}
				className={controlClassNames('toggle', className)}
				{...props}
			/>
		</BaseControl>
	);
}

ToggleControl.propTypes = {
	/**
	 * It sets the control default value if the value not provided. By using it the control will not fire onChange event for this default value on control first render,
	 */
	defaultValue: PropTypes.bool,
	/**
	 * The current value.
	 */
	value: PropTypes.bool,
	/**
	 * Function that will be fired while the control value state changes.
	 */
	onChange: PropTypes.func,
	/**
	 * Label after toggle
	 */
	label: PropTypes.string,
};
