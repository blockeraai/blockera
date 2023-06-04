/**
 * WordPress dependencies
 */
import {
	TextControl as WPTextControl,
	__experimentalUnitControl as WPUnitControl,
} from '@wordpress/components';
import { useContext } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { controlClassNames } from '@publisher/classnames';
import { BlockEditContext } from '@publisher/extensions';

/**
 * Styles
 */
import './style.scss';
import { RangeControl } from './../index';
import { getControlValue, updateControlValue } from './../utils';

export function InputControl({
	initValue,
	units,
	// suffix = '',  //todo implement
	range = false,
	//
	value,
	attribute,
	repeaterAttributeIndex = null,
	repeaterAttribute = null,
	//
	className,
	onChange = () => {},
	...props
}) {
	const { attributes, setAttributes } = useContext(BlockEditContext);

	let controlValue = getControlValue(
		value,
		attribute,
		repeaterAttribute,
		repeaterAttributeIndex,
		'',
		attributes
	);

	return (
		<div
			className={controlClassNames(
				'input',
				range ? 'input-range' : '',
				className
			)}
		>
			{range && (
				<RangeControl
					withInputField={false}
					//
					attribute={attribute}
					repeaterAttributeIndex={repeaterAttributeIndex}
					repeaterAttribute={repeaterAttribute}
					//
					value={controlValue}
					onChange={(newValue) => {
						// extract unit from old value and assign it to newValue
						newValue = newValue + value.replace(/[0-9|-]/gi, '');

						updateControlValue(
							newValue,
							attribute,
							repeaterAttribute,
							repeaterAttributeIndex,
							attributes,
							setAttributes
						);

						onChange(newValue);
					}}
					//
					{...props}
				/>
			)}

			{units && (
				//todo replace this with our UnitControl (there is strange bug about half units list!)
				<WPUnitControl
					{...props}
					units={units}
					//
					attribute={attribute}
					repeaterAttributeIndex={repeaterAttributeIndex}
					repeaterAttribute={repeaterAttribute}
					//
					value={controlValue}
					onChange={(newValue) => {
						updateControlValue(
							newValue,
							attribute,
							repeaterAttribute,
							repeaterAttributeIndex,
							attributes,
							setAttributes
						);

						onChange(newValue);
					}}
					className={controlClassNames(
						'text',
						'publisher-control-unit',
						className
					)}
				/>
			)}

			{!units && (
				<WPTextControl
					{...props}
					//
					attribute={attribute}
					repeaterAttributeIndex={repeaterAttributeIndex}
					repeaterAttribute={repeaterAttribute}
					//
					value={controlValue}
					onChange={(newValue) => {
						updateControlValue(
							newValue,
							attribute,
							repeaterAttribute,
							repeaterAttributeIndex,
							attributes,
							setAttributes
						);

						onChange(newValue);
					}}
					className={controlClassNames('text', className)}
				/>
			)}
		</div>
	);
}
