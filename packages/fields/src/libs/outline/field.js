/**
 * Publisher dependencies
 */
import { OutlineControl } from '@publisher/controls';

/**
 * Internal dependencies
 */
import { Field } from '../field';

export function OutlineField({
	config,
	label,
	attribute,
	className,
	children,
	...props
}) {
	return (
		<Field field="outline" columns="columns-1" className={className}>
			<OutlineControl
				{...{
					config,
					...props,
					attribute,
				}}
				label={label}
			/>

			{children}
		</Field>
	);
}
