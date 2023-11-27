/**
 * External dependencies
 */
import { useState, useEffect } from '@wordpress/element';

/**
 * Publisher dependencies
 */
import { controlClassNames } from '@publisher/classnames';
import { isFunction, isUndefined } from '@publisher/utils';

/**
 * Internal dependencies
 */
import {
	isSpecialUnit,
	getUnitByValue,
	extractNumberAndUnit,
	getFirstUnit,
} from '../utils';
import { NumberInput } from './number-input';
import { Input } from './input';

export function UnitInput({
	value,
	setValue,
	defaultValue,
	range,
	noBorder,
	className,
	units = [],
	setIsSpecial,
	disabled,
	validator,
	min,
	max,
	...props
}) {
	const extractedValue = extractNumberAndUnit(value);

	const [unitValue, setUnitValue] = useState(
		isUndefined(extractedValue.unit) || extractedValue.unit === ''
			? getFirstUnit(units)
			: getUnitByValue(extractedValue.unit, units)
	);

	const [inputValue, setInputValue] = useState(extractedValue.value);

	useEffect(() => {
		if (isSpecialUnit(unitValue.value)) {
			setValue(unitValue.value);
		} else if (inputValue === '') {
			setValue('');
		} else {
			setValue(inputValue + unitValue.value);
		}
	}, [unitValue, inputValue]);

	const onChangeSelect = (value) => {
		setUnitValue(getUnitByValue(value, units));

		// old unit is special && current is not && value is empty
		// then try to catch value from default value
		if (
			isSpecialUnit(unitValue.value) &&
			!isSpecialUnit(value) &&
			inputValue === '' &&
			defaultValue !== ''
		) {
			const extractedValue = extractNumberAndUnit(defaultValue);
			setInputValue(extractedValue.value);
		}
	};

	const isActiveRange =
		range && !isSpecialUnit(unitValue.value) && unitValue.value !== 'func';

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
		<div
			className={controlClassNames(
				'input-2',
				'input-unit',
				isSpecialUnit(unitValue?.value) &&
					'publisher-control-unit-special',
				isActiveRange && 'is-range-active',
				className
			)}
		>
			{!isSpecialUnit(unitValue?.value) && (
				<>
					{unitValue.format === 'number' ? (
						<NumberInput
							value={inputValue}
							disabled={disabled}
							className={controlClassNames(
								'single-input',
								noBorder && 'no-border',
								!isValidValue && 'invalid',
								className
							)}
							min={min}
							max={max}
							setValue={setInputValue}
							range={isActiveRange}
							{...props}
						/>
					) : (
						<Input
							value={inputValue}
							setValue={setInputValue}
							disabled={disabled}
							className={controlClassNames(
								'single-input',
								noBorder && 'no-border',
								!isValidValue && 'invalid',
								className
							)}
							{...props}
							type={unitValue?.format}
						/>
					)}
				</>
			)}

			<select
				disabled={disabled}
				onChange={(e) => onChangeSelect(e.target.value)}
				value={unitValue.value}
				className={controlClassNames(
					'unit-select',
					!isSpecialUnit(unitValue.value) && 'hide-arrow'
				)}
			>
				{units.map((unit, key) => (
					<>
						{!isUndefined(unit?.options) ? (
							<optgroup label={unit.label}>
								{unit?.options.map((_unit, _key) => (
									<option key={_key} value={_unit?.value}>
										{_unit?.label}
									</option>
								))}
							</optgroup>
						) : (
							<option key={key} value={unit?.value}>
								{unit?.label}
							</option>
						)}
					</>
				))}

				{!isUndefined(unitValue?.notFound) &&
					unitValue.notFound === true && (
						<option key={unitValue.value} value={unitValue.value}>
							{unitValue.label}
						</option>
					)}
			</select>
		</div>
	);
}
