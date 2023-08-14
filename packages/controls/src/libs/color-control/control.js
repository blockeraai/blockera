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
import { Field } from '@publisher/fields';

/**
 * Internal dependencies
 */
import { ColorPickerControl } from '../index';
import PropTypes from 'prop-types';
import { useControlContext } from '../../context';

export default function ColorControl({
	type,
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
}) {
	const { value, setValue } = useControlContext({
		id,
		onChange,
		defaultValue,
	});

	const [isOpen, setOpen] = useState(false);

	let buttonLabel = '';

	if (type === 'normal') {
		buttonLabel = value ? (
			<span className="color-label">{value}</span>
		) : (
			<span className="color-label">{__('None', 'publisher-core')}</span>
		);
	}

	return (
		<Field
			label={label}
			field={field}
			columns={columns}
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
					'--publisher-controls-border-color-focus': value,
				}}
				{...props}
			>
				<ColorIndicator type="color" value={value} />

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
		</Field>
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
	type: PropTypes.oneOf(['normal', 'minimal']),
	/**
	 * It is useful for buttons with specified width and allows you to align the content to `left` or `right`. By default, it's `center` and handled by flex justify-content property.
	 */
	contentAlign: PropTypes.oneOf(['left', 'center', 'right']),
	/**
	 * ID for retrieving value from control context
	 */
	id: PropTypes.string.isRequired,
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
	defaultValue: '',
};
