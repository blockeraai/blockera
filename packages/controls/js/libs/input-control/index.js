// @flow

/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import type { MixedElement } from 'react';
import { useState, useEffect } from '@wordpress/element';

/**
 * Blockera dependencies
 */
import { controlClassNames } from '@blockera/classnames';
import { isEmpty, isUndefined } from '@blockera/utils';

/**
 * Internal dependencies
 */
import type { InputControlProps } from './types';
import { useControlContext } from '../../context';
import { UnitInput } from './components/unit-input';
import { setValueAddon, useValueAddon } from '../../';
import { OtherInput } from './components/other-input';
import { NumberInput } from './components/number-input';
import { BaseControl, getFirstUnit, getUnitByValue } from './../index';
import { extractNumberAndUnit, getCSSUnits, isSpecialUnit } from './utils';

export type ContextUnitInput = {
	unitValue: Object,
	inputValue: string,
};

export default function InputControl({
	unitType = '',
	units: _units = [],
	noBorder = false,
	id,
	range = false,
	label,
	columns,
	defaultValue = '',
	onChange = () => {},
	field = 'input',
	className = '',
	type = 'text',
	min,
	max,
	validator,
	disabled = false,
	drag = true,
	float = true,
	arrows = false,
	size = 'normal',
	labelDescription,
	labelPopoverTitle,
	//
	singularId,
	repeaterItem,
	controlAddonTypes,
	variableTypes,
	//
	children,
	...props
}: InputControlProps): MixedElement {
	let isValidValue = true;
	const [units, setUnits] = useState(
		isEmpty(_units) ? getCSSUnits(unitType) : _units
	);
	const [pickedUnit, setPickedUnit] = useState(getFirstUnit(units));
	const {
		value,
		setValue,
		attribute,
		blockName,
		resetToDefault,
		getControlPath,
	} = useControlContext({
		id,
		defaultValue,
		onChange,
	});

	if ('function' === typeof validator) {
		isValidValue = validator(value);
	}

	const {
		valueAddonClassNames,
		isSetValueAddon,
		ValueAddonControl,
		ValueAddonPointer,
	} = useValueAddon({
		types: controlAddonTypes,
		value,
		setValue: (newValue: any): void =>
			setValueAddon(newValue, setValue, defaultValue),
		variableTypes,
		onChange: setValue,
		size,
	});

	const labelProps = {
		value,
		singularId,
		attribute,
		blockName,
		label,
		labelDescription,
		labelPopoverTitle,
		repeaterItem,
		defaultValue,
		resetToDefault,
		mode: 'advanced',
		path: getControlPath(attribute, id),
	};

	const extractedValue = extractNumberAndUnit(value);

	// Unit is not provided and there is a unit with empty value
	// clear unit to let the empty unit be selected
	if (extractedValue?.unitSimulated && pickedUnit.value === '') {
		extractedValue.unit = '';
	}

	const extractedNoUnit =
		isUndefined(extractedValue.unit) || extractedValue.unit === '';
	const unitValue = extractedNoUnit
		? pickedUnit
		: getUnitByValue(extractedValue.unit, units);

	useEffect(() => {
		// add css units
		if (!isEmpty(unitType)) {
			const cssUnits: Array<any> = getCSSUnits(unitType);

			if (unitValue?.notFound) {
				const newUnits = [
					...cssUnits,
					{
						options: [unitValue],
						id: 'founded_from_inputs',
						label: __('Founded From Inputs', 'blockera'),
					},
				];

				setUnits(newUnits);
				setPickedUnit(unitValue);
			}
		}
		// eslint-disable-next-line
	}, []);

	if (isSetValueAddon()) {
		return (
			<BaseControl
				columns={columns}
				controlName={field}
				className={className}
				{...labelProps}
			>
				<div
					className={controlClassNames(
						'input',
						range && 'input-range',
						noBorder && 'no-border',
						className,
						valueAddonClassNames
					)}
				>
					<ValueAddonControl />
					{children}
				</div>
			</BaseControl>
		);
	}

	return (
		<BaseControl
			label={label}
			columns={columns}
			controlName={field}
			className={className + ' ' + valueAddonClassNames}
			{...labelProps}
		>
			{!isEmpty(units) ? (
				<UnitInput
					isValidValue={isValidValue}
					range={range}
					inputValue={extractedValue.value}
					unitValue={unitValue}
					units={units}
					defaultValue={defaultValue}
					noBorder={noBorder}
					className={className + ' ' + valueAddonClassNames}
					disabled={disabled}
					validator={validator}
					min={min}
					max={max}
					drag={drag}
					float={float}
					arrows={arrows}
					size={size}
					children={children}
					onChange={(newValue: ContextUnitInput): void => {
						const { inputValue, unitValue } = newValue;

						// to append founded not listed units by defaults in units from user input values.
						if (unitValue?.notFound) {
							units.forEach((unitPackage, index): void => {
								if (
									'founded_from_inputs' === unitPackage?.id &&
									!unitPackage?.options.includes(unitValue)
								) {
									const newUnits = [...units];

									newUnits[index].options.push(unitValue);

									setUnits(newUnits);
								}
							});

							if (!isEmpty(value) && !inputValue) {
								setPickedUnit(unitValue);
							}
						}

						if (
							isSpecialUnit(unitValue.value) &&
							value !== unitValue.value
						) {
							setValue(unitValue.value);
						} else if (
							(extractedNoUnit || !value) &&
							'' !== inputValue &&
							(unitValue.value || extractedValue.unit === '')
						) {
							setValue(inputValue + unitValue.value);
						} else if (
							!extractedNoUnit &&
							value &&
							value !== unitValue.value &&
							!isEmpty(inputValue)
						) {
							setValue(inputValue + unitValue.value);
						} else if (
							(isEmpty(inputValue) && value) ||
							(isEmpty(inputValue) && '' === value)
						) {
							setPickedUnit(unitValue);
							setValue(inputValue);
						}
					}}
					{...props}
				>
					<ValueAddonPointer />
				</UnitInput>
			) : (
				<>
					{type === 'number' ? (
						<div
							className={controlClassNames(
								'input',
								'input-number',
								range &&
									!['small', 'extra-small'].includes(size) &&
									'is-range-active',
								className,
								valueAddonClassNames
							)}
						>
							<NumberInput
								value={value}
								setValue={setValue}
								noBorder={noBorder}
								disabled={disabled}
								validator={validator}
								isValidValue={isValidValue}
								min={min}
								max={max}
								range={range}
								drag={drag}
								float={float}
								arrows={arrows}
								size={size}
								{...props}
							>
								<ValueAddonPointer />
							</NumberInput>
							{children}
						</div>
					) : (
						<div
							className={controlClassNames(
								'input',
								'input-' + type,
								className,
								valueAddonClassNames
							)}
						>
							<OtherInput
								value={value}
								setValue={setValue}
								isValidValue={isValidValue}
								type={type}
								noBorder={noBorder}
								disabled={disabled}
								validator={validator}
								{...props}
							>
								<ValueAddonPointer />
							</OtherInput>
							{children}
						</div>
					)}
				</>
			)}
		</BaseControl>
	);
}
