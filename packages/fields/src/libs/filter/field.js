/**
 * Publisher dependencies
 */
import { FilterControl } from '@publisher/controls';

/**
 * Internal dependencies
 */
import { Field } from '../field';

export function FilterField({ columns, className, children, ...props }) {
	return (
		<Field field="filter" columns="columns-1" className={className}>
			<FilterControl {...props} isPopover={true} />

			{children}
		</Field>
	);
}
