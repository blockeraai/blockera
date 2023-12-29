// @flow
/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import type { MixedElement } from 'react';
/**
 * Publisher dependencies
 */
import {
	controlClassNames,
	controlInnerClassNames,
} from '@publisher/classnames';
import { getValueAddonRealValue } from '@publisher/hooks';
import { Button } from '@publisher/components';

/**
 * Internal dependencies
 */
import { InputControl, LabelControl } from '../index';
import { default as CustomIcon } from './icons/custom';
import { useControlContext } from '../../context';
import type { BorderRadiusControlProps, BorderRadiusValue } from './types';

export type * from './types';

export default function BorderRadiusControl({
	id,
	label = '',
	labelPopoverTitle,
	labelDescription,
	repeaterItem,
	singularId,
	defaultValue = {
		type: 'all',
		all: '',
		topLeft: '',
		topRight: '',
		bottomLeft: '',
		bottomRight: '',
	},
	onChange,
	//
	className,
}: BorderRadiusControlProps): MixedElement {
	const {
		value,
		setValue,
		controlInfo: { name: controlId },
		dispatch: { modifyControlValue },
		attribute,
		blockName,
		resetToDefault,
		getControlPath,
	} = useControlContext({
		id,
		onChange,
		defaultValue,
		valueCleanup,
		mergeInitialAndDefault: true,
	});

	// value clean up for removing extra values to prevent saving extra data!
	function valueCleanup(value: BorderRadiusValue) {
		if (value.type === 'all') {
			delete value?.topLeft;
			delete value?.topRight;
			delete value?.bottomLeft;
			delete value?.bottomRight;

			if (value?.all === '') {
				return '';
			}
		}

		return value;
	}

	const labelProps = {
		value,
		singularId,
		attribute,
		blockName,
		label,
		labelPopoverTitle:
			labelPopoverTitle || __('Border Radius', 'publisher-core'),
		labelDescription,
		repeaterItem,
		defaultValue,
		resetToDefault,
		mode: 'advanced',
		path: getControlPath(attribute, id),
	};

	return (
		<div className={controlClassNames('border-radius', className)}>
			<div
				className={controlInnerClassNames('border-header')}
				style={{
					'--pb-all': getValueAddonRealValue(value.all),
				}}
			>
				{label && (
					<span
						style={{
							display: 'flex',
							alignItems: 'center',
							minHeight: '30px',
							marginRight: 'auto',
						}}
					>
						<LabelControl {...labelProps} />
					</span>
				)}

				{value.type === 'all' && (
					<InputControl
						id="all"
						min={0}
						unitType="essential"
						onChange={(newValue) => {
							setValue({ ...value, all: newValue });
							modifyControlValue({
								controlId,
								value: {
									...value,
									all: newValue,
								},
							});
						}}
						defaultValue={value.all || ''}
						placeholder="-"
						size="small"
						data-test="border-radius-input-all"
					/>
				)}
				<Button
					showTooltip={true}
					tooltipPosition="top"
					label={__('Custom Border Radius', 'publisher-core')}
					size="extra-small"
					style={{
						color:
							value.type === 'custom'
								? 'var(--publisher-controls-primary-color)'
								: 'var(--publisher-controls-color)',
						padding: '5px',
						width: '30px',
						height: '30px',
					}}
					onClick={() => {
						// old type
						if (value.type === 'all') {
							setValue({
								...value,
								type: 'custom',
								topLeft: value.all,
								topRight: value.all,
								bottomLeft: value.all,
								bottomRight: value.all,
							});
							modifyControlValue({
								controlId,
								value: {
									...value,
									type: 'custom',
									topLeft: value.all,
									topRight: value.all,
									bottomLeft: value.all,
									bottomRight: value.all,
								},
							});
						} else {
							setValue({
								...value,
								type: 'all',
							});
							modifyControlValue({
								controlId,
								value: {
									...value,
									type: 'all',
								},
							});
						}
					}}
				>
					<CustomIcon />
				</Button>
			</div>

			{value.type === 'custom' && (
				<div className={controlInnerClassNames('border-corners')}>
					<div
						className={controlInnerClassNames(
							'border-corners-preview'
						)}
						style={{
							'--pb-top-left': getValueAddonRealValue(
								value.topLeft
							),
							'--pb-top-right': getValueAddonRealValue(
								value.topRight
							),
							'--pb-bottom-left': getValueAddonRealValue(
								value.bottomLeft
							),
							'--pb-bottom-right': getValueAddonRealValue(
								value.bottomRight
							),
						}}
					>
						<InputControl
							id="topLeft"
							min={0}
							unitType="essential"
							className={controlInnerClassNames(
								'border-corner-top-left'
							)}
							noBorder={true}
							defaultValue={value.topLeft || ''}
							placeholder="-"
							onChange={(newValue) => {
								setValue({
									...value,
									topLeft: newValue,
								});
								modifyControlValue({
									controlId,
									value: {
										...value,
										topLeft: newValue,
									},
								});
							}}
							size="small"
						/>
						<InputControl
							id="topRight"
							min={0}
							unitType="essential"
							className={controlInnerClassNames(
								'border-corner-top-right'
							)}
							noBorder={true}
							defaultValue={value.topRight || ''}
							placeholder="-"
							onChange={(newValue) => {
								setValue({
									...value,
									topRight: newValue,
								});
								modifyControlValue({
									controlId,
									value: {
										...value,
										topRight: newValue,
									},
								});
							}}
							size="small"
						/>
						<InputControl
							id="bottomLeft"
							min={0}
							unitType="essential"
							className={controlInnerClassNames(
								'border-corner-bottom-left'
							)}
							noBorder={true}
							defaultValue={value.bottomLeft || ''}
							placeholder="-"
							onChange={(newValue) => {
								setValue({
									...value,
									bottomLeft: newValue,
								});
								modifyControlValue({
									controlId,
									value: {
										...value,
										bottomLeft: newValue,
									},
								});
							}}
							size="small"
						/>
						<InputControl
							id="bottomRight"
							min={0}
							unitType="essential"
							className={controlInnerClassNames(
								'border-corner-bottom-right'
							)}
							noBorder={true}
							defaultValue={value.bottomRight || ''}
							placeholder="-"
							onChange={(newValue) => {
								setValue({
									...value,
									bottomRight: newValue,
								});
								modifyControlValue({
									controlId,
									value: {
										...value,
										bottomRight: newValue,
									},
								});
							}}
							size="small"
						/>
					</div>
				</div>
			)}
		</div>
	);
}
