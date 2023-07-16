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
import { useValue } from '@publisher/utils';

/**
 * Internal dependencies
 */
import { addAngle, subtractAngle } from './utils';
import { default as RotateLeftIcon } from './icons/rotate-left';
import { default as RotateRightIcon } from './icons/rotate-right';

export default function AnglePickerControl({
	defaultValue,
	value: initialValue,
	onChange,
	rotateButtons,
	//
	className,
	...props
}) {
	const { value, setValue } = useValue({
		initialValue,
		defaultValue,
		onChange,
	});

	return (
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
					return newValue;
				}}
				label=""
				__nextHasNoMarginBottom
			/>

			{rotateButtons && (
				<>
					<Button
						className={controlInnerClassNames('btn-rotate-left')}
						showTooltip={true}
						label={__('Rotate Left', 'publisher')}
						icon={<RotateLeftIcon />}
						onClick={() => {
							setValue(subtractAngle(value, 45));
						}}
					/>
					<Button
						className={controlInnerClassNames('btn-rotate-right')}
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
	);
}

AnglePickerControl.propTypes = {
	/**
	 * It sets the control default value if the value not provided. By using it the control will not fire onChange event for this default value on control first render,
	 */
	defaultValue: PropTypes.string,
	/**
	 * The current value.
	 */
	value: PropTypes.string,
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
};
