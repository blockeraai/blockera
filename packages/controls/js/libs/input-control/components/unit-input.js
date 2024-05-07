// @flow
/**
 * External dependencies
 */
import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import type { MixedElement } from 'react';

/**
 * Blockera dependencies
 */
import {
	controlClassNames,
	controlInnerClassNames,
} from '@blockera/classnames';
import {
	isEquals,
	isFunction,
	isUndefined,
	useLateEffect,
} from '@blockera/utils';
import {
	Popover,
	Button,
	Tooltip,
	ConditionalWrapper,
} from '@blockera/components';

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
import { ControlContextProvider } from '../../../context';

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

	// this state used to cache last unit value
	// because while value is empty, control should be on the user selected unit and not reset
	const [unitCache, setUnitCache] = useState(initialUnit);

	const [inputValue, setInputValue] = useState(extractedValue.value);

	useLateEffect(() => {
		if (isSpecialUnit(unitValue.value) && value !== unitValue.value) {
			setValue(unitValue.value);
		} else if (inputValue === '' && value) {
			setValue('');
			setUnitCache(unitValue);
		} else if (
			(extractedNoUnit || !value) &&
			inputValue &&
			(unitValue.value || extractedValue.unit === '')
		) {
			setValue(inputValue + unitValue.value);
		} else if (!extractedNoUnit && value && value !== unitValue.value) {
			setValue(inputValue + unitValue.value);
		}
	}, [unitValue, inputValue]); // eslint-disable-line

	// validator checking
	useLateEffect(() => {
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
			if (value === '') {
				setUnitValue(unitCache);
			} else {
				setUnitValue(initialUnit);
			}
		}

		if (extractedValue?.value !== inputValue && '' !== inputValue) {
			setInputValue(extractedValue.value);
		}

		if (extractedValue?.value && '' === inputValue) {
			setInputValue(extractedValue.value);
		}

		return undefined;
	}, [value]); // eslint-disable-line

	const onChangeSelect = (newUnitValue: string) => {
		// new unit is func
		// then append old unit to value and show it in the input
		if (
			newUnitValue === 'func' &&
			inputValue !== '' &&
			!isSpecialUnit(unitValue.value)
		) {
			setUnitCache(getUnitByValue(newUnitValue, units));
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
			setUnitCache(getUnitByValue(newUnitValue, units));

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
			setUnitCache(getUnitByValue(newUnitValue, units));
			return;
		}

		if (
			newUnitValue === 'func' &&
			isSpecialUnit(unitValue.value) &&
			inputValue !== ''
		) {
			setInputValue('');
			setUnitValue(getUnitByValue(newUnitValue, units));
			// setUnitCache(getUnitByValue(newUnitValue, units));
			return;
		}

		setUnitValue(getUnitByValue(newUnitValue, units));
		setUnitCache(getUnitByValue(newUnitValue, units));

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
						<Tooltip text={__('Select Unit', 'blockera')}>
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
						aria-label={__('Select Unit', 'blockera')}
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
								label={__('Open Editor', 'blockera')}
								disabled={disabled}
							>
								<MaximizeIcon />
							</Button>
						)}

						{isMaximizeVisible && (
							<Popover
								title={__('CSS Functions and Vars', 'blockera')}
								offset={125}
								placement="left-start"
								className={controlInnerClassNames(
									'typography-popover'
								)}
								onClose={() => {
									setIsMaximizeVisible(false);
								}}
							>
								<ControlContextProvider
									value={{
										name: 'unit-textarea',
										value: inputValue,
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
								</ControlContextProvider>

								<NoticeControl
									type="information"
									style={{ marginTop: '10px' }}
								>
									{__(
										'You can use CSS functions like calc, min, max, etc., and also CSS variables.',
										'blockera'
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
					'blockera-control-unit-special',
				'blockera-control-unit-' + unitValue.value,
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
								aria-label={__('Open Editor', 'blockera')}
								onClick={() => {
									toggleIsMaximizeVisible();
								}}
							>
								{__('Edit', 'blockera')}
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