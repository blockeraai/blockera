/**
 * Publisher dependencies
 */
import { ColorControl } from '@publisher/controls';

/**
 * Internal dependencies
 */
import { Field } from '../field';

export function ColorField({
	label,
	attribute,
	columns,
	className,
	children,
	...props
}) {
	return (
		<Field
			label={label}
			field="color"
			columns={columns}
			className={className}
		>
			<ColorControl {...props} />

			{children}
		</Field>
	);
}
