/**
 * Publisher dependencies
 */
import { GradientBarControl } from '@publisher/controls';

/**
 * Internal dependencies
 */
import { Field } from '../field';

export function GradientBarField({
	name,
	label,
	columns,
	className,
	options,
	children,
	...props
}) {
	return (
		<Field
			label={label}
			field="gradient-bar"
			columns="columns-1"
			className={className}
		>
			<GradientBarControl
				{...{
					...props,
					options,
				}}
			/>

			{children}
		</Field>
	);
}
