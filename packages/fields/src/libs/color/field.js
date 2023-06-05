/**
 * WordPress dependencies
 */
import { useContext } from '@wordpress/element';

/**
 * Publisher dependencies
 */
import { BlockEditContext } from '@publisher/extensions';
import { ColorControl } from '@publisher/controls';

/**
 * Internal dependencies
 */
import { Field } from '../field';

export function ColorField({
	name,
	label,
	settings,
	columns,
	className,
	children,
	...props
}) {
	const { name: blockName, ...blockProps } = useContext(BlockEditContext);

	return (
		<Field
			label={label}
			field="color"
			columns={columns}
			className={className}
		>
			<ColorControl
				{...props}
				{...settings}
				{...blockProps}
				blockName={name}
			/>

			{children}
		</Field>
	);
}
