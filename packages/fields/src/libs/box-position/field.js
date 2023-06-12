/**
 * Publisher dependencies
 */
import { BoxPositionControl } from '@publisher/controls';

/**
 * Internal dependencies
 */
import { Field } from '../field';

export function BoxPositionField({
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
			field="box-position"
			columns={columns}
			className={className}
		>
			<BoxPositionControl {...props} />

			{children}
		</Field>
	);
}
