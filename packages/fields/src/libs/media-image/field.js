/**
 * Publisher dependencies
 */
import { MediaImageControl } from '@publisher/controls';

/**
 * Internal dependencies
 */
import { Field } from '../field';

export function MediaImageField({
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
			field="media-image"
			columns={columns}
			className={className}
		>
			<MediaImageControl {...props} />

			{children}
		</Field>
	);
}
