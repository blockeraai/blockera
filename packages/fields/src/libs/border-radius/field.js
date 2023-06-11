/**
 * Publisher dependencies
 */
import { BorderRadiusControl } from '@publisher/controls';

/**
 * Internal dependencies
 */
import { Field } from '../field';

export function BorderRadiusField({
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
			label=""
			field="border-radius"
			columns="columns-1"
			className={className}
		>
			<BorderRadiusControl {...props} label={label} />

			{children}
		</Field>
	);
}
