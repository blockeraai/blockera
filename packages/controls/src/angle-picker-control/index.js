/**
 * WordPress dependencies
 */
import { useState } from '@wordpress/element';
import { AnglePickerControl as WordPressAnglePickerControl } from '@wordpress/components';

export default function AnglePickerControl({ initValue = 0, ...props }) {
	const [angle, setAngle] = useState(initValue);

	return (
		<WordPressAnglePickerControl
			{...props}
			value={angle}
			onChange={setAngle}
			__nextHasNoMarginBottom
		/>
	);
}
