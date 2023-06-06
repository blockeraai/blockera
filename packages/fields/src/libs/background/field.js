/**
 * Publisher dependencies
 */
import { BackgroundControl } from '@publisher/controls';

/**
 * Internal dependencies
 */
import { Field } from '../field';

export function BackgroundField({
	config,
	attribute,
	label,
	className,
	children,
	...props
}) {
	return (
		<Field field="background" columns="columns-1" className={className}>
			<BackgroundControl
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
