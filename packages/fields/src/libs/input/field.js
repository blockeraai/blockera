/**
 * WordPress dependencies
 */
import { useContext } from '@wordpress/element';

/**
 * Publisher dependencies
 */
import { BlockEditContext } from '@publisher/extensions';
import {
	InputControl,
	CssInputControl,
	RangeControl,
} from '@publisher/controls';

/**
 * Internal dependencies
 */
import { Field } from '../field';

export function InputField({
	name,
	label,
	columns,
	className,
	children,
	settings,
	...props
}) {
	const { name: blockName, ...blockProps } = useContext(BlockEditContext);

	return (
		<Field
			label={label}
			field="input"
			columns={columns}
			className={className}
		>
			{'range' === settings?.type && (
				<RangeControl
					{...props}
					{...settings}
					{...blockProps}
					blockName={name}
					withInputField={true}
				/>
			)}

			{'text' === settings?.type && (
				<InputControl
					{...props}
					{...settings}
					{...blockProps}
					blockName={name}
				/>
			)}

			{'css' === settings?.type && (
				<CssInputControl
					{...props}
					{...{ ...settings, type: 'css' }}
					{...blockProps}
					blockName={name}
				/>
			)}

			{children}
		</Field>
	);
}
