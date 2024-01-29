// @flow
/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import PropTypes from 'prop-types';
import type { MixedElement } from 'react';
/**
 * Publisher dependencies
 */
import {
	controlClassNames,
	controlInnerClassNames,
} from '@publisher/classnames';
import { Button } from '@publisher/components';
import { isValid } from '@publisher/hooks';

/**
 * Internal dependencies
 */
import { useControlContext } from '../../context';
import { default as CustomIcon } from './icons/custom';
import {
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
			style: 'solid',
			color: '',
		},
		left: {
			width: '',
			style: 'solid',
			color: '',
		},
		right: {
			width: '',
			style: 'solid',
			color: '',
		},
		top: {
			width: '',
			style: 'solid',
			color: '',
		},
		bottom: {
			width: '',
			style: 'solid',
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
				return {};
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
						label={__('Custom Box Border', 'publisher-core')}
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

BoxBorderControl.propTypes = {
	/**
	 * ID for retrieving value from control context
	 */
	id: PropTypes.string,
	/**
	 * It sets the control default value if the value not provided. By using it the control will not fire onChange event for this default value on control first render,
	 */
	defaultValue: (PropTypes.oneOfType([
		PropTypes.shape({
			type: 'all',
			all: PropTypes.shape({
				width: PropTypes.string,
				style: PropTypes.oneOf(['solid', 'dashed', 'dotted', 'double']),
				color: PropTypes.string,
			}),
		}),
		PropTypes.shape({
			type: PropTypes.oneOf(['all', 'custom']),
			all: PropTypes.shape({
				width: PropTypes.string,
				style: PropTypes.oneOf(['solid', 'dashed', 'dotted', 'double']),
				color: PropTypes.string,
			}),
			top: PropTypes.shape({
				width: PropTypes.string,
				style: PropTypes.oneOf(['solid', 'dashed', 'dotted', 'double']),
				color: PropTypes.string,
			}),
			right: PropTypes.shape({
				width: PropTypes.string,
				style: PropTypes.oneOf(['solid', 'dashed', 'dotted', 'double']),
				color: PropTypes.string,
			}),
			bottom: PropTypes.shape({
				width: PropTypes.string,
				style: PropTypes.oneOf(['solid', 'dashed', 'dotted', 'double']),
				color: PropTypes.string,
			}),
			left: PropTypes.shape({
				width: PropTypes.string,
				style: PropTypes.oneOf(['solid', 'dashed', 'dotted', 'double']),
				color: PropTypes.string,
			}),
		}),
	]): any),
	/**
	 * Function that will be fired while the control value state changes.
	 */
	onChange: PropTypes.func,
};
