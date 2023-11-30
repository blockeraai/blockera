// @flow
/**
 * External dependencies
 */
import { useState, useEffect } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import type { MixedElement } from 'react';

/**
 * Publisher dependencies
 */
import {
	controlClassNames,
	controlInnerClassNames,
} from '@publisher/classnames';
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
import { OtherInput } from './other-input';
import type { TUnitInput } from '../types';

export function UnitInput({
	value,
	setValue,
	defaultValue,
	range,
	noBorder,
	className,
	units = [],
	disabled,
	validator,
	min,
	max,
	drag,
	float,
	...props
}: TUnitInput): MixedElement {
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

	const onChangeSelect = (value: string) => {
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
				'input',
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
							className={controlInnerClassNames(
								'single-input',
								noBorder && 'no-border',
								!isValidValue && 'invalid',
								className
							)}
							min={min}
							max={max}
							setValue={setInputValue}
							range={isActiveRange}
							drag={drag}
							float={float}
							{...props}
						/>
					) : (
						<OtherInput
							value={inputValue}
							setValue={setInputValue}
							disabled={disabled}
							className={controlInnerClassNames(
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
				className={controlInnerClassNames(
					'unit-select',
					!isSpecialUnit(unitValue.value) && 'hide-arrow'
				)}
				aria-label={__('Select unit', 'publisher-blocks')}
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
