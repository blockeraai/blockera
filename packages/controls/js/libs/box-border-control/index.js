// @flow

/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import type { MixedElement } from 'react';

/**
 * Blockera dependencies
 */
import {
	controlClassNames,
	controlInnerClassNames,
} from '@blockera/classnames';
import { isEquals } from '@blockera/utils';
import { Icon } from '@blockera/icons';

/**
 * Internal dependencies
 */
import { isValid } from '../../';
import { useControlContext } from '../../context';
import {
	Button,
	BaseControl,
	BorderControl,
	LabelControl,
	LabelControlContainer,
} from '../index';
import type { BoxBorderControlProps, TValueTypes } from './types';

export default function BoxBorderControl({
	id,
	label = '',
	labelPopoverTitle,
	labelDescription,
	repeaterItem,
	singularId,
	defaultValue = {
		type: 'all',
		all: {
			width: '',
			style: '',
			color: '',
		},
		left: {
			width: '',
			style: '',
			color: '',
		},
		right: {
			width: '',
			style: '',
			color: '',
		},
		top: {
			width: '',
			style: '',
			color: '',
		},
		bottom: {
			width: '',
			style: '',
			color: '',
		},
	},
	onChange,
	//
	columns,
	field = 'box-border',
	//
	className,
}: BoxBorderControlProps): MixedElement {
	const {
		value,
		setValue,
		attribute,
		blockName,
		resetToDefault,
		getControlPath,
		controlInfo: { name: controlId },
		dispatch: { modifyControlValue },
	} = useControlContext({
		id,
		onChange,
		defaultValue,
		valueCleanup,
		mergeInitialAndDefault: true,
	});

	// value clean up for removing extra values to prevent saving extra data!
	function valueCleanup(value: TValueTypes) {
		if (isEquals(value, defaultValue)) {
			return defaultValue;
		}

		if (value.type === 'all') {
			delete value?.top;
			delete value?.right;
			delete value?.bottom;
			delete value?.left;

			// return empty object if all values are empty
			if (
				value?.all?.color === '' &&
				value?.all?.width === '' &&
				(value?.all?.style === 'solid' || value?.all?.style === '')
			) {
				return '';
			}
		} else {
			['all', 'top', 'right', 'bottom', 'left'].forEach((key) => {
				if (
					value[key]?.color === '' &&
					value[key]?.width === '' &&
					value[key]?.style === 'solid'
				) {
					value[key].style = '';
				}
			});
		}

		return value;
	}

	const labelProps = {
		value,
		singularId,
		attribute,
		blockName,
		label,
		labelPopoverTitle,
		labelDescription,
		repeaterItem,
		defaultValue,
		resetToDefault,
		mode: 'advanced',
		path: getControlPath(attribute, id),
	};

	return (
		<BaseControl
			label=""
			columns={columns}
			controlName={field}
			className={className}
		>
			<div className={controlClassNames('box-border', className)}>
				<div className={controlInnerClassNames('border-header')}>
					{label && (
						<LabelControlContainer
							style={{
								marginRight: 'auto',
							}}
						>
							<LabelControl {...labelProps} />
						</LabelControlContainer>
					)}

					{value.type === 'all' && (
						<BorderControl
							id="all"
							onChange={(newValue) => {
								setValue({ ...value, all: newValue });
								modifyControlValue({
									controlId,
									value: { ...value, all: newValue },
								});
							}}
							defaultValue={value.all}
						/>
					)}
					<Button
						showTooltip={true}
						tooltipPosition="top"
						label={__('Custom Box Border', 'blockera')}
						size="extra-small"
						style={{
							color:
								value.type === 'custom'
									? 'var(--blockera-controls-primary-color)'
									: 'var(--blockera-controls-color)',
							padding: '5px',
							width: '30px',
							height: '30px',
						}}
						onClick={() => {
							if (value.type === 'all') {
								setValue({
									...value,
									type: 'custom',
									top: value.all,
									right: value.all,
									bottom: value.all,
									left: value.all,
								});
								modifyControlValue({
									controlId,
									value: {
										...value,
										type: 'custom',
										top: value.all,
										right: value.all,
										bottom: value.all,
										left: value.all,
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
						<Icon icon="border" iconSize="14" />
					</Button>
				</div>

				{value.type === 'custom' && (
					<div className={controlInnerClassNames('border-corners')}>
						<div
							className={controlInnerClassNames(
								'border-corners-preview'
							)}
							style={{
								'--pb-top-width': value.top.width,
								'--pb-top-style': value.top.style || 'solid',
								'--pb-top-color': isValid(value.top.color)
									? value.top.color?.settings?.value
									: value.top.color,
								'--pb-right-width': value.right.width,
								'--pb-right-style':
									value.right.style || 'solid',
								'--pb-right-color': isValid(value.right.color)
									? value.right.color?.settings?.value
									: value.right.color,
								'--pb-bottom-width': value.bottom.width,
								'--pb-bottom-style':
									value.bottom.style || 'solid',
								'--pb-bottom-color': isValid(value.bottom.color)
									? value.bottom.color?.settings?.value
									: value.bottom.color,
								'--pb-left-width': value.left.width,
								'--pb-left-style': value.left.style || 'solid',
								'--pb-left-color': isValid(value.left.color)
									? value.left.color?.settings?.value
									: value.left.color,
							}}
						>
							<BorderControl
								label=""
								columns=""
								controlName="empty"
								id="top"
								className={controlInnerClassNames(
									'border-corner-top'
								)}
								onChange={(newValue) => {
									setValue({
										...value,
										top: newValue,
									});
									modifyControlValue({
										controlId,
										value: {
											...value,
											top: newValue,
										},
									});
								}}
								defaultValue={value.top}
							/>
							<BorderControl
								label=""
								columns=""
								id="right"
								linesDirection="vertical"
								className={controlInnerClassNames(
									'border-corner-right'
								)}
								onChange={(newValue) => {
									setValue({
										...value,
										right: newValue,
									});
									modifyControlValue({
										controlId,
										value: {
											...value,
											right: newValue,
										},
									});
								}}
								defaultValue={value.right}
							/>
							<BorderControl
								label=""
								columns=""
								id="bottom"
								className={controlInnerClassNames(
									'border-corner-bottom'
								)}
								onChange={(newValue) => {
									setValue({
										...value,
										bottom: newValue,
									});
									modifyControlValue({
										controlId,
										value: {
											...value,
											bottom: newValue,
										},
									});
								}}
								defaultValue={value.bottom}
							/>
							<BorderControl
								label=""
								columns=""
								id="left"
								linesDirection="vertical"
								className={controlInnerClassNames(
									'border-corner-left'
								)}
								onChange={(newValue) => {
									setValue({
										...value,
										left: newValue,
									});
									modifyControlValue({
										controlId,
										value: {
											...value,
											left: newValue,
										},
									});
								}}
								defaultValue={value.left}
							/>
						</div>
					</div>
				)}
			</div>
		</BaseControl>
	);
}
