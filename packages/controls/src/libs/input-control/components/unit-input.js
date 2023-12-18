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
import { isEquals, isFunction, isUndefined } from '@publisher/utils';
import {
	Popover,
	Button,
	Tooltip,
	ConditionalWrapper,
} from '@publisher/components';

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
import type { InnerInputControlProps } from '../types';
import MaximizeIcon from '../icons/maximize';
import TextAreaControl from '../../textarea-control';
import NoticeControl from '../../notice-control';

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
	arrows,
	size,
	children,
	...props
}: InnerInputControlProps): MixedElement {
	const extractedValue = extractNumberAndUnit(value);

	const firstUnit = getFirstUnit(units);

	// Unit is not provided and there is a unit with empty value
	// clear unit to let the empty unit be selected
	if (extractedValue?.unitSimulated && firstUnit.value === '') {
		extractedValue.unit = '';
	}

	const extractedNoUnit =
		isUndefined(extractedValue.unit) || extractedValue.unit === '';

	const initialUnit = extractedNoUnit
		? firstUnit
		: getUnitByValue(extractedValue.unit, units);

	const [unitValue, setUnitValue] = useState(initialUnit);

	const [inputValue, setInputValue] = useState(extractedValue.value);

	useEffect(() => {
		if (isSpecialUnit(unitValue.value) && value !== unitValue.value) {
			setValue(unitValue.value);
		} else if (inputValue === '' && value) {
			setValue('');
		} else if (
			(extractedNoUnit || !value) &&
			inputValue &&
			unitValue.value
		) {
			setValue(inputValue + unitValue.value);
		} else if (!extractedNoUnit && value && value !== unitValue.value) {
			setValue(inputValue + unitValue.value);
		}
	}, [unitValue, inputValue]); // eslint-disable-line

	const onChangeSelect = (newUnitValue: string) => {
		// new unit is func
		// then append old unit to value and show it in the input
		if (
			newUnitValue === 'func' &&
			inputValue !== '' &&
			!isSpecialUnit(unitValue.value)
		) {
			setUnitValue(getUnitByValue(newUnitValue, units));
			setInputValue(inputValue + unitValue.value);
			return;
		}

		// old unit is func and new unit is not special
		// extract number from old input value (func value)
		if (
			!isSpecialUnit(newUnitValue) &&
			unitValue.value === 'func' &&
			inputValue !== ''
		) {
			const extractedValue = extractNumberAndUnit(inputValue);

			setUnitValue(getUnitByValue(newUnitValue, units));

			if (extractedValue.unit !== 'func') {
				setInputValue(extractedValue.value);
			} else {
				setInputValue('');
			}
			return;
		}

		// old unit is func and new is not
		// then extract number value from value and keep it for next change
		if (
			isSpecialUnit(newUnitValue) &&
			!isSpecialUnit(unitValue.value) &&
			unitValue.value === 'func'
		) {
			const extractedValue = extractNumberAndUnit(inputValue);
			setInputValue(extractedValue.value); // save value for next change
			setUnitValue(getUnitByValue(newUnitValue, units));
			return;
		}

		if (
			newUnitValue === 'func' &&
			isSpecialUnit(unitValue.value) &&
			inputValue !== ''
		) {
			setInputValue('');
			setUnitValue(getUnitByValue(newUnitValue, units));
			return;
		}

		setUnitValue(getUnitByValue(newUnitValue, units));

		// old unit is special && current is not && value is empty
		// then try to catch value from default value
		if (
			isSpecialUnit(unitValue.value) &&
			!isSpecialUnit(newUnitValue) &&
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
		if (validator) {
			let isValid = false;

			if (isFunction(validator)) {
				isValid = validator(value);
			}

			// Update isValidValue based on the result of validation
			setIsValidValue(isValid);

			return undefined;
		}

		if (!isEquals(initialUnit, unitValue)) {
			setUnitValue(initialUnit);
		}

		if (extractedValue?.value !== inputValue) {
			setInputValue(extractedValue.value);
		}

		return undefined;
	}, [value]); // eslint-disable-line

	const [isMaximizeVisible, setIsMaximizeVisible] = useState('');

	const toggleIsMaximizeVisible = () => {
		setIsMaximizeVisible((state) => !state);
	};

	function getInputActions() {
		return (
			<>
				<ConditionalWrapper
					condition={!disabled}
					wrapper={(children) => (
						<Tooltip text={__('Select Unit', 'publisher-core')}>
							{children}
						</Tooltip>
					)}
				>
					<select
						disabled={disabled}
						onChange={(e) => onChangeSelect(e.target.value)}
						value={unitValue.value}
						className={controlInnerClassNames(
							'unit-select',
							!isSpecialUnit(unitValue.value) && 'hide-arrow',
							'unit-length-' + unitValue.value.length,
							'unit-' + unitValue.value
						)}
						aria-label={__('Select Unit', 'publisher-blocks')}
					>
						{units.map((unit, key) => (
							<>
								{!isUndefined(unit?.options) ? (
									<optgroup label={unit.label}>
										{unit?.options.map((_unit, _key) => (
											<option
												key={_key}
												value={_unit?.value}
											>
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
								<option
									key={unitValue.value}
									value={unitValue.value}
								>
									{unitValue.label}
								</option>
							)}
					</select>
				</ConditionalWrapper>

				{unitValue.value === 'func' && (
					<>
						{!['small', 'extra-small', 'input'].includes(size) && (
							<Button
								size="input"
								onClick={() => {
									toggleIsMaximizeVisible();
								}}
								className={controlInnerClassNames(
									'maximise-btn',
									isMaximizeVisible && 'is-open-popover'
								)}
								noBorder={true}
								showTooltip={!disabled}
								label={__('Open Editor', 'publisher-core')}
								disabled={disabled}
							>
								<MaximizeIcon />
							</Button>
						)}

						{isMaximizeVisible && (
							<Popover
								title={__(
									'CSS Functions and Vars',
									'publisher-core'
								)}
								offset={125}
								placement="left-start"
								className={controlInnerClassNames(
									'typography-popover'
								)}
								onClose={() => {
									setIsMaximizeVisible(false);
								}}
							>
								<TextAreaControl
									defaultValue={defaultValue}
									onChange={(value) => {
										setInputValue(value);
										return value;
									}}
									height={100}
								/>

								<NoticeControl
									type="information"
									style={{ marginTop: '10px' }}
								>
									{__(
										'You can use CSS functions like calc, min, max, etc., and also CSS variables.',
										'publisher-core'
									)}
								</NoticeControl>
							</Popover>
						)}
					</>
				)}
			</>
		);
	}

	return (
		<div
			className={controlClassNames(
				'input',
				'input-unit',
				isSpecialUnit(unitValue?.value) &&
					'publisher-control-unit-special',
				'publisher-control-unit-' + unitValue.value,
				isActiveRange && 'is-range-active',
				isMaximizeVisible && 'is-focused',
				className
			)}
		>
			{!isSpecialUnit(unitValue?.value) ? (
				<>
					{unitValue.value === 'func' &&
					['small', 'extra-small'].includes(size) ? (
						<>
							<span
								className={controlClassNames(
									'input-tag',
									'input-tag-placeholder',
									noBorder && 'no-border',
									className
								)}
								aria-label={__('Open Editor', 'publisher-core')}
								onClick={() => {
									toggleIsMaximizeVisible();
								}}
							>
								{__('Edit', 'publisher-core')}
							</span>

							<div
								className={controlInnerClassNames(
									'input-actions'
								)}
							>
								{getInputActions()}
							</div>
						</>
					) : (
						<>
							{unitValue.format === 'number' ? (
								<NumberInput
									value={inputValue}
									disabled={disabled}
									className={controlInnerClassNames(
										'single-input',
										noBorder && 'no-border',
										!isValidValue && 'invalid'
									)}
									min={min}
									max={max}
									setValue={setInputValue}
									range={isActiveRange}
									drag={drag}
									float={float}
									arrows={arrows}
									size={size}
									actions={getInputActions()}
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
									actions={getInputActions()}
									{...props}
									type={unitValue?.format}
								/>
							)}
						</>
					)}
				</>
			) : (
				<>{getInputActions()}</>
			)}
			{children}
		</div>
	);
}
