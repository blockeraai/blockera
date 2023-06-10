/**
 * WordPress dependencies
 */
import { useState } from '@wordpress/element';

/**
 * Publisher dependencies
 */
import { controlClassNames } from '@publisher/classnames';
import { InputControl, SelectControl, ColorControl } from '../index';
import BorderStyleHSolidIcon from './icons/style-h-solid';
import BorderStyleHDashedIcon from './icons/style-h-dashed';
import BorderStyleHDottedIcon from './icons/style-h-dotted';
import BorderStyleHDoubleIcon from './icons/style-h-double';
import BorderStyleVSolidIcon from './icons/style-v-solid';
import BorderStyleVDashedIcon from './icons/style-v-dashed';
import BorderStyleVDottedIcon from './icons/style-v-dotted';
import BorderStyleVDoubleIcon from './icons/style-v-double';

import './style.scss';

const BorderControl = ({
	lines = 'horizontal',
	initValue = '',
	customMenuPosition,
	//
	value: _value,
	//
	className,
	onValueChange = (newValue) => {
		return newValue;
	},
}) => {
	const initial = _value || initValue;

	const border = {
		width: initial?.width ? initial.width : '0',
		color: initial?.color ? initial.color : '',
		style: initial?.style ? initial.style : 'solid',
	};

	const [controlValue, setControlValue] = useState(border);

	return (
		<div className={controlClassNames('border', className)}>
			<InputControl
				type="number"
				className={controlClassNames('input', 'no-border')}
				value={controlValue.width}
				onValueChange={(newValue) => {
					const value = { ...controlValue, width: newValue };

					setControlValue(value);
					onValueChange(value);
				}}
			/>

			<ColorControl
				type="minimal"
				align="center"
				className="no-border"
				value={controlValue.color}
				onValueChange={(newValue) => {
					const value = { ...controlValue, color: newValue };

					setControlValue(value);
					onValueChange(value);
				}}
			/>

			<SelectControl
				customMenuPosition={customMenuPosition}
				type="custom"
				className="input-hide-label input-hide-caret input-align-center no-border"
				value={controlValue.style}
				options={[
					{
						label: '',
						icon:
							lines === 'horizontal' ? (
								<BorderStyleHSolidIcon />
							) : (
								<BorderStyleVSolidIcon />
							),
						value: 'solid',
						className: 'align-center',
					},
					{
						label: '',
						icon:
							lines === 'horizontal' ? (
								<BorderStyleHDashedIcon />
							) : (
								<BorderStyleVDashedIcon />
							),
						value: 'dashed',
						className: 'align-center',
					},
					{
						label: '',
						icon:
							lines === 'horizontal' ? (
								<BorderStyleHDottedIcon />
							) : (
								<BorderStyleVDottedIcon />
							),
						value: 'dotted',
						className: 'align-center',
					},
					{
						label: '',
						icon:
							lines === 'horizontal' ? (
								<BorderStyleHDoubleIcon />
							) : (
								<BorderStyleVDoubleIcon />
							),
						value: 'double',
						className: 'align-center',
					},
				]}
				onValueChange={(newValue) => {
					const value = { ...controlValue, style: newValue };

					setControlValue(value);
					onValueChange(value);
				}}
			/>
		</div>
	);
};

export default BorderControl;
