// @flow
/**
 * External dependencies
 */
import PropTypes from 'prop-types';
import type { MixedElement } from 'react';

/**
 * Publisher dependencies
 */
import { isEmpty, isUndefined } from '@publisher/utils';
import { controlClassNames } from '@publisher/classnames';
import { useValueAddon } from '@publisher/hooks';

/**
 * Internal dependencies
 */
import { useControlContext } from '../../context';
import { BaseControl } from './../index';
import { UnitInput } from './components/unit-input';
import { OtherInput } from './components/other-input';
import { NumberInput } from './components/number-input';
import { getCSSUnits } from './utils';
import type { InputControlProps } from './types';

export default function InputControl({
	unitType = '',
	units = [],
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
	dynamicValueTypes,
	//
	children,
	...props
}: InputControlProps): MixedElement {
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

	const {
		valueAddonClassNames,
		isSetValueAddon,
		ValueAddonControl,
		ValueAddonPointer,
	} = useValueAddon({
		types: controlAddonTypes,
		value,
		setValue: (newValue: any): void => {
			setValue({
				value,
				valueAddon: newValue,
			});
		},
		variableTypes,
		dynamicValueTypes,
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

	// add css units
	if (unitType !== '' && (isUndefined(units) || isEmpty(units))) {
		units = getCSSUnits(unitType);
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
					range={range}
					units={units}
					value={value}
					setValue={setValue}
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
