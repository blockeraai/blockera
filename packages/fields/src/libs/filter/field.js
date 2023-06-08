/**
 * Publisher dependencies
 */
import { FilterControl } from '@publisher/controls';

/**
 * Internal dependencies
 */
import { Field } from '../field';

export function FilterField({
	config,
	attribute,
	label,
	columns,
	className,
	children,
	popoverLabel,
	...props
}) {
	return (
		<Field field="filter" columns="columns-1" className={className}>
			<FilterControl
				{...{
					config,
					...props,
					attribute,
					popoverLabel,
				}}
				isPopover={true}
				label={label}
			/>

			{children}
		</Field>
	);
}
