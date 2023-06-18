/**
 * Publisher dependencies
 */
import { OutlineControl } from '@publisher/controls';

/**
 * Internal dependencies
 */
import { Field } from '../field';

export function OutlineField({ className, children, ...props }) {
	return (
		<Field field="outline" columns="columns-1" className={className}>
			<OutlineControl {...props} />

			{children}
		</Field>
	);
}
