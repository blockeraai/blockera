/**
 * WordPress dependencies
 */
import { useContext } from '@wordpress/element';
import {
	TextControl as WordPressTextControl,
	__experimentalUnitControl as UnitControl,
} from '@wordpress/components';

/**
 * Internal dependencies
 */
import { controlClassNames } from '@publisher/classnames';
import { BlockEditContext } from '@publisher/extensions';

/**
 * Styles
 */
import './style.scss';

export function InputControl({
	initValue,
	attribute,
	className,
	units,
	...props
}) {
	const { attributes, setAttributes } = useContext(BlockEditContext);

	return (
		<>
			{units && (
				<UnitControl
					{...props}
					value={attributes[attribute] || initValue}
					onChange={(inputValue) =>
						setAttributes({
							...attributes,
							[attribute]: inputValue,
						})
					}
					units={units}
					className={controlClassNames(
						'text',
						'publisher-control-unit',
						className
					)}
				/>
			)}

			{!units && (
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
			)}
		</>
	);
}
