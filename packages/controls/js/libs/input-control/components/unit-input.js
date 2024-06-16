// @flow
/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import type { MixedElement } from 'react';
import { useState } from '@wordpress/element';

/**
 * Blockera dependencies
 */
import {
	controlClassNames,
	controlInnerClassNames,
} from '@blockera/classnames';
import { isUndefined } from '@blockera/utils';
import { Icon } from '@blockera/icons';

/**
 * Internal dependencies
 */
import { Popover, Button, Tooltip, ConditionalWrapper } from '../../';
import { OtherInput } from './other-input';
import { NumberInput } from './number-input';
import NoticeControl from '../../notice-control';
import type { InputControlProps } from '../types';
import TextAreaControl from '../../textarea-control';
import { ControlContextProvider, useControlContext } from '../../../context';
import { isSpecialUnit, getUnitByValue, extractNumberAndUnit } from '../utils';

export function UnitInput({
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
	onChange,
	isValidValue,
	...props
}: InputControlProps): MixedElement {
	const { value, setValue } = useControlContext({
		defaultValue,
		onChange,
	});
	const { unitValue, inputValue } = value;
	const [isMaximizeVisible, setIsMaximizeVisible] = useState(false);

	const onChangeSelect = (newUnitValue: string) => {
		newUnitValue = getUnitByValue(newUnitValue, units);

		// new unit is func
		// then append old unit to value and show it in the input
		if (
			newUnitValue.value === 'func' &&
			inputValue !== '' &&
			!isSpecialUnit(unitValue.value)
		) {
			return setValue({
				...value,
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

			return setValue({
				...value,
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

			return setValue({
				...value,
				unitValue: newUnitValue,
				inputValue: extractedValue.value,
			});
		}

		if (
			newUnitValue.value === 'func' &&
			isSpecialUnit(unitValue.value) &&
			inputValue !== ''
		) {
			return setValue({
				...value,
				inputValue: '',
				unitValue: newUnitValue,
			});
		}

		setValue({
			...value,
			inputValue,
			// old unit is special && current is not && value is empty
			// then try to catch value from default value
			unitValue:
				'' === inputValue &&
				'' !== defaultValue &&
				isSpecialUnit(unitValue.value) &&
				!isSpecialUnit(newUnitValue.value)
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
		setValue({
			...value,
			inputValue: newValue,
			unitValue:
				'' === newValue && unitValue?.notFound ? unitValue : unitValue,
		});
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
					</select>
				</ConditionalWrapper>

				{unitValue.value === 'func' && (
					<>
						{!['small', 'extra-small', 'input'].includes(size) && (
							<Button
								size="input"
								onClick={() =>
									setIsMaximizeVisible(!isMaximizeVisible)
								}
								className={controlInnerClassNames(
									'maximise-btn',
									isMaximizeVisible && 'is-open-popover'
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
								onClick={() =>
									setIsMaximizeVisible(!isMaximizeVisible)
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
								<NumberInput
									id={'inputValue'}
									value={inputValue}
									isValidValue={isValidValue}
									disabled={disabled}
									className={controlInnerClassNames(
										'single-input',
										noBorder && 'no-border',
										!isValidValue && 'invalid'
									)}
									min={min}
									max={max}
									setValue={onChangeValue}
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
									setValue={onChangeValue}
									isValidValue={isValidValue}
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
