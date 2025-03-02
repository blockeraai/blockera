// @flow
/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import type { MixedElement } from 'react';
import { useState, Fragment, useRef, useEffect } from '@wordpress/element';

/**
 * Blockera dependencies
 */
import {
	controlClassNames,
	controlInnerClassNames,
} from '@blockera/classnames';
import { isUndefined, isEmpty, useDragValue } from '@blockera/utils';
import { Icon } from '@blockera/icons';

/**
 * Internal dependencies
 */
import { OtherInput } from './other-input';
import NoticeControl from '../../notice-control';
import type { InputControlProps } from '../types';
import TextAreaControl from '../../textarea-control';
import { ControlContextProvider } from '../../../context';
import { Popover, Button, Tooltip, ConditionalWrapper } from '../../';
import { RangeControl } from '../../index';
import { isSpecialUnit, getUnitByValue, extractNumberAndUnit } from '../utils';
import { InputArrows } from './input-arrows';

export function UnitInput({
	defaultValue,
	range,
	noBorder,
	className,
	units = [],
	disabled,
	min,
	max,
	drag,
	arrows,
	size,
	children,
	onChange,
	unitValue,
	inputValue,
	isValidValue,

	...props
}: {
	...InputControlProps,
	inputValue: string,
	unitValue: Object,
}): MixedElement {
	const [isMaximizeVisible, setIsMaximizeVisible] = useState(false);
	const [typedValue, setTypedValue] = useState(inputValue);
	const unitUpdateTimeout = useRef(null);

	useEffect(() => {
		setTypedValue(inputValue);
	}, [inputValue, unitValue]);

	const handleInputChange = (e: { target: { value: string } }) => {
		const value = e.target.value;
		setTypedValue(value); // Show exactly what user types

		// Extract potential unit from input
		const match = value.match(/^(-?\d*\.?\d*)([a-zA-Z%]+)?$/);
		if (match) {
			const [, numericValue = '', unit = ''] = match;

			// Clear any existing timeout
			if (unitUpdateTimeout.current) {
				clearTimeout(unitUpdateTimeout.current);
			}

			// If there's a unit, set a timeout to update it
			if (unit) {
				unitUpdateTimeout.current = setTimeout(() => {
					const newUnitValue = getUnitByValue(unit, units);
					if (newUnitValue) {
						// Update both unit and numeric value after timeout
						onChangeSelect(unit);
						setTypedValue(numericValue);
						if (typeof onChange === 'function') {
							onChange({
								unitValue: newUnitValue,
								inputValue: numericValue,
							});
						}
					}
				}, 300);
			} else if (typeof onChange === 'function') {
				// If no unit, just update the numeric value
				onChange({
					unitValue,
					inputValue: numericValue || value,
				});
			}
		}
	};

	const handlePaste = (e: {
		clipboardData: { getData: (type: string) => string },
		preventDefault: () => void,
	}) => {
		const pastedText = e.clipboardData.getData('text');
		const match = pastedText.match(/^(-?\d*\.?\d*)([a-zA-Z%]+)?$/);

		if (match) {
			e.preventDefault();
			const [, numericValue = '', unit = ''] = match;

			// Update the input value immediately
			setTypedValue(numericValue);

			// If there's a unit, update it
			if (unit) {
				const newUnitValue = getUnitByValue(unit, units);
				if (newUnitValue) {
					onChangeSelect(unit);
				}
			}

			if (typeof onChange === 'function') {
				onChange({
					unitValue: unit ? getUnitByValue(unit, units) : unitValue,
					inputValue: numericValue,
				});
			}
		}
	};

	const onChangeSelect = (newUnitValue: string) => {
		if ('undefined' === typeof onChange) {
			return;
		}

		newUnitValue = getUnitByValue(newUnitValue, units);

		// new unit is func
		// then append old unit to value and show it in the input
		if (
			newUnitValue.value === 'func' &&
			inputValue !== '' &&
			!isSpecialUnit(unitValue.value)
		) {
			return onChange({
				unitValue: newUnitValue,
				inputValue: inputValue + unitValue.value,
			});
		}

		// old unit is func and new unit is not special
		// extract number from old input value (func value)
		if (
			!isSpecialUnit(newUnitValue.value) &&
			unitValue.value === 'func' &&
			inputValue !== ''
		) {
			const extractedValue = extractNumberAndUnit(inputValue);

			return onChange({
				unitValue: newUnitValue,
				inputValue:
					'func' !== extractedValue.unit ? extractedValue.value : '',
			});
		}

		// old unit is func and new is not
		// then extract number value from value and keep it for next change
		if (
			isSpecialUnit(newUnitValue.value) &&
			!isSpecialUnit(unitValue.value) &&
			unitValue.value === 'func'
		) {
			const extractedValue = extractNumberAndUnit(inputValue);

			return onChange({
				unitValue: newUnitValue,
				inputValue: extractedValue.value,
			});
		}

		if (
			newUnitValue.value === 'func' &&
			isSpecialUnit(unitValue.value) &&
			inputValue !== ''
		) {
			return onChange({
				inputValue: '',
				unitValue: newUnitValue,
			});
		}

		onChange({
			inputValue,
			unitValue:
				'' === inputValue &&
				'' !== defaultValue &&
				!isSpecialUnit(unitValue.value) &&
				isSpecialUnit(newUnitValue.value)
					? extractNumberAndUnit(defaultValue).value
					: newUnitValue,
		});
	};

	const isActiveRange =
		range && !isSpecialUnit(unitValue.value) && unitValue.value !== 'func';

	const onChangeValue = (
		newValue: string,
		_isMaximizeVisible: boolean = false
	): void => {
		setIsMaximizeVisible(_isMaximizeVisible);

		if ('undefined' === typeof onChange) {
			return;
		}

		return onChange({
			unitValue,
			inputValue: newValue,
		});
	};

	// Add drag value hook
	const { onDragStart, onDragEnd } = useDragValue({
		value: !isEmpty(inputValue) ? +inputValue : 0,
		setValue: (newValue) => {
			if (typeof onChange === 'function') {
				onChange({
					unitValue,
					inputValue: String(newValue),
				});
			}
		},
		movement: 'vertical',
		min,
		max,
	});

	// Add drag event handler
	const getDragEvent = () => {
		return drag && !disabled
			? {
					onMouseDown: (event) => {
						onDragStart(event);
					},
					onMouseUp: onDragEnd,
			  }
			: {};
	};

	// Add this function to handle arrow clicks
	const handleArrowClick = (newValue: number) => {
		if (typeof onChange === 'function') {
			onChange({
				unitValue,
				inputValue: String(newValue),
			});
		}
	};

	// Add this function to handle keyboard events
	const handleKeyDown = (event: KeyboardEvent) => {
		// Only handle if not a special unit and input has focus
		if (isSpecialUnit(unitValue?.value) || disabled) {
			return;
		}

		const currentValue = !isEmpty(typedValue) ? parseFloat(typedValue) : 0;
		const increment = event.shiftKey ? 10 : 1; // Use 10 if shift is pressed, otherwise 1

		switch (event.key) {
			case 'ArrowUp':
				event.preventDefault();
				let incrementedValue = currentValue + increment;

				// Check max constraint
				if (!isEmpty(max) && incrementedValue > Number(max)) {
					incrementedValue = Number(max);
				}

				setTypedValue(String(incrementedValue));
				if (typeof onChange === 'function') {
					onChange({
						unitValue,
						inputValue: String(incrementedValue),
					});
				}
				break;

			case 'ArrowDown':
				event.preventDefault();
				let decrementedValue = currentValue - increment;

				// Check min constraint
				if (!isEmpty(min) && decrementedValue < Number(min)) {
					decrementedValue = Number(min);
				}

				setTypedValue(String(decrementedValue));
				if (typeof onChange === 'function') {
					onChange({
						unitValue,
						inputValue: String(decrementedValue),
					});
				}
				break;
		}
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
						key={unitValue.value}
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
							<Fragment key={`${unit.label}-${key}`}>
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
									<option value={unit?.value}>
										{unit?.label}
									</option>
								)}
							</Fragment>
						))}
					</select>
				</ConditionalWrapper>

				{unitValue.value === 'func' && (
					<>
						{!['small', 'extra-small', 'input'].includes(size) && (
							<Button
								size="input"
								onClick={
									disabled
										? undefined
										: () =>
												setIsMaximizeVisible(
													!isMaximizeVisible
												)
								}
								className={controlInnerClassNames(
									'maximise-btn',
									isMaximizeVisible && 'is-open-popover',
									disabled && 'is-disabled'
								)}
								noBorder={true}
								showTooltip={!disabled}
								label={__('Open Editor', 'blockera')}
								disabled={disabled}
							>
								<Icon icon="maximize" iconSize="18" />
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
								onClose={() => setIsMaximizeVisible(false)}
							>
								<ControlContextProvider
									value={{
										name: 'unit-textarea',
										value: inputValue,
									}}
								>
									<TextAreaControl
										data-test={'Unit Text Aria'}
										defaultValue={defaultValue}
										onChange={(newValue) =>
											onChangeValue(newValue, true)
										}
										height={100}
									/>
								</ControlContextProvider>

								<NoticeControl
									type="information"
									style={{
										marginTop: '10px',
										marginBottom: '18px',
									}}
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
				disabled && 'is-disabled',
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
									disabled && 'is-disabled',
									className
								)}
								aria-label={__('Open Editor', 'blockera')}
								onClick={
									disabled
										? undefined
										: () =>
												setIsMaximizeVisible(
													!isMaximizeVisible
												)
								}
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
								<>
									{isActiveRange &&
										!['small', 'extra-small'].includes(
											size
										) && (
											<RangeControl
												withInputField={false}
												sideEffect={false}
												onChange={
													disabled
														? undefined
														: (newValue) => {
																const numValue =
																	typeof newValue ===
																	'string'
																		? parseFloat(
																				newValue
																		  )
																		: newValue;
																if (
																	!isNaN(
																		numValue
																	)
																) {
																	setTypedValue(
																		String(
																			numValue
																		)
																	);
																	if (
																		typeof onChange ===
																		'function'
																	) {
																		onChange(
																			{
																				unitValue,
																				inputValue:
																					String(
																						numValue
																					),
																			}
																		);
																	}
																}
																return newValue;
														  }
												}
												min={min}
												max={max}
												disabled={disabled}
												initialPosition={
													Number(typedValue) || 0
												}
											/>
										)}

									<input
										type="text"
										value={typedValue}
										onChange={handleInputChange}
										onPaste={handlePaste}
										onKeyDown={handleKeyDown}
										disabled={disabled}
										className={controlInnerClassNames(
											'input-tag',
											'input-tag-number',
											'single-input',
											noBorder && 'no-border',
											!isValidValue && 'invalid',
											drag && 'is-drag-active',
											disabled && 'is-disabled'
										)}
										min={min}
										max={max}
										{...(disabled ? {} : getDragEvent())}
										{...props}
									/>
								</>
							) : (
								<OtherInput
									value={inputValue}
									setValue={onChangeValue}
									isValidValue={isValidValue}
									onChange={
										disabled
											? undefined
											: (newValue) =>
													onChangeValue(newValue)
									}
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

							<div
								className={controlInnerClassNames(
									'input-actions'
								)}
							>
								{getInputActions()}

								{arrows &&
									unitValue.format === 'number' &&
									size !== 'extra-small' && (
										<InputArrows
											value={typedValue}
											setValue={handleArrowClick}
											disabled={disabled}
											min={min}
											max={max}
											size={size}
										/>
									)}
							</div>
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
