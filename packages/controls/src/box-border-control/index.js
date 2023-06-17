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
import { BorderControl, LabelControl, ToggleSelectControl } from '../index';
import { default as CompactIcon } from './icons/compact';
import { default as CustomIcon } from './icons/custom';

const BoxBorderControl = ({
	label = '',
	initValue = {
		type: 'all',
		all: {
			width: '0px',
			style: 'solid',
			color: '',
		},
		left: {
			width: '0px',
			style: 'solid',
			color: '',
		},
		right: {
			width: '0px',
			style: 'solid',
			color: '',
		},
		top: {
			width: '0px',
			style: 'solid',
			color: '',
		},
		bottom: {
			width: '0px',
			style: 'solid',
			color: '',
		},
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
		...initValue,
		...value,
	});

	return (
		<div className={controlClassNames('box-border', className)}>
			<div className={controlInnerClassNames('border-header')}>
				{label && (
					<div className={controlInnerClassNames('label')}>
						<LabelControl label={label} />
					</div>
				)}

				{controlValue.type === 'all' && (
					<BorderControl
						value={controlValue.all}
						onValueChange={(newValue) => {
							const value = { ...controlValue, all: newValue };
							setControlValue(value);
							onValueChange(value);
						}}
					/>
				)}

				<ToggleSelectControl
					initValue="compact"
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
					onValueChange={(newValue) => {
						if (newValue === 'custom') {
							const value = {
								...controlValue,
								type: newValue,
								top: controlValue.all,
								right: controlValue.all,
								bottom: controlValue.all,
								left: controlValue.all,
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
							'--pb-top-width': controlValue.top.width,
							'--pb-top-style': controlValue.top.style,
							'--pb-top-color': controlValue.top.color,
							'--pb-right-width': controlValue.right.width,
							'--pb-right-style': controlValue.right.style,
							'--pb-right-color': controlValue.right.color,
							'--pb-bottom-width': controlValue.bottom.width,
							'--pb-bottom-style': controlValue.bottom.style,
							'--pb-bottom-color': controlValue.bottom.color,
							'--pb-left-width': controlValue.left.width,
							'--pb-left-style': controlValue.left.style,
							'--pb-left-color': controlValue.left.color,
						}}
					>
						<BorderControl
							className={controlInnerClassNames(
								'border-corner-top'
							)}
							value={controlValue.top}
							onValueChange={(newValue) => {
								const value = {
									...controlValue,
									top: newValue,
								};
								setControlValue(value);
								onValueChange(value);
							}}
						/>
						<BorderControl
							lines="vertical"
							className={controlInnerClassNames(
								'border-corner-right'
							)}
							value={controlValue.right}
							onValueChange={(newValue) => {
								const value = {
									...controlValue,
									right: newValue,
								};
								setControlValue(value);
								onValueChange(value);
							}}
						/>
						<BorderControl
							className={controlInnerClassNames(
								'border-corner-bottom'
							)}
							value={controlValue.bottom}
							onValueChange={(newValue) => {
								const value = {
									...controlValue,
									bottom: newValue,
								};
								setControlValue(value);
								onValueChange(value);
							}}
						/>
						<BorderControl
							lines="vertical"
							className={controlInnerClassNames(
								'border-corner-left'
							)}
							value={controlValue.left}
							onValueChange={(newValue) => {
								const value = {
									...controlValue,
									left: newValue,
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

export default BoxBorderControl;
