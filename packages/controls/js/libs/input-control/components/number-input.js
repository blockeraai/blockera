// @flow
/**
 * External dependencies
 */
import type { MixedElement } from 'react';

/**
 * Blockera dependencies
 */
import {
	controlClassNames,
	controlInnerClassNames,
} from '@blockera/classnames';
import {
	isNumber,
	isString,
	isUndefined,
	isEmpty,
	useDragValue,
} from '@blockera/utils';

/**
 * Internal dependencies
 */
import { RangeControl } from '../../index';
import type { InnerInputControlProps } from '../types';
import { default as ArrowUpIcon } from '../icons/arrow-up';
import { default as ArrowDownIcon } from '../icons/arrow-down';

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
	float = true,
	actions = '',
	children,
	size,
	isValidValue,
	...props
}: InnerInputControlProps): MixedElement {
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

	const minValue = getMinValue();
	const maxValue = getMaxValue();

	const handleKeyDown = (event: Object) => {
		const regex = new RegExp(
			// accept 0 as a valid input and allow `-` at the beginning only
			`${
				value === '' ? '(^-?\\d*$)' : '(^\\d*$)'
			}|(Backspace|Tab|Delete|ArrowLeft|ArrowRight|ArrowUp|ArrowDown${
				float ? '|\\.' : ''
			})`
		);

		// Allow Ctrl+A (Windows) or Command+A (Mac) to select all text
		// Allow Ctrl+C (Windows) or Command+C (Mac) to copy text
		// Allow Ctrl+V (Windows) or Command+V (Mac) to paste text
		// Allow Ctrl+R (Windows) or Command+R (Mac) to refresh page
		if (
			!(
				(event.ctrlKey || event.metaKey) &&
				(event.key.toLowerCase() === 'a' ||
					event.key.toLowerCase() === 'v' ||
					event.key.toLowerCase() === 'c' ||
					event.key.toLowerCase() === 'r')
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

		if (!/^(-?\d+(\.\d+)?)$/.test(pastedText)) {
			event.preventDefault();
			return;
		}

		// const minValue = getMinValue();

		// don't let user to paste value smaller than min value
		if (!isEmpty(minValue?.min) && +pastedText < minValue.min) {
			event.preventDefault();
			return;
		}

		// const maxValue = getMaxValue();

		// don't let user to paste value bigger than max value
		if (!isEmpty(maxValue?.max) && +pastedText > +maxValue.max) {
			event.preventDefault();
		}
	};

	const handleInputChange = (event: Object) => {
		let value = event.target.value.replace(
			float ? /[^-\.0-9]/g : /[^-0-9]/g,
			''
		);

		if (!isEmpty(value)) {
			// const minValue = getMinValue();
			// const maxValue = getMaxValue();

			if (!isEmpty(minValue?.min) && value < minValue.min) {
				value = getMinValue().min;
			} else if (!isEmpty(maxValue?.max) && value > maxValue.max) {
				value = maxValue.max;
			}

			setValue(+value);
		} else {
			setValue(value);
		}

		// setValue(!isEmpty(value) ? +value : value);
	};

	const { onDragStart, onDragEnd } = useDragValue({
		value: isString(value)
			? //$FlowFixMe
			  value.replace(float ? /[^-\.0-9]/g : /[^-0-9]/g, '')
			: +value,
		setValue: (newValue) => {
			setValue(newValue);
		},
		movement: 'vertical',
		...minValue,
		...maxValue,
	});

	const getDragEvent: Object = () => {
		return drag
			? {
					onMouseDown: (event) => {
						onDragStart(event);
					},
					onMouseUp: onDragEnd,
			  }
			: {};
	};

	return (
		<>
			{range && !['small', 'extra-small'].includes(size) && (
				<RangeControl
					withInputField={false}
					sideEffect={false}
					onChange={(newValue: number) => {
						setValue(newValue);
					}}
					disabled={disabled}
					{...minValue}
					{...maxValue}
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
				{...minValue}
				{...maxValue}
				{...props}
				onChange={handleInputChange}
				type="number"
				{...getDragEvent()}
			/>

			<div className={controlInnerClassNames('input-actions')}>
				{actions}

				{arrows && size !== 'extra-small' && (
					<div
						className={controlClassNames(
							'input-arrows',
							disabled && 'is-disabled'
						)}
						data-test="arrows-container"
					>
						<span
							className={controlClassNames(
								'input-arrow',
								'input-arrow-up',
								!isEmpty(maxValue?.max) &&
									+value >= +maxValue.max
									? 'is-disabled'
									: ''
							)}
							onClick={() => {
								let newValue = !isEmpty(value) ? +value : 0;

								newValue += 1;

								// don't let user set value bigger than max value
								if (
									!isEmpty(maxValue?.max) &&
									newValue > +maxValue.max
								) {
									newValue = +maxValue.max;
								}

								setValue(newValue);
							}}
							data-test="arrow-up"
						>
							<ArrowUpIcon />
						</span>

						<span
							className={controlClassNames(
								'input-arrow',
								'input-arrow-down',
								!isEmpty(minValue?.min) &&
									+value <= +minValue.min
									? 'is-disabled'
									: ''
							)}
							onClick={() => {
								let newValue = !isEmpty(value) ? +value : 0;

								newValue -= 1;

								// don't let user set value bigger than max value
								if (
									!isEmpty(minValue?.min) &&
									newValue <= +minValue?.min
								) {
									newValue = +minValue?.min;
								}

								setValue(newValue);
							}}
							data-test="arrow-down"
						>
							<ArrowDownIcon />
						</span>
					</div>
				)}
			</div>

			{children}
		</>
	);
}
