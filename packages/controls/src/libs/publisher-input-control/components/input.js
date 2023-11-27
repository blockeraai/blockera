/**
 * External dependencies
 */
import { useEffect, useState } from '@wordpress/element';

/**
 * Publisher dependencies
 */
import { controlClassNames } from '@publisher/classnames';
import { isFunction } from '@publisher/utils';

/**
 * Internal dependencies
 */

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
		if (!validator) {
			return;
		}

		let isValid = false;

		if (isFunction(validator)) {
			isValid = validator(value);
		}

		// Update isValidValue based on the result of validation
		setIsValidValue(isValid);
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
