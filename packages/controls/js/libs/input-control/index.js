// @flow
/**
 * External dependencies
 */
import PropTypes from 'prop-types';
import { __ } from '@wordpress/i18n';
import type { MixedElement } from 'react';
import { useState, useEffect } from '@wordpress/element';

/**
 * Blockera dependencies
 */
import { isEmpty, isUndefined } from '@blockera/utils';
import { controlClassNames } from '@blockera/classnames';

/**
 * Internal dependencies
 */
import { setValueAddon, useValueAddon } from '../../';
import type { InputControlProps } from './types';
import { UnitInput } from './components/unit-input';
import { OtherInput } from './components/other-input';
import { NumberInput } from './components/number-input';
import { BaseControl, getFirstUnit, getUnitByValue } from './../index';
import { ControlContextProvider, useControlContext } from '../../context';
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
		controlInfo: { name: controlId },
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

	const contextValue: ContextUnitInput = {
		unitValue,
		inputValue: extractedValue.value,
	};

	useEffect(() => {
		// add css units
		if (unitType !== '') {
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
				<ControlContextProvider
					value={{
						value: contextValue,
						name: `${controlId}-${id || ''}-${
							singularId || ''
						}-unit-input`,
					}}
				>
					<UnitInput
						isValidValue={isValidValue}
						range={range}
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
										'founded_from_inputs' ===
											unitPackage?.id &&
										!unitPackage?.options.includes(
											unitValue
										)
									) {
										const newUnits = [...units];

										newUnits[index].options.push(unitValue);

										setUnits(newUnits);
									}
								});

								if ('' !== value && !inputValue) {
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
								inputValue &&
								(unitValue.value || extractedValue.unit === '')
							) {
								setValue(inputValue + unitValue.value);
							} else if (
								!extractedNoUnit &&
								value &&
								value !== unitValue.value &&
								'' !== inputValue
							) {
								setValue(inputValue + unitValue.value);
							} else if ('' === inputValue && value) {
								if (!isSpecialUnit(pickedUnit.value)) {
									setPickedUnit(unitValue);
								}
								setValue(inputValue);
							}
						}}
						{...props}
					>
						<ValueAddonPointer />
					</UnitInput>
				</ControlContextProvider>
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

InputControl.propTypes = {
	/**
	 * ID for retrieving value from control context
	 */
	id: PropTypes.string,
	/**
	 * It sets the control default value if the value not provided. By using it the control will not fire onChange event for this default value on control first render,
	 */
	defaultValue: PropTypes.string,
	/**
	 * Function that will be fired while the control value state changes.
	 */
	onChange: PropTypes.func,
	/**
	 * Sets to show range control for input or not
	 */
	range: PropTypes.bool,
	/**
	 * Show up and down arrow buttons or not
	 */
	arrows: PropTypes.bool,
	/**
	 * Type of CSS units from presets
	 */
	//$FlowFixMe
	unitType: PropTypes.oneOf([
		'outline',
		'text-shadow',
		'box-shadow',
		'background-size',
		'letter-spacing',
		'text-indent',
		'background-position',
		'duration',
		'angle',
		'percent',
		'width',
		'essential',
		'general',
		'order',
		'custom',
		'flex-grow',
		'flex-shrink',
		'fex-basis',
		'line-height',
	]),
	/**
	 * Indicates units for showing unit for value.
	 */
	//$FlowFixMe
	units: PropTypes.arrayOf(
		PropTypes.shape({
			value: PropTypes.string,
			label: PropTypes.string,
			default: PropTypes.number,
		})
	),
	/**
	 * By using this you can prevent the control to show the border and outline shape.
	 */
	noBorder: PropTypes.bool,
	/**
	 * By using this you can disable the control.
	 */
	disabled: PropTypes.bool,
	/**
	 * The minimum `value` allowed.
	 */
	//$FlowFixMe
	min: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
	/**
	 * The maximum `value` allowed.
	 */
	//$FlowFixMe
	max: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
	/**
	 * check the `input`,  A function used to validate input values.
	 */
	//$FlowFixMe
	validator: PropTypes.oneOfType([
		PropTypes.func,
		PropTypes.arrayOf(
			PropTypes.oneOf([
				'calc',
				'max',
				'min',
				'translate',
				'scale',
				'rotate',
				'rgb',
				'rgba',
				'hsl',
				'hsla',
				'skew',
				'var',
				'attr',
			])
		),
	]),
};
