/**
 * WordPress dependencies
 */
import { useState } from '@wordpress/element';
import { TextControl as WordPressTextControl } from '@wordpress/components';

export default function InputControl({ initValue, ...props }) {
	const [value, setValue] = useState(initValue);

	return (
		<WordPressTextControl
			{...props}
			value={value}
			onChange={(inputValue) => setValue(inputValue)}
		/>
	);
}
