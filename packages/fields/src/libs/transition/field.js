/**
 * Publisher dependencies
 */
import { TransitionControl } from '@publisher/controls';

/**
 * Internal dependencies
 */
import { Field } from '../field';

export function TransitionField({ className, children, ...props }) {
	return (
		<Field field="transition" columns="columns-1" className={className}>
			<TransitionControl {...props} isPopover={true} />

			{children}
		</Field>
	);
}
