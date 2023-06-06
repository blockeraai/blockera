/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useContext, useState } from '@wordpress/element';
import { AnglePickerControl as WordPressAnglePickerControl } from '@wordpress/components';
import { rotateLeft, rotateRight } from '@wordpress/icons';

/**
 * Publisher dependencies
 */
import { BlockEditContext } from '@publisher/extensions';
import {
	controlClassNames,
	controlInnerClassNames,
} from '@publisher/classnames';
import { Button, HStack } from '@publisher/components';

/**
 * Internal dependencies
 */
import './style.scss';
import { getControlValue, updateControlValue } from './../utils';

export default function AnglePickerControl({
	initValue = 0,
	//
	value,
	attribute,
	repeaterAttributeIndex = null,
	repeaterAttribute = null,
	//
	className,
	onChange = () => {},
	...props
}) {
	const { attributes, setAttributes } = useContext(BlockEditContext);

	let controlValue = getControlValue(
		value,
		attribute,
		repeaterAttribute,
		repeaterAttributeIndex,
		initValue,
		attributes
	);

	const [angel, setAngel] = useState(controlValue);

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
				onChange={(newValue) => {
					updateControlValue(
						newValue,
						attribute,
						repeaterAttribute,
						repeaterAttributeIndex,
						attributes,
						setAttributes
					);
					setAngel(newValue);

					onChange(newValue);
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
					setAngel(subtractAngle(angel, 45));
				}}
			></Button>
			<Button
				className={controlInnerClassNames('btn-rotate-right')}
				showTooltip={true}
				label={__('Rotate Right', 'publisher')}
				icon={rotateRight}
				onClick={() => {
					setAngel(addAngle(angel, 45));
				}}
			></Button>
		</HStack>
	);
}
