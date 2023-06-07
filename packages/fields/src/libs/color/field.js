/**
 * WordPress dependencies
 */
import { useContext } from '@wordpress/element';

/**
 * Publisher dependencies
 */
import { BlockEditContext } from '@publisher/extensions';
import { ColorControl } from '@publisher/controls';

/**
 * Internal dependencies
 */
import { Field } from '../field';

export function ColorField({ label, attribute, columns, className, children }) {
	const { name, attributes, setAttributes } = useContext(BlockEditContext);

	return (
		<Field
			label={label}
			field="color"
			columns={columns}
			className={className}
		>
			<ColorControl
				value={attributes[attribute]}
				onValueChange={(newValue) =>
					setAttributes({
						...attributes,
						[attribute]: newValue,
					})
				}
				blockName={name}
			/>

			{children}
		</Field>
	);
}
