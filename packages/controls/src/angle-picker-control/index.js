/**
 * WordPress dependencies
 */
import { useState } from '@wordpress/element';
import { AnglePickerControl as WordPressAnglePickerControl } from '@wordpress/components';
import { controlClassNames } from '@publisher/classnames';

import './style.scss';

export default function AnglePickerControl({
	initValue = 0,
	className,
	label = '',
	...props
}) {
	const [angle, setAngle] = useState(initValue);

	return (
		<WordPressAnglePickerControl
			{...props}
			value={angle}
			onChange={setAngle}
			label={label}
			__nextHasNoMarginBottom
			className={controlClassNames('angle', className)}
		/>
	);
}
