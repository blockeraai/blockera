/**
 * Publisher dependencies
 */
import { AnglePickerControl } from '@publisher/controls';

/**
 * Internal dependencies
 */
import { Field } from '../field';

export function AnglePickerField({
	label,
	columns,
	className,
	children,
	...props
}) {
	return (
		<Field
			label={label}
			field="angle-picker"
			columns={columns}
			className={className}
		>
			<AnglePickerControl {...props} />

			{children}
		</Field>
	);
}
