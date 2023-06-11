/**
 * Publisher dependencies
 */
import { BoxBorderControl } from '@publisher/controls';

/**
 * Internal dependencies
 */
import { Field } from '../field';

export function BoxBorderField({
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
			field="border"
			columns="columns-1"
			className={className}
		>
			<BoxBorderControl {...props} label={label} />

			{children}
		</Field>
	);
}
