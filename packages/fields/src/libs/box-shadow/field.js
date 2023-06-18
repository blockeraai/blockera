/**
 * Publisher dependencies
 */
import { BoxShadowControl } from '@publisher/controls';

/**
 * Internal dependencies
 */
import { Field } from '../field';

export function BoxShadowField({ className, children, ...props }) {
	return (
		<Field field="box-shadow" columns="columns-1" className={className}>
			<BoxShadowControl {...props} />

			{children}
		</Field>
	);
}
