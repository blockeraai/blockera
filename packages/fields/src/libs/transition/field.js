/**
 * Publisher dependencies
 */
import { TransitionControl } from '@publisher/controls';

/**
 * Internal dependencies
 */
import { Field } from '../field';

export function TransitionField({
	config,
	attribute,
	label,
	className,
	children,
	...props
}) {
	return (
		<Field field="transition" columns="columns-1" className={className}>
			<TransitionControl
				{...{
					config,
					...props,
					attribute,
				}}
				isPopover={true}
				label={label}
			/>

			{children}
		</Field>
	);
}
