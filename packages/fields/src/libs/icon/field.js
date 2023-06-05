/**
 * Internal dependencies
 */
import { IconControl } from '@publisher/controls';

/**
 * Internal dependencies
 */
import { Field } from '../field';

export function IconField({ attribute, label, className, children, ...props }) {
	return (
		<Field
			label={label}
			field="icon"
			columns="columns-1"
			className={className}
		>
			<IconControl
				{...{
					...props,
					attribute,
				}}
			/>

			{children}
		</Field>
	);
}
