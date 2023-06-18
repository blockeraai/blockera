/**
 * Publisher dependencies
 */
import { AttributesControl } from '@publisher/controls';

/**
 * Internal dependencies
 */
import { Field } from '../field';

export function AttributesField({
	className,
	children,
	attributeElement = 'a',
	...props
}) {
	return (
		<Field field="attributes" columns="columns-1" className={className}>
			<AttributesControl
				{...props}
				isPopover={true}
				attributeElement={attributeElement}
			/>

			{children}
		</Field>
	);
}
