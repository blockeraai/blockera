/**
 * External dependencies
 */
import { useState, useContext } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { InputControl } from './input';
import { BlockEditContext } from '@publisher/extensions';

export function CssInputControl({ attribute, className, unitType, ...props }) {
	const { attributes } = useContext(BlockEditContext);
	const specialClassName = ' publisher-control-unit-special';
	let baseClassName = className;

	// Base list of CSS units
	const cssUnits = [
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
		case 'width':
			cssUnits.push(
				...initialCssUnits,
				...[
					{ value: 'fit-content', label: 'Fit Content', default: 0 },
					{ value: 'max-content', label: 'Max Content', default: 0 },
					{ value: 'min-content', label: 'Min Content', default: 0 },
				]
			);
			break;

		default:
			cssUnits.push(...initialCssUnits);
			break;
	}

	const [classNames, setClassNames] = useState(
		isSpecialUnit(attributes[attribute])
			? baseClassName + specialClassName
			: baseClassName
	);

	function isSpecialUnit(unit) {
		if (
			[
				'auto',
				'initial',
				'inherit',
				'fit-content',
				'max-content',
				'min-content',
			].some((item) => unit.endsWith(item))
		)
			return true;
		return false;
	}

	return (
		<InputControl
			{...{
				...props,
				type: 'number',
				units: cssUnits,
				attribute: attribute,
			}}
			className={classNames}
			onUnitChange={(nextUnitValue) => {
				if (isSpecialUnit(nextUnitValue)) {
					setClassNames(baseClassName + specialClassName);
				} else {
					if (classNames.includes(specialClassName))
						setClassNames(
							baseClassName.replace(specialClassName, '')
						);
				}
			}}
		/>
	);
}
