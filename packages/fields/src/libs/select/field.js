/**
 * Publisher dependencies
 */
import { SelectControl } from '@publisher/controls';

/**
 * Internal dependencies
 */
import { Field } from '../field';

export function SelectField({
	name,
	label,
	columns,
	className,
	attribute,
	children,
	...props
}) {
	return (
		<Field
			label={label}
			field="select"
			columns={columns}
			className={className}
		>
			<SelectControl {...props} />

			{children}
		</Field>
	);
}
