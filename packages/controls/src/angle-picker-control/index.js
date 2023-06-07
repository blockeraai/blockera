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
	onValueChange = () => {},
	...props
}) {
	const [angel, setAngel] = useState(value || initValue);

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
				value={angel}
				onChange={(_angle) => {
					setAngel(_angle);
					onValueChange(_angle);
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
					const _angel = subtractAngle(angel, 45);

					setAngel(_angel);
					onValueChange(_angel);
				}}
			/>
			<Button
				className={controlInnerClassNames('btn-rotate-right')}
				showTooltip={true}
				label={__('Rotate Right', 'publisher')}
				icon={rotateRight}
				onClick={() => {
					const _angel = addAngle(angel, 45);

					setAngel(_angel);
					onValueChange(_angel);
				}}
			/>
		</HStack>
	);
}
