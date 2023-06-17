/**
 * Publisher dependencies
 */
import { AttributesControl } from '@publisher/controls';

/**
 * Internal dependencies
 */
import { Field } from '../field';

export function AttributesField({
	config,
	attribute,
	label,
	className,
	children,
	...props
}) {
	return (
		<Field field="attributes" columns="columns-1" className={className}>
			<AttributesControl
				{...{
					config,
					...props,
					attribute,
				}}
				isPopover={true}
				label={label}
				attributeElement="a"
			/>

			{children}
		</Field>
	);
}
