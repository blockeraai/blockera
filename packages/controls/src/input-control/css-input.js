/**
 * External dependencies
 */
import PropTypes from 'prop-types';

/**
 * Publisher dependencies
 */
import { useValue } from '@publisher/utils';

/**
 * Internal dependencies
 */
import { InputControl } from './input';
import { isSpecialUnit } from './utils';

export function CssInputControl({
	unitType,
	units,
	noBorder,
	//
	defaultValue,
	value: initialValue,
	onChange,
	//
	className,
	...props
}) {
	const specialClassName = ' publisher-control-unit-special';
	const baseClassName = className || '';

	let cssUnits = units ? units : [];

	if (!cssUnits.length) {
		// Base list of CSS units
		cssUnits = [
			{ value: 'px', label: 'PX', default: 0 },
			{ value: '%', label: '%', default: 0 },
			{ value: 'em', label: 'EM', default: 0 },
			{ value: 'rem', label: 'REM', default: 0 },
			{ value: 'ch', label: 'CH', default: 0 },
			{ value: 'vw', label: 'VW', default: 0 },
			{ value: 'vh', label: 'VH', default: 0 },
			{ value: 'dvw', label: 'DVW', default: 0 },
			{ value: 'dvh', label: 'DVH', default: 0 },
		];

		const initialCssUnits = [
			{ value: 'auto', label: 'Auto', default: 0 },
			{ value: 'inherit', label: 'Inherit', default: 0 },
			{ value: 'initial', label: 'Initial', default: 0 },
		];

		switch (unitType) {
			case 'outline':
			case 'text-shadow':
			case 'box-shadow':
				cssUnits = [
					{ value: 'px', label: 'PX', default: 0 },
					{ value: 'em', label: 'EM', default: 0 },
					{ value: 'rem', label: 'REM', default: 0 },
					{ value: 'ch', label: 'CH', default: 0 },
					{ value: 'vw', label: 'VW', default: 0 },
					{ value: 'vh', label: 'VH', default: 0 },
					{ value: 'dvw', label: 'DVW', default: 0 },
					{ value: 'dvh', label: 'DVH', default: 0 },
				];
				break;

			case 'background-size':
				cssUnits = [
					{ value: 'auto', label: 'Auto', default: 0 },
					{ value: '%', label: '%', default: 0 },
					{ value: 'px', label: 'PX', default: 0 },
					{ value: 'em', label: 'EM', default: 0 },
					{ value: 'rem', label: 'REM', default: 0 },
					{ value: 'ch', label: 'CH', default: 0 },
					{ value: 'vw', label: 'VW', default: 0 },
					{ value: 'vh', label: 'VH', default: 0 },
					{ value: 'dvw', label: 'DVW', default: 0 },
					{ value: 'dvh', label: 'DVH', default: 0 },
				];
				break;

			case 'letter-spacing':
				cssUnits = [
					{ value: 'px', label: 'PX', default: 0 },
					{ value: 'em', label: 'EM', default: 0 },
					{ value: 'rem', label: 'REM', default: 0 },
					{ value: 'ch', label: 'CH', default: 0 },
					{ value: 'vw', label: 'VW', default: 0 },
					{ value: 'vh', label: 'VH', default: 0 },
					{ value: 'dvw', label: 'DVW', default: 0 },
					{ value: 'dvh', label: 'DVH', default: 0 },
					{ value: 'initial', label: 'Initial', default: 0 },
					{ value: 'inherit', label: 'Inherit', default: 0 },
				];
				break;

			case 'text-indent':
				cssUnits = [
					{ value: 'px', label: 'PX', default: 0 },
					{ value: '%', label: '%', default: 0 },
					{ value: 'em', label: 'EM', default: 0 },
					{ value: 'rem', label: 'REM', default: 0 },
					{ value: 'ch', label: 'CH', default: 0 },
					{ value: 'vw', label: 'VW', default: 0 },
					{ value: 'vh', label: 'VH', default: 0 },
					{ value: 'dvw', label: 'DVW', default: 0 },
					{ value: 'dvh', label: 'DVH', default: 0 },
					{ value: 'initial', label: 'Initial', default: 0 },
					{ value: 'inherit', label: 'Inherit', default: 0 },
				];
				break;

			case 'background-position':
				cssUnits = [
					{ value: '%', label: '%', default: 0 },
					{ value: 'px', label: 'PX', default: 0 },
					{ value: 'vw', label: 'VW', default: 0 },
					{ value: 'vh', label: 'VH', default: 0 },
					{ value: 'dvw', label: 'DVW', default: 0 },
					{ value: 'dvh', label: 'DVH', default: 0 },
				];
				break;

			case 'duration':
				cssUnits = [
					{ value: 'ms', label: 'MS', default: 0 },
					{ value: 's', label: 'S', default: 1 },
				];
				break;

			case 'angle':
				cssUnits = [
					{ value: 'deg', label: 'DEG', default: 0 },
					{ value: 'rad', label: 'RAD', default: 0 },
					{ value: 'grad', label: 'GRAD', default: 0 },
				];
				break;

			case 'percent':
				cssUnits = [{ value: '%', label: '%', default: 0 }];
				break;

			case 'width':
				cssUnits.push(
					...initialCssUnits,
					...[
						{
							value: 'fit-content',
							label: 'Fit Content',
							default: 0,
						},
						{
							value: 'max-content',
							label: 'Max Content',
							default: 0,
						},
						{
							value: 'min-content',
							label: 'Min Content',
							default: 0,
						},
					]
				);
				break;

			case 'essential':
				// no new units
				break;

			case 'general':
				cssUnits.push(...initialCssUnits);
				break;
		}
	}

	const { value, setValue } = useValue({
		initialValue,
		defaultValue,
		onChange,
	});

	return (
		<InputControl
			{...props}
			value={value}
			defaultValue={defaultValue}
			units={cssUnits}
			noBorder={noBorder}
			className={
				isSpecialUnit(value)
					? baseClassName + specialClassName
					: baseClassName
			}
			onChange={setValue}
		/>
	);
}

CssInputControl.propTypes = {
	/**
	 * Type of CSS units from presets
	 */
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
	]),
	/**
	 * It sets the control default value if the value not provided. By using it the control will not fire onValueChange event for this default value on control first render,
	 */
	defaultValue: PropTypes.string,
	/**
	 * The current value.
	 */
	value: PropTypes.string,
	/**
	 * Function that will be fired while the control value state changes.
	 */
	onChange: PropTypes.func,
	/**
	 * Sets to show range control for input or not
	 */
	range: PropTypes.bool,
	/**
	 * Indicates units for showing unit for value.
	 */
	units: PropTypes.arrayOf(
		PropTypes.shape({
			value: PropTypes.string,
			label: PropTypes.string,
			default: PropTypes.string,
		})
	),
	/**
	 * By using this you can prevent the control to show the border and outline shape.
	 */
	noBorder: PropTypes.bool,
	/**
	 * The minimum `value` allowed.
	 */
	min: PropTypes.number,
	/**
	 * The maximum `value` allowed.
	 */
	max: PropTypes.number,
	/**
	 * Disables the `input`, preventing new values from being applied.
	 */
	disabled: PropTypes.bool,
};

CssInputControl.defaultProps = {
	unitType: 'general',
	range: false,
	noBorder: false,
};
