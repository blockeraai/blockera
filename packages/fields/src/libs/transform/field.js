/**
 * Publisher dependencies
 */
import { TransformControl } from '@publisher/controls';

/**
 * Internal dependencies
 */
import { Field } from '../field';

export function TransformField({ columns, className, children, ...props }) {
	return (
		<Field field="transform" columns="columns-1" className={className}>
			<TransformControl {...props} />

			{children}
		</Field>
	);
}
