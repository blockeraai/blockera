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
	onVariableShortcut,
	...props
}: {
	...InputControlProps,
	inputValue: string,
	unitValue: Object,
	onVariableShortcut: () => void,
}): MixedElement {
	const [isMaximizeVisible, setIsMaximizeVisible] = useState(false);
	const [typedValue, setTypedValue] = useState(inputValue);
	const unitUpdateTimeout = useRef(null);
	const inputRef = useRef(null);

	useEffect(() => {
		setTypedValue(inputValue);
	}, [inputValue, unitValue]);

	const handleInputChange = (e: { target: { value: string } }) => {
		const value = e.target.value;
		setTypedValue(value); // Show exactly what user types

		// First check if the value is just a minus sign or minus zero
		if (value === '-' || value === '-0') {
			// Allow typing minus sign even if min is >= 0, we'll validate on blur
			return;
		}

		// Special case for "--" to open variable picker
		if (onVariableShortcut && value.endsWith('--')) {
			onVariableShortcut();
			return;
		}

		// Check if it's a valid number (including negative and decimal)
		const numericMatch = value.match(/^-?\d*?\d*$/);
		if (numericMatch && value !== '') {
			const numValue = Number(value);
			if (!isNaN(numValue)) {
				// Apply constraints if it's a valid number
				let constrainedValue = value;
				if (!isEmpty(min) && numValue < Number(min)) {
					constrainedValue = String(min);
					setTypedValue(constrainedValue);
				}
				if (!isEmpty(max) && numValue > Number(max)) {
					constrainedValue = String(max);
					setTypedValue(constrainedValue);
				}

				onChange?.({
					unitValue,
					inputValue: constrainedValue,
				});
				return;
			}
		}

		// Check if the value contains potential unit characters or calculation operators
		if (
			value.match(/[a-zA-Z%\+\-\*\/\.\s]/) &&
			!value.match(/^-?\d*?\d*$/)
		) {
			// Clear any existing timeout
			if (unitUpdateTimeout.current) {
				clearTimeout(unitUpdateTimeout.current);
			}

			// Set a timeout only for unit extraction or calculation
			unitUpdateTimeout.current = setTimeout(() => {
				// First check for valid number with unit
				const match = value.match(/^(-?\d*\.?\d*)([a-zA-Z%]+)?$/);
				if (match) {
					const [, numericValue = '', unit = ''] = match;

					// Normalize decimal value
					const normalizedValue = normalizeDecimalValue(numericValue);

					// Apply constraints
					let constrainedValue = normalizedValue;
					const numValue = Number(normalizedValue);
					if (!isNaN(numValue)) {
						if (!isEmpty(min) && numValue < Number(min)) {
							constrainedValue = String(min);
						}
						if (!isEmpty(max) && numValue > Number(max)) {
							constrainedValue = String(max);
						}
					}

					// If there's a unit, update it
					if (unit) {
						const newUnitValue = getUnitByValue(unit, units);
						if (newUnitValue) {
							// Update both unit and numeric value
							onChangeSelect(unit);
							setTypedValue(constrainedValue);
							if (typeof onChange === 'function') {
								onChange({
									unitValue: newUnitValue,
									inputValue: constrainedValue,
								});
							}
						}
					}
				}
			}, 300);
		} else {
			// Clear any existing timeout
			if (unitUpdateTimeout.current) {
				clearTimeout(unitUpdateTimeout.current);
			}

			// No unit characters or operators found, update immediately
			onChange?.({
				unitValue,
				inputValue: value,
			});
		}
	};

	const normalizeDecimalValue = (value: string): string => {
		if (value === '') return '';
		if (!value.includes('.')) return value;
		return value.replace(/\.?0+$/, '');
	};

	const evaluateCalculation = (value: string) => {
		if (!isSpecialUnit(unitValue?.value) && unitValue.value !== 'func') {
			// Ensure value is a string
			const stringValue = String(value);
			const calcMatch = stringValue.match(
				/^(-?\d*\.?\d*)\s*([\+\-\/\*])\s*(-?\d*\.?\d*)$/
			);
			if (calcMatch) {
				const [, num1 = '', operator, num2 = ''] = calcMatch;
				const n1 = parseFloat(num1);
				const n2 = parseFloat(num2);

				if (!isNaN(n1) && !isNaN(n2)) {
					let result;
					switch (operator) {
						case '+':
							result = n1 + n2;
							break;
						case '-':
							result = n1 - n2;
							break;
						case '/':
							result = n2 !== 0 ? n1 / n2 : n1;
							break;
						case '*':
							result = n1 * n2;
							break;
						default:
							result = n1;
					}

					// Round to 6 decimal places and remove trailing zeros
					const roundedResult = Number(result.toFixed(6));

					// Apply min/max constraints to the calculation result
					let constrainedResult = roundedResult;
					if (!isEmpty(min) && constrainedResult < Number(min)) {
						constrainedResult = Number(min);
					}
					if (!isEmpty(max) && constrainedResult > Number(max)) {
						constrainedResult = Number(max);
					}

					// Normalize decimal result
					const normalizedResult = normalizeDecimalValue(
						String(constrainedResult)
					);

					setTypedValue(normalizedResult);
					if (typeof onChange === 'function') {
						onChange({
							unitValue,
							inputValue: normalizedResult,
						});
					}
					return true;
				}
			}
		}
		return false;
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

			// Normalize decimal value
			const normalizedValue = normalizeDecimalValue(numericValue);

			// Apply min/max constraints
			let constrainedValue = normalizedValue;
			const numValue = Number(normalizedValue);
			if (!isNaN(numValue)) {
				if (!isEmpty(min) && numValue < Number(min)) {
					constrainedValue = String(min);
				}
				if (!isEmpty(max) && numValue > Number(max)) {
					constrainedValue = String(max);
				}
			}

			// Update the input value immediately
			setTypedValue(constrainedValue);

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
					inputValue: constrainedValue,
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
					onMouseDown: (event: MouseEvent) => {
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

		// Handle calculations on Enter key
		if (event.key === 'Enter') {
			event.preventDefault();

			if (!evaluateCalculation(typedValue)) {
				// Ensure typedValue is a string before using match
				const stringValue = String(typedValue || '');

				// Check for incomplete calculation pattern and normalize
				const incompleteMatch = stringValue.match(
					/^(-?\d*\.?\d*)\s*[\+\-\/\*]?\s*$/
				);

				if (incompleteMatch && incompleteMatch[1]) {
					const normalizedValue = normalizeDecimalValue(
						incompleteMatch[1]
					);
					if (!isNaN(Number(normalizedValue))) {
						setTypedValue(normalizedValue);
						if (typeof onChange === 'function') {
							onChange({
								unitValue,
								inputValue: normalizedValue,
							});
						}
						return;
					}
				}

				// Clear value if no valid number found
				setTypedValue('');

				if (typeof onChange === 'function') {
					onChange({
						unitValue,
						inputValue: '',
					});
				}
			}
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

				const normalizedIncrementedValue = normalizeDecimalValue(
					String(incrementedValue)
				);
				setTypedValue(normalizedIncrementedValue);
				if (typeof onChange === 'function') {
					onChange({
						unitValue,
						inputValue: normalizedIncrementedValue,
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

				const normalizedDecrementedValue = normalizeDecimalValue(
					String(decrementedValue)
				);
				setTypedValue(normalizedDecrementedValue);
				if (typeof onChange === 'function') {
					onChange({
						unitValue,
						inputValue: normalizedDecrementedValue,
					});
				}
				break;
		}
	};

	// Add this handler inside UnitInput component
	const handleCopy = (e: ClipboardEvent) => {
		if (
			!isSpecialUnit(unitValue?.value) &&
			unitValue.value !== 'func' &&
			inputRef.current &&
			e.clipboardData
		) {
			e.preventDefault();

			const selection =
				inputRef.current.ownerDocument.defaultView.getSelection();

			const selectedText = selection ? selection.toString() : '';

			const textToCopy = selectedText || typedValue;

			//$FlowFixMe
			e.clipboardData.setData(
				'text/plain',
				`${textToCopy}${unitValue.value}`
			);
		}
	};

	const handleBlur = () => {
		// First try to evaluate any complete calculation
		if (evaluateCalculation(typedValue) || 0 === typedValue) {
			return;
		}

		// Ensure typedValue is a string before using match
		const stringValue = String(typedValue || '');

		// Remove any spaces from the input
		const noSpacesValue = stringValue.replace(/\s+/g, '');

		// Check for incomplete calculation pattern (number followed by operator)
		const incompleteMatch = noSpacesValue.match(
			/^(-?\d*\.?\d*)\s*[\+\-\/\*]?\s*$/
		);
		if (incompleteMatch && incompleteMatch[1]) {
			// Normalize the number and apply constraints
			let normalizedValue = String(Number(incompleteMatch[1]));
			if (!isNaN(Number(normalizedValue))) {
				// Apply min/max constraints
				if (!isEmpty(min) && Number(normalizedValue) < Number(min)) {
					normalizedValue = String(min);
				}
				if (!isEmpty(max) && Number(normalizedValue) > Number(max)) {
					normalizedValue = String(max);
				}

				setTypedValue(normalizedValue);
				if (
					typeof onChange === 'function' &&
					inputValue !== Number(normalizedValue)
				) {
					onChange({
						unitValue,
						inputValue: normalizedValue,
					});
				}
				return;
			}
		}

		// If no valid number found, clear the input
		setTypedValue('');
		if (typeof onChange === 'function') {
			onChange({
				unitValue,
				inputValue: '',
			});
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
														? (value) => value
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
																	const normalizedValue =
																		normalizeDecimalValue(
																			String(
																				numValue
																			)
																		);
																	setTypedValue(
																		normalizedValue
																	);
																	if (
																		typeof onChange ===
																		'function'
																	) {
																		onChange(
																			{
																				unitValue,
																				inputValue:
																					normalizedValue,
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
										ref={inputRef}
										type="text"
										value={typedValue}
										onChange={handleInputChange}
										onPaste={handlePaste}
										onKeyDown={handleKeyDown}
										onBlur={handleBlur}
										onCopy={handleCopy}
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
