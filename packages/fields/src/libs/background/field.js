/**
 * Publisher dependencies
 */
import { BackgroundControl } from '@publisher/controls';

/**
 * Internal dependencies
 */
import { Field } from '../field';

export function BackgroundField({ className, children, ...props }) {
	return (
		<Field field="background" columns="columns-1" className={className}>
			<BackgroundControl {...props} isPopover={true} />

			{children}
		</Field>
	);
}
