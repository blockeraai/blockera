/**
 * Publisher dependencies
 */
import { controlClassNames } from '@publisher/classnames';

export function Input({
	value,
	setValue,
	isValid,
	type,
	getMaxValue,
	getMinValue,
	noBorder,
	className,
	disabled,
	...props
}) {
	return (
		<input
			value={value}
			onChange={(e) => setValue(e.target.value)}
			disabled={disabled}
			className={controlClassNames(
				'single-input',
				!isValid && 'invalid',
				noBorder && 'no-border',
				className
			)}
			type={type}
			{...getMinValue}
			{...getMaxValue}
			{...props}
		/>
	);
}
