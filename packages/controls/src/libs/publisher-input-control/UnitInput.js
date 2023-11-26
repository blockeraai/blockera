/**
 * External dependencies
 */
import { useState, useEffect } from '@wordpress/element';

/**
 * Publisher dependencies
 */
import { controlClassNames } from '@publisher/classnames';
import { isFunction, isArray, isUndefined } from '@publisher/utils';

/**
 * Internal dependencies
 */
import { isSpecialUnit, checkCSSFunctions, getUnitByValue } from './utils';

export function UnitInput({
	value,
	setValue,
	noBorder,
	className,
	units = [],
	setIsSpecial,
	isSpecial = false,
	disabled,
	validator,
	...props
}) {
	const [isValidValue, setIsValidValue] = useState(true);

	const onChangeInput = (inputValue) => {
		if (isSpecial) {
			setValue({
				...value,
				oldUnit: value?.inputValue,
				inputValue,
			});
		} else {
			setValue({
				...value,
				...(value?.unit !== 'func'
					? { oldInputValue: inputValue }
					: {}),
				inputValue,
			});
		}
	};

	const onChangeSelect = (unit) => {
		if (isSpecialUnit(unit)) {
			setValue({
				...value,
				isSpecial: true,
				unit,
				oldUnit: value?.unit,
				// oldInputValue: value?.inputValue,
				inputValue: unit,
				type: 'text',
			});
			if (unit !== 'func') {
				setIsValidValue(true);
			}
		} else {
			const type = getUnitByValue(unit)?.type || 'number';
			setValue({
				...value,
				isSpecial: false,
				inputValue: value?.oldInputValue,
				oldUnit: value?.unit,
				unit,
				type,
			});
			if (unit !== 'func') {
				setIsValidValue(true);
			}
		}
	};

	useEffect(() => {
		if (value?.unit) {
			setValue({
				...value,
				unit: value.unit,
			});
		} else if (units.length) {
			setValue({
				...value,
				units: units[0]?.value,
			});
		}
	}, []); // eslint-disable-line

	// validator checking
	useEffect(() => {
		if (!validator || isUndefined(value?.inputValue)) {
			// If no validator is provided, assume the value is valid
			setIsValidValue(true);
		} else {
			if (value?.unit !== 'func') return;
			let isValid = false;
			if (isFunction(validator)) {
				isValid = validator(value.inputValue);
			} else if (isArray(validator)) {
				isValid = checkCSSFunctions(validator, value.inputValue);
			}

			// Update validValue based on the result of validation
			setIsValidValue(!!isValid);
		}
	}, [value]); // eslint-disable-line

	console.log('value:', value);
	console.log('type:', getUnitByValue(value?.unit)?.type || 'number');

	return (
		<div className={controlClassNames('unit-input-container')}>
			<input
				value={value?.inputValue}
				onChange={(e) => onChangeInput(e.target.value)}
				disabled={disabled}
				className={controlClassNames(
					'single-input',
					noBorder && 'no-border',
					!isValidValue && 'invalid',
					className
				)}
				type={'number'}
				{...props}
			/>
			<span className={controlClassNames('input-suffix')}>
				<select
					disabled={disabled}
					onChange={(e) => onChangeSelect(e.target.value)}
					value={value?.unit || units?.[0]?.value}
					className={controlClassNames(
						'unit-select',
						!isSpecial && 'hide-arrow'
					)}
				>
					{units.map((unit, key) => (
						<option key={key} value={unit?.value}>
							{unit?.label}
						</option>
					))}
				</select>
			</span>
		</div>
	);
}
