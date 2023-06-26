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

const BorderControl = ({
	lines = 'horizontal',
	defaultValue = {
		width: '0px',
		style: 'solid',
		color: '',
	},
	customMenuPosition,
	//
	value,
	//
	className,
	onValueChange = (newValue) => {
		return newValue;
	},
}) => {
	const [controlValue, setControlValue] = useState({
		...defaultValue,
		...value,
	});

	return (
		<div className={controlClassNames('border', className)}>
			<InputControl
				min="0"
				unitType="custom"
				units={[{ value: 'px', label: 'PX', default: 0 }]}
				// type="number"
				className={controlClassNames('input')}
				noBorder={true}
				value={controlValue.width}
				onChange={(newValue) => {
					const value = { ...controlValue, width: newValue };

					setControlValue(value);
					onValueChange(value);
				}}
			/>

			<ColorControl
				type="minimal"
				noBorder={true}
				value={controlValue.color}
				onChange={(newValue) => {
					const value = { ...controlValue, color: newValue };
					setControlValue(value);
					onValueChange(value);
				}}
			/>

			<SelectControl
				customMenuPosition={customMenuPosition}
				type="custom"
				customInputCenterContent={true}
				customHideInputCaret={true}
				customHideInputLabel={true}
				noBorder={true}
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
				onChange={(newValue) => {
					const value = { ...controlValue, style: newValue };

					setControlValue(value);
					onValueChange(value);
				}}
			/>
		</div>
	);
};

export default BorderControl;
