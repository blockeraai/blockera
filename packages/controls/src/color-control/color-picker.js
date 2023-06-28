/**
 * External dependencies
 */
import { ColorPicker as WPColorPicker } from '@wordpress/components';

/**
 * Publisher dependencies
 */
import { useValue } from '@publisher/utils';

export default function ColorPicker({
	value: initialValue,
	defaultValue,
	onChange = () => {},
	...props
}) {
	const { value, setValue } = useValue({
		initialValue,
		defaultValue,
		onChange,
		valueCleanup,
	});

	// make sure always we treat colors as lower case
	function valueCleanup(value) {
		if (value !== '') {
			value = value.toLowerCase();
		}

		return value;
	}

	return (
		<WPColorPicker
			enableAlpha={false}
			color={value}
			onChangeComplete={(color) => setValue(color.hex)}
			{...props}
		/>
	);
}
