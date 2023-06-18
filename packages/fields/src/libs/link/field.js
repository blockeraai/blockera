/**
 * Publisher dependencies
 */
import { LinkControl } from '@publisher/controls';

/**
 * Internal dependencies
 */
import { Field } from '../../index';

export function LinkField({
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
			field="link"
			className={className}
			columns={columns}
		>
			<LinkControl {...props} />

			{children}
		</Field>
	);
}
