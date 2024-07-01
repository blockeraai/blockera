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
import { isNumber, isString, isUndefined, useDragValue } from '@blockera/utils';

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

	const handleKeyDown = (event: Object) => {
		// supports negative values
		const regex = new RegExp(
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
		let value = event.target.value.replace(
			float ? /[^-\.0-9]/g : /[^-0-9]/g,
			''
		);

		if (value !== '') {
			if (getMinValue()?.min !== '' && value < getMinValue().min) {
				value = getMinValue().min;
			}

			if (getMaxValue()?.max !== '' && value > getMaxValue().max) {
				value = getMaxValue().max;
			}
		}

		setValue(value !== '' ? +value : value);
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
		...getMinValue(),
		...getMaxValue(),
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
				{...getMinValue()}
				{...getMaxValue()}
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
								getMaxValue()?.max !== '' &&
									+value >= +getMaxValue().max
									? 'is-disabled'
									: ''
							)}
							onClick={() => {
								let newValue = value !== '' ? +value : 0;

								newValue += 1;

								// don't let user set value bigger than max value
								if (
									getMaxValue()?.max !== '' &&
									newValue > +getMaxValue().max
								) {
									newValue = +getMaxValue().max;
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
								getMinValue()?.min !== '' &&
									+value <= +getMinValue().min
									? 'is-disabled'
									: ''
							)}
							onClick={() => {
								let newValue = value !== '' ? +value : 0;

								newValue -= 1;

								// don't let user set value bigger than max value
								if (
									getMinValue()?.min !== '' &&
									newValue < +getMinValue()?.min
								) {
									newValue = +getMinValue()?.min;
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
