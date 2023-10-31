// @flow
/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import { SearchControl as WPSearchControl } from '@wordpress/components';
import PropTypes from 'prop-types';
import type { MixedElement } from 'react';
/**
 * Publisher dependencies
 */
import { controlClassNames } from '@publisher/classnames';

/**
 * Internal dependencies
 */
import type { TSearchControlProps } from './types/control-types';
import { BaseControl } from '../index';
import { useControlContext } from '../../context';

export default function SearchControl({
	id,
	label,
	columns,
	defaultValue,
	onChange,
	field,
	//
	className,
	...props
}: TSearchControlProps): MixedElement {
	const { value, setValue } = useControlContext({
		id,
		onChange,
		defaultValue,
	});

	return (
		<BaseControl
			label={label}
			columns={columns}
			controlName={field}
			className={className}
		>
			<WPSearchControl
				value={value}
				onChange={setValue}
				className={controlClassNames('search', className)}
				{...props}
			/>
		</BaseControl>
	);
}

SearchControl.propTypes = {
	/**
	 * ID for retrieving value from control context
	 */
	id: PropTypes.string,
	/**
	 * Label for field. If you pass empty value the field will not be added and simple control will be rendered
	 *
	 * @default ""
	 */
	label: PropTypes.string,
	/**
	 * Field id for passing into child Field component
	 *
	 * @default "toggle-select"
	 */
	field: PropTypes.string,
	/**
	 * Columns setting for Field grid.
	 *
	 * @default "columns-2"
	 */
	columns: PropTypes.string,
	/**
	 * It sets the control default value if the value not provided. By using it the control will not fire onChange event for this default value on control first render,
	 */
	defaultValue: PropTypes.string,
	/**
	 * Function that will be fired while the control value state changes.
	 */
	onChange: PropTypes.func,
	/**
	 * A placeholder for the input.
	 */
	placeholder: PropTypes.string,
};

SearchControl.defaultProps = {
	// $FlowFixMe
	placeholder: __('Search…', 'publisher-core'),
	defaultValue: '',
	field: 'search',
};
