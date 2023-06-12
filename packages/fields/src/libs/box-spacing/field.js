/**
 * Publisher dependencies
 */
import { BoxSpacingControl } from '@publisher/controls';

/**
 * Internal dependencies
 */
import { Field } from '../field';

export function BoxSpacingField({
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
			field="box-spacing"
			columns={columns}
			className={className}
		>
			<BoxSpacingControl {...props} />

			{children}
		</Field>
	);
}
