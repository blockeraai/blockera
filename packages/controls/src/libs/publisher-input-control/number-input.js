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
import { checkCSSFunctions } from './utils';

export function NumberInput({
	value,
	setValue,
	type = 'number',
	getMaxValue,
	getMinValue,
	noBorder,
	className,
	disabled,
	validator,
	...props
}) {
	const [isValidValue, setIsValidValue] = useState(true);

	const handleKeyDown = (event) => {
		const regex = new RegExp(
			/(^\d*$)|(Backspace|Tab|Delete|ArrowLeft|ArrowRight|ArrowUp|ArrowDown)/
		);

		// Allow Ctrl+A (Windows) or Command+A (Mac) to select all text
		// Allow Ctrl+C (Windows) or Command+C (Mac) to copy text
		// Allow Ctrl+V (Windows) or Command+V (Mac) to paste text
		if (
			!(
				(event.ctrlKey || event.metaKey) &&
				(event.key.toLowerCase() === 'a' ||
					event.key.toLowerCase() === 'v' ||
					event.key.toLowerCase() === 'c')
			) &&
			!event.key.match(regex)
		) {
			event.preventDefault();
		}
	};

	const handlePaste = (event) => {
		// Handle paste event to allow only numeric content
		const clipboardData = event.clipboardData || window.clipboardData;
		const pastedText = clipboardData.getData('text');
		if (!/^\d+$/.test(pastedText)) {
			event.preventDefault();
		}
	};

	const handleInputChange = (event) => {
		setValue({ inputValue: event.target.value.replace(/[^0-9]/g, '') });
	};

	// validator checking
	useEffect(() => {
		if (!validator) {
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
			value={value?.inputValue}
			onChange={handleInputChange}
			disabled={disabled}
			className={controlClassNames(
				'single-input',
				'single-input-number',
				!isValidValue && 'invalid',
				noBorder && 'no-border',
				className
			)}
			onKeyDown={handleKeyDown}
			onPaste={handlePaste}
			type={type}
			{...getMinValue}
			{...getMaxValue}
			{...props}
		/>

		// todo: add up and down buttons here
	);
}
