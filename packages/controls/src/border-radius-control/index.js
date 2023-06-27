/**
 * WordPress dependencies
 */
import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

/**
 * Publisher dependencies
 */
import {
	controlClassNames,
	controlInnerClassNames,
} from '@publisher/classnames';

/**
 * Internal dependencies
 */
import { InputControl, LabelControl, ToggleSelectControl } from '../index';
import { default as CompactIcon } from './icons/compact';
import { default as CustomIcon } from './icons/custom';

const BorderRadiusControl = ({
	label = '',
	defaultValue = {
		type: 'all',
		all: '0px',
		topLeft: '0px',
		topRight: '0px',
		bottomLeft: '0px',
		bottomRight: '0px',
	},
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
		<div className={controlClassNames('border-radius', className)}>
			<div className={controlInnerClassNames('border-header')}>
				{label && (
					<div className={controlInnerClassNames('label')}>
						<LabelControl label={label} />
					</div>
				)}

				{controlValue.type === 'all' && (
					<InputControl
						min="0"
						type="css"
						unitType="essential"
						value={controlValue.all}
						onChange={(newValue) => {
							const value = { ...controlValue, all: newValue };
							setControlValue(value);
							onValueChange(value);
						}}
						style={{
							'--pb-all': controlValue.all,
						}}
					/>
				)}

				<ToggleSelectControl
					defaultValue="compact"
					value={controlValue.type}
					options={[
						{
							label: __('Compact', 'publisher-core'),
							value: 'all',
							icon: <CompactIcon />,
						},
						{
							label: __('Custom', 'publisher-core'),
							value: 'custom',
							icon: <CustomIcon />,
						},
					]}
					onChange={(newValue) => {
						if (newValue === 'custom') {
							const value = {
								...controlValue,
								type: newValue,
								topLeft: controlValue.all,
								topRight: controlValue.all,
								bottomLeft: controlValue.all,
								bottomRight: controlValue.all,
							};
							setControlValue(value);
							onValueChange(value);
						} else {
							const value = {
								...controlValue,
								type: newValue,
							};
							setControlValue(value);
							onValueChange(value);
						}
					}}
				/>
			</div>

			{controlValue.type === 'custom' && (
				<div className={controlInnerClassNames('border-corners')}>
					<div
						className={controlInnerClassNames(
							'border-corners-preview'
						)}
						style={{
							'--pb-top-left': controlValue.topLeft,
							'--pb-top-right': controlValue.topRight,
							'--pb-bottom-left': controlValue.bottomLeft,
							'--pb-bottom-right': controlValue.bottomRight,
						}}
					>
						<InputControl
							min="0"
							type="css"
							unitType="essential"
							className={controlInnerClassNames(
								'border-corner-top-left'
							)}
							noBorder={true}
							value={controlValue.topLeft}
							onChange={(newValue) => {
								const value = {
									...controlValue,
									topLeft: newValue,
								};
								setControlValue(value);
								onValueChange(value);
							}}
						/>
						<InputControl
							min="0"
							type="css"
							unitType="essential"
							className={controlInnerClassNames(
								'border-corner-top-right'
							)}
							noBorder={true}
							value={controlValue.topRight}
							onChange={(newValue) => {
								const value = {
									...controlValue,
									topRight: newValue,
								};
								setControlValue(value);
								onValueChange(value);
							}}
						/>
						<InputControl
							min="0"
							type="css"
							unitType="essential"
							className={controlInnerClassNames(
								'border-corner-bottom-left'
							)}
							noBorder={true}
							value={controlValue.bottomLeft}
							onChange={(newValue) => {
								const value = {
									...controlValue,
									bottomLeft: newValue,
								};
								setControlValue(value);
								onValueChange(value);
							}}
						/>
						<InputControl
							min="0"
							type="css"
							unitType="essential"
							className={controlInnerClassNames(
								'border-corner-bottom-right'
							)}
							noBorder={true}
							value={controlValue.bottomRight}
							onChange={(newValue) => {
								const value = {
									...controlValue,
									bottomRight: newValue,
								};
								setControlValue(value);
								onValueChange(value);
							}}
						/>
					</div>
				</div>
			)}
		</div>
	);
};

export default BorderRadiusControl;
