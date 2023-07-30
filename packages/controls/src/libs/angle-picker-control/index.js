/**
 * External dependencies
 */
import PropTypes from 'prop-types';
import { __ } from '@wordpress/i18n';
import { AnglePickerControl as WordPressAnglePickerControl } from '@wordpress/components';

/**
 * Publisher dependencies
 */
import {
	controlClassNames,
	controlInnerClassNames,
} from '@publisher/classnames';
import { Button, Flex } from '@publisher/components';
import { Field } from '@publisher/fields';

/**
 * Internal dependencies
 */
import { useControlContext } from '../../context';
import { addAngle, subtractAngle } from './utils';
import { default as RotateLeftIcon } from './icons/rotate-left';
import { default as RotateRightIcon } from './icons/rotate-right';

export default function AnglePickerControl({
	rotateButtons,
	//
	id,
	label,
	columns,
	defaultValue,
	onChange,
	field,
	//
	className,
	...props
}) {
	const { value, setValue } = useControlContext({
		id,
		onChange,
		defaultValue,
	});

	return (
		<Field
			label={label}
			field={field}
			columns={columns}
			className={className}
		>
			<Flex
				direction="row"
				alignItems="center"
				className={controlClassNames('angle', className)}
			>
				<WordPressAnglePickerControl
					{...props}
					value={value}
					onChange={(newValue) => {
						setValue(newValue);
					}}
					label=""
					__nextHasNoMarginBottom
				/>

				{rotateButtons && (
					<>
						<Button
							className={controlInnerClassNames(
								'btn-rotate-left'
							)}
							showTooltip={true}
							label={__('Rotate Left', 'publisher')}
							icon={<RotateLeftIcon />}
							onClick={() => {
								setValue(subtractAngle(value, 45));
							}}
						/>
						<Button
							className={controlInnerClassNames(
								'btn-rotate-right'
							)}
							showTooltip={true}
							label={__('Rotate Right', 'publisher')}
							icon={<RotateRightIcon />}
							onClick={() => {
								setValue(addAngle(value, 45));
							}}
						/>
					</>
				)}
			</Flex>
		</Field>
	);
}

AnglePickerControl.propTypes = {
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
	 * It sets the control default value if the value not provided. By using it the control will not fire onChange event for this default value on control first render.
	 */
	defaultValue: PropTypes.string,
	/**
	 * Function that will be fired while the control value state changes.
	 */
	onChange: PropTypes.func,
	/**
	 * Sets the rotate buttons to be available or not.
	 */
	rotateButtons: PropTypes.bool,
};

AnglePickerControl.defaultProps = {
	defaultValue: 0,
	rotateButtons: true,
	field: 'angle-picker',
};
