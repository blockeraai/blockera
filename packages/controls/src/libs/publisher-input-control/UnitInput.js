/**
 * External dependencies
 */
import { useState, useEffect } from '@wordpress/element';
/**
 * Publisher dependencies
 */
import { controlClassNames } from '@publisher/classnames';
// import { isEmpty, isUndefined, isString, isNumber } from '@publisher/utils';

/**
 * Internal dependencies
 */
import { isSpecialUnit, extractSpecialUnitType } from './utils';

export function UnitInput({
	value,
	setValue,
	getMaxValue,
	getMinValue,
	noBorder,
	className,
	units = [],
	setIsSpecial,
	isSpecial,
	...props
}) {
	const [selectedUnit, setSelectedUnit] = useState('');
	const [inputType, setInputType] = useState('string'); // eslint-disable-line

	console.log('---------');
	console.log('isSpecial', isSpecial);
	console.log('selectedUnit', selectedUnit);
	console.log('inputType', inputType);
	console.log('value', value);

	//  check special value
	useEffect(() => {
		if (isSpecialUnit(value)) {
			const unitValue = extractSpecialUnitType(value);
			setIsSpecial(true);
			setSelectedUnit(unitValue);
		}
	}, []);

	return (
		<div className={controlClassNames('unit-input-container')}>
			<input
				value={value}
				onChange={(e) => {
					console.log('e.value:', e.target.value);
					setValue(`${e.target.value}`);
					// setValue(`${e.target.value}${selectedUnit}`);
				}}
				className={controlClassNames(
					'single-input',
					noBorder && 'no-border',
					className
				)}
				type={inputType}
				{...getMinValue}
				{...getMaxValue}
				{...props}
			/>
			<span className={controlClassNames('input-suffix')}>
				<select
					onChange={(e) => {
						if (isSpecialUnit(e.target.value)) {
							setIsSpecial(true);
						} else {
							setIsSpecial(false);
						}
						setSelectedUnit(e.target.value);
					}}
					value={selectedUnit}
					className={controlClassNames(
						'unit-select',
						!isSpecial && 'hide-arrow'
					)}
				>
					{units.map((unit, key) => (
						<option key={key} value={unit?.value}>
							{unit?.label}
						</option>
					))}
				</select>
			</span>
		</div>
	);
}
