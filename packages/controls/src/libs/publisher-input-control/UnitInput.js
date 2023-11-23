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
	disabled,
	...props
}) {
	const [selectedUnit, setSelectedUnit] = useState('');
	const [oldNumberValue, setOldNumberValue] = useState(null);
	const [oldUnitValue, setOldUnitValue] = useState(null);
	const [inputType, setInputType] = useState('number'); // eslint-disable-line

	console.log('---------');
	console.log('selectedUnit', selectedUnit);
	console.log('inputType', inputType);
	console.log('oldNumberValue', oldNumberValue);
	console.log('oldUnitValue', oldUnitValue);
	console.log('value', value);

	//  check special value
	useEffect(() => {
		if (isSpecialUnit(value)) {
			const unitValue = extractSpecialUnitType(value);
			setIsSpecial(true);
			setSelectedUnit(unitValue);
		}
	}, []); // eslint-disable-line

	const onChangeSelect = (unit) => {
		if (isSpecialUnit(unit)) {
			setIsSpecial(true);
			setInputType('text');
			setOldNumberValue(value);
			setOldUnitValue(unit);
			setValue(unit);
		} else {
			if (!isSpecialUnit(oldUnitValue)) {
				setValue(oldNumberValue);
			}
			setIsSpecial(false);
			setInputType('number');
		}
		setSelectedUnit(unit);
	};

	return (
		<div className={controlClassNames('unit-input-container')}>
			<input
				value={value}
				onChange={(e) => {
					console.log('e.value:', e.target.value);
					setValue(`${e.target.value}`);
					// setValue(`${e.target.value}${selectedUnit}`);
				}}
				disabled={disabled}
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
					disabled={disabled}
					onChange={(e) => onChangeSelect(e.target.value)}
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
