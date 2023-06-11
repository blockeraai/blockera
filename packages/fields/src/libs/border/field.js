/**
 * Publisher dependencies
 */
import { BorderControl } from '@publisher/controls';

/**
 * Internal dependencies
 */
import { Field } from '../field';
import './style.scss';

export function BorderField({
	name,
	label,
	columns,
	className,
	attribute,
	children,
	...props
}) {
	return (
		<Field
			label={label}
			field="border"
			columns={columns}
			className={className}
		>
			<BorderControl
				{...props}
				value={{ width: '1', color: '#eeeeee', style: 'solid' }}
			/>

			{children}
		</Field>
	);
}
