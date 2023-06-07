/**
 * Publisher dependencies
 */
import { SelectControl } from '@publisher/controls';

/**
 * Internal dependencies
 */
import { Field } from '../field';
import { useContext } from '@wordpress/element';
import { BlockEditContext } from '@publisher/extensions';

export function SelectField({
	name,
	label,
	columns,
	className,
	initValue,
	attribute,
	options,
	children,
	...props
}) {
	const { attributes, setAttributes } = useContext(BlockEditContext);

	return (
		<Field
			label={label}
			field="select"
			columns={columns}
			className={className}
		>
			<SelectControl
				{...{
					...props,
					options,
					initValue,
					value: attributes[attribute],
					onValueChange: (newValue) => {
						attributes[attribute] = newValue;

						setAttributes(attributes);
					},
				}}
			/>

			{children}
		</Field>
	);
}
