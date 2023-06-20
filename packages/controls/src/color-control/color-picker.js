/**
 * WordPress dependencies
 */
import { ColorPicker as WPColorPicker } from '@wordpress/components';

export default function ColorPicker({
	value,
	onValueChange = () => {},
	...props
}) {
	return (
		<WPColorPicker
			enableAlpha={false}
			color={value}
			onChangeComplete={(color) => onValueChange(color.hex)}
			{...props}
		/>
	);
}
