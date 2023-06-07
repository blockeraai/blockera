/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';
import { rotateLeft, rotateRight } from '@wordpress/icons';
import { AnglePickerControl as WordPressAnglePickerControl } from '@wordpress/components';

/**
 * Publisher dependencies
 */
import {
	controlClassNames,
	controlInnerClassNames,
} from '@publisher/classnames';
import { Button, HStack } from '@publisher/components';

/**
 * Internal dependencies
 */
import './style.scss';

export default function AnglePickerControl({
	initValue = 0,
	//
	value,
	//
	className,
	onValueChange = (newValue) => {
		return newValue;
	},
	...props
}) {
	const [controlValue, setControlValue] = useState(value || initValue);

	function addAngle(angle, value) {
		// Add the value to the angle
		let result = angle + value;

		// Normalize the result within the range of 0 to 360
		if (result > 360) {
			result %= 360;
		} else if (result < 0) {
			result = 360 - (Math.abs(result) % 360);
		}

		return result;
	}

	function subtractAngle(angle, value) {
		// Subtract the value from the angle
		let result = angle - value;

		// Normalize the result within the range of 0 to 359
		if (result < 0) {
			result = 360 - (Math.abs(result) % 360);
		} else if (result > 360) {
			result %= 360;
		}

		return result;
	}

	return (
		<HStack className={controlClassNames('angle', className)}>
			<WordPressAnglePickerControl
				{...props}
				value={controlValue}
				onChange={(newValue) => {
					setControlValue(newValue);
					onValueChange(newValue);
					return newValue;
				}}
				label=""
				__nextHasNoMarginBottom
			/>

			<Button
				className={controlInnerClassNames('btn-rotate-left')}
				showTooltip={true}
				label={__('Rotate Left', 'publisher')}
				icon={rotateLeft}
				onClick={() => {
					const newValue = subtractAngle(controlValue, 45);

					setControlValue(newValue);
					onValueChange(newValue);
				}}
			/>

			<Button
				className={controlInnerClassNames('btn-rotate-right')}
				showTooltip={true}
				label={__('Rotate Right', 'publisher')}
				icon={rotateRight}
				onClick={() => {
					const newValue = addAngle(controlValue, 45);

					setControlValue(newValue);
					onValueChange(newValue);
				}}
			/>
		</HStack>
	);
}
