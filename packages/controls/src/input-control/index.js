/**
 * WordPress dependencies
 */
import { useState } from '@wordpress/element';
import { TextControl as WordPressTextControl } from '@wordpress/components';
import { controlClassNames } from '@publisher/classnames';

export default function InputControl({ initValue, className, ...props }) {
	const [value, setValue] = useState(initValue);

	return (
		<WordPressTextControl
			{...props}
			value={value}
			onChange={(inputValue) => setValue(inputValue)}
			className={controlClassNames('text', className)}
		/>
	);
}
