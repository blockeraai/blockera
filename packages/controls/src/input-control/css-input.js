/**
 * WordPress dependencies
 */
import { useState } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { InputControl } from './input';
import { isSpecialUnit } from './utils';

export function CssInputControl({
	unitType = 'general',
	units = false,
	//
	initValue,
	value,
	attribute,
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

	const [controlValue] = useState('');

	const [classNames, setClassNames] = useState(
		isSpecialUnit(controlValue)
			? baseClassName + specialClassName
			: baseClassName
	);

	return (
		<InputControl
			{...props}
			value={value}
			initValue={initValue}
			units={cssUnits}
			//
			className={classNames}
			onUnitChange={(nextUnitValue) => {
				if (isSpecialUnit(nextUnitValue)) {
					setClassNames(baseClassName + specialClassName);
				} else if (classNames.includes(specialClassName))
					setClassNames(baseClassName.replace(specialClassName, ''));
			}}
		/>
	);
}
