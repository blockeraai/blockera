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
	...props
}) {
	return (
		<Field field="filter" columns="columns-1" className={className}>
			<FilterControl
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
