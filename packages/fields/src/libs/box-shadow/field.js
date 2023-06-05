/**
 * Publisher dependencies
 */
import { BoxShadowControl } from '@publisher/controls';

/**
 * Internal dependencies
 */
import { Field } from '../field';

export function BoxShadowField({
	config,
	label,
	attribute,
	className,
	children,
	...props
}) {
	return (
		<Field field="box-shadow" columns="columns-1" className={className}>
			<BoxShadowControl
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
