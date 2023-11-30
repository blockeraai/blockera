// @flow
/**
 * External dependencies
 */
import type { MixedElement } from 'react';

/**
 * Publisher dependencies
 */
import { controlClassNames } from '@publisher/classnames';
import {
	isFunction,
	isNumber,
	isString,
	isUndefined,
	useDragValue,
} from '@publisher/utils';

/**
 * Internal dependencies
 */
import { RangeControl } from '../../index';
import { default as ArrowUpIcon } from '../icons/arrow-up';
import { default as ArrowDownIcon } from '../icons/arrow-down';
import { useEffect, useState } from '@wordpress/element';
import type { TNumberInput } from '../types';

export function NumberInput({
	value,
	setValue,
	noBorder,
	className,
	disabled,
	validator,
	min,
	max,
	range = false,
	arrows = false,
	drag = true,
	...props
}: TNumberInput): MixedElement {
	// get the minimum value in number type
	const getMinValue: Object = () => {
		if (!isUndefined(min) && isNumber(+min)) {
			return { min: +min };
		}
		return {};
	};

	// get the maximum value in number type
	const getMaxValue: Object = () => {
		if (!isUndefined(max) && isNumber(+max)) {
			return { max: +max };
		}

		return {};
	};

	const handleKeyDown = (event: Object) => {
		// supports negative values
		const regex = new RegExp(
			value === ''
				? /(^-?\d*$)|(Backspace|Tab|Delete|ArrowLeft|ArrowRight|ArrowUp|ArrowDown)/
				: /(^\d*$)|(Backspace|Tab|Delete|ArrowLeft|ArrowRight|ArrowUp|ArrowDown)/
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

	// Handle paste event to allow only numeric content
	const handlePaste = (event: Object) => {
		const clipboardData = event.clipboardData || window.clipboardData;

		const pastedText: string = clipboardData.getData('text');

		// if (value !== '' && /^(-?)$/.test(pastedText)) {
		// 	event.preventDefault();
		// 	return;
		// }

		if (!/^(-?\d+)?$/.test(pastedText)) {
			event.preventDefault();
			return;
		}

		// dont let user to paste value smaller than min value
		if (getMinValue()?.min !== '' && +pastedText < getMinValue().min) {
			event.preventDefault();
			return;
		}

		// dont let user to paste value bigger than max value
		if (getMaxValue()?.max !== '' && +pastedText > +getMaxValue().max) {
			event.preventDefault();
		}
	};

	const handleInputChange = (event: Object) => {
		let value = parseInt(event.target.value.replace(/[^-0-9]/g, ''));

		if (getMinValue()?.min !== '' && value < getMinValue().min) {
			value = getMinValue().min;
		}

		if (getMaxValue()?.max !== '' && value > getMaxValue().max) {
			value = getMaxValue().max;
		}

		setValue(value);
	};

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

	const dragValueHandler = useDragValue({
		//$FlowFixMe
		value: isString(value) ? value.replace(/[^-0-9]/g, '') : +value,
		setValue: (newValue) => {
			setValue(newValue);
		},
		movement: 'vertical',
		...getMinValue(),
		...getMaxValue(),
	});

	const getDragEvent: Object = () => {
		return drag
			? {
					onMouseDown: (event) => {
						dragValueHandler(event);
					},
			  }
			: {};
	};

	return (
		<>
			{range && (
				<RangeControl
					withInputField={false}
					sideEffect={false}
					onChange={(newValue) => {
						setValue(newValue);
					}}
					disabled={disabled}
					{...getMinValue()}
					{...getMaxValue()}
					{...props}
				/>
			)}

			<input
				//$FlowFixMe
				value={value}
				disabled={disabled}
				className={controlClassNames(
					'input-tag',
					'input-tag-number',
					noBorder && 'no-border',
					!isValidValue && 'invalid',
					drag && 'is-drag-active',
					className
				)}
				onKeyDown={handleKeyDown}
				onPaste={handlePaste}
				{...props}
				{...getMinValue()}
				{...getMaxValue()}
				onChange={handleInputChange}
				type="number"
				{...getDragEvent()}
			/>

			{arrows && (
				<div
					className={controlClassNames(
						'input-arrows',
						disabled && 'is-disabled'
					)}
				>
					<span
						className={controlClassNames(
							'input-arrow',
							'input-arrow-up',
							getMaxValue()?.max !== '' &&
								+value >= +getMaxValue().max
								? 'is-disabled'
								: ''
						)}
						onClick={() => {
							let newValue = value !== '' ? +value : 0;

							newValue += 1;

							// dont let user to paste value bigger than max value
							if (
								getMaxValue()?.max !== '' &&
								newValue > +getMaxValue().max
							) {
								newValue = getMaxValue().max;
							}

							setValue(newValue);
						}}
					>
						<ArrowUpIcon />
					</span>

					<span
						className={controlClassNames(
							'input-arrow',
							'input-arrow-down',
							getMinValue()?.min !== '' &&
								+value <= +getMinValue().min
								? 'is-disabled'
								: ''
						)}
						onClick={() => {
							let newValue = value !== '' ? +value : 0;

							newValue -= 1;

							// dont let user to paste value bigger than max value
							if (
								getMinValue()?.min !== '' &&
								newValue < +getMinValue()?.min
							) {
								newValue = getMinValue()?.min;
							}

							setValue(newValue);
						}}
					>
						<ArrowDownIcon />
					</span>
				</div>
			)}
		</>
	);
}
