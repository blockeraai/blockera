/**
 * WordPress dependencies
 */
import { useContext } from '@wordpress/element';
import { TextControl as WordPressTextControl } from '@wordpress/components';

/**
 * Internal dependencies
 */
import { controlClassNames } from '@publisher/classnames';
import { BlockEditContext } from '@publisher/extensions';

export default function InputControl({
	initValue,
	attribute,
	className,
	...props
}) {
	const { attributes, setAttributes } = useContext(BlockEditContext);

	return (
		<WordPressTextControl
			{...props}
			value={attributes[attribute] || initValue}
			onChange={(inputValue) =>
				setAttributes({
					...attributes,
					[attribute]: inputValue,
				})
			}
			className={controlClassNames('text', className)}
		/>
	);
}
