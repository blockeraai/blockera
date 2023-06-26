/**
 * Publisher dependencies
 */
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
					blockName={name}
					withInputField={true}
				/>
			)}

			{'range' !== settings?.type && (
				<InputControl
					{...props}
					{...settings}
					type={settings.type}
					blockName={name}
				/>
			)}

			{children}
		</Field>
	);
}
