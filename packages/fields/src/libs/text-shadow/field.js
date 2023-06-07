/**
 * Publisher dependencies
 */
import { TextShadowControl } from '@publisher/controls';

/**
 * Internal dependencies
 */
import { Field } from '../field';

export function TextShadowField({
	config,
	label,
	attribute,
	className,
	children,
	...props
}) {
	return (
		<Field field="text-shadow" columns="columns-1" className={className}>
			<TextShadowControl
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
