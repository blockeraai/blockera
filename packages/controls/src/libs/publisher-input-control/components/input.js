/**
 * External dependencies
 */
import { useEffect, useState } from '@wordpress/element';

/**
 * Publisher dependencies
 */
import { controlClassNames } from '@publisher/classnames';
import { isArray, isFunction } from '@publisher/utils';

/**
 * Internal dependencies
 */
import { checkCSSFunctions } from '../utils';

export function Input({
	value,
	setValue,
	type,
	noBorder,
	className,
	disabled,
	validator,
	...props
}) {
	const [isValidValue, setIsValidValue] = useState(true);

	// validator checking
	useEffect(() => {
		if (!validator || type !== 'text') {
			// If no validator is provided, assume the value is valid
			setIsValidValue(true);
			return;
		}

		let isValid = false;
		if (isFunction(validator)) {
			isValid = validator(value?.inputValue);
		} else if (isArray(validator)) {
			isValid = checkCSSFunctions(validator, value?.inputValue);
		}

		// Update validValue based on the result of validation
		setIsValidValue(!!isValid);
	}, [value]); // eslint-disable-line

	return (
		<input
			value={value}
			disabled={disabled}
			className={controlClassNames(
				'input-tag',
				!isValidValue && 'invalid',
				noBorder && 'no-border',
				className
			)}
			type={type}
			{...props}
			onChange={(e) => setValue(e.target.value)}
		/>
	);
}
