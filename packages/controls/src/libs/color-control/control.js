// @flow
/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';

/**
 * Publisher dependencies
 */
import { controlClassNames } from '@publisher/classnames';
import { ColorIndicator, Button } from '@publisher/components';

/**
 * Internal dependencies
 */
import { BaseControl, ColorPickerControl } from '../index';
import PropTypes from 'prop-types';
import { useControlContext } from '../../context';
import type { MixedElement } from 'react';
import type { Props } from './types';

export default function ColorControl({
	type = 'normal',
	noBorder,
	contentAlign,
	//
	id,
	label,
	columns,
	defaultValue,
	onChange,
	field,
	//
	//
	className,
	style,
	...props
}: Props): MixedElement {
	const { value, setValue } = useControlContext({
		id,
		onChange,
		defaultValue,
	});

	const [isOpen, setOpen] = useState(false);

	let buttonLabel: MixedElement;

	if (type === 'normal') {
		buttonLabel = value ? (
			<span className="color-label" data-cy="color-label">
				{value}
			</span>
		) : (
			<span className="color-label" data-cy="color-label">
				{__('None', 'publisher-core')}
			</span>
		);
	}

	return (
		<BaseControl
			label={label}
			columns={columns}
			controlName={field}
			className={className}
		>
			<Button
				size="input"
				className={controlClassNames(
					'color',
					'color-type-' + type,
					value ? 'is-not-empty' : 'is-empty',
					className
				)}
				noBorder={noBorder || type === 'minimal'}
				isFocus={isOpen}
				contentAlign={type === 'minimal' ? 'center' : contentAlign}
				onClick={() => setOpen(!isOpen)}
				style={{
					...style,
					'--publisher-controls-primary-color': value,
				}}
				data-cy="color-btn"
				{...props}
			>
				<ColorIndicator
					type="color"
					value={value}
					data-cy="color-indicator"
				/>

				{buttonLabel}
			</Button>

			{isOpen && (
				<ColorPickerControl
					id={id}
					isPopover={true}
					isOpen={isOpen}
					onClose={() => setOpen(false)}
					onChange={setValue}
					value={value}
					{...props}
				/>
			)}
		</BaseControl>
	);
}

ColorControl.propTypes = {
	/**
	 * By using this you can prevent the control to show the border and outline shape.
	 */
	noBorder: PropTypes.bool,
	/**
	 * Type of CSS units from presets
	 */
	type: (PropTypes.oneOf(['normal', 'minimal']): any),
	/**
	 * It is useful for buttons with specified width and allows you to align the content to `left` or `right`. By default, it's `center` and handled by flex justify-content property.
	 */
	contentAlign: (PropTypes.oneOf(['left', 'center', 'right']): any),
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
};

ColorControl.defaultProps = {
	type: 'normal',
	contentAlign: 'left',
	field: 'color',
};
