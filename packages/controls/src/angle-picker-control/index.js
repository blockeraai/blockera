/**
 * WordPress dependencies
 */
import { useContext } from '@wordpress/element';
import { AnglePickerControl as WordPressAnglePickerControl } from '@wordpress/components';
import { controlClassNames } from '@publisher/classnames';

/**
 * Internal dependencies
 */
import './style.scss';
import { BlockEditContext } from '@publisher/extensions';

export default function AnglePickerControl({
	initValue = 0,
	className,
	attribute,
	label = '',
	...props
}) {
	const { attributes, setAttributes } = useContext(BlockEditContext);

	return (
		<WordPressAnglePickerControl
			{...props}
			value={attributes[attribute] || initValue}
			onChange={(angle) =>
				setAttributes({
					...attributes,
					[attribute]: angle,
				})
			}
			label={label}
			__nextHasNoMarginBottom
			className={controlClassNames('angle', className)}
		/>
	);
}
