/**
 * Publisher dependencies
 */
import { ToggleSelectControl } from '@publisher/controls';

/**
 * Internal dependencies
 */
import { Field } from '../field';

export function ToggleSelectField({
	name,
	label,
	columns,
	children,
	className,
	...props
}) {
	return (
		<Field
			label={label}
			field="toggle-select"
			columns={columns}
			className={className}
		>
			<ToggleSelectControl {...props} />

			{children}
		</Field>
	);
}
