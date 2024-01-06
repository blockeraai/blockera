// @flow
/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';

/**
 * Publisher dependencies
 */
import { controlInnerClassNames } from '@publisher/classnames';
import { useDragValue } from '@publisher/utils';
import { useValueAddon } from '@publisher/hooks';

/**
 * Internal dependencies
 */
import { extractNumberAndUnit, LabelControl } from '../../../index';
import type { SideProps, SideReturn, Side } from '../../types';
import { SidePopover } from '../side-popover';
import { useDragSetValues } from '../../hooks/use-drag-setValues';
import { fixLabelText } from '../../utils';
import MarginRightIcon from '../../icons/margin-right';
import { MarginRightSideShape } from './shapes/margin-right-shape';

export function MarginRight({
	id,
	getId,
	//
	value,
	setValue,
	attribute,
	blockName,
	defaultValue,
	resetToDefault,
	getControlPath,
	//
	focusSide,
	setFocusSide,
	openPopover,
	setOpenPopover,
	marginDisable,
}: SideProps): SideReturn {
	const sideId: Side = 'margin-right';

	const { rightMarginDragSetValue: onDragSetValue } = useDragSetValues({
		value,
		setValue,
	});

	const [labelClassName, setLabelClassName] = useState('');

	// $FlowFixMe
	const { isSetValueAddon, ValueAddonPointer, valueAddonControlProps } =
		useValueAddon({
			types: ['variable'],
			value: value.margin.right,
			variableTypes: ['spacing'],
			onChange: (newValue) => {
				setOpenPopover('');
				setFocusSide('');
				onDragSetValue(newValue);
			},
			size: 'normal',
			pointerProps: {
				onMouseEnter: () => {
					if (!openPopover && !valueAddonControlProps.isOpen) {
						setFocusSide(sideId);
						setLabelClassName('label-hover');
					}
				},
				onMouseLeave: () => {
					if (!openPopover && !valueAddonControlProps.isOpen) {
						setLabelClassName('');
						setFocusSide('');
					}
				},
			},
			pickerProps: {
				onClose: () => {
					setOpenPopover('');
					setFocusSide('');
					setLabelClassName('');
				},
				onShown: () => {
					setOpenPopover('variable-picker');
				},
			},
		});

	const _isSetValueAddon = isSetValueAddon();

	let sideSpace: { value?: string, unit?: string } = {};
	if (!_isSetValueAddon) {
		sideSpace = extractNumberAndUnit(value.margin.right);
	}

	const { onDragStart, isDragStarted } = useDragValue({
		value:
			!_isSetValueAddon && sideSpace?.value !== '' ? sideSpace?.value : 0,
		setValue: onDragSetValue,
		movement: 'horizontal',
		onEnd: () => {
			if (!openPopover) setFocusSide('');
			setLabelClassName('');
		},
	});

	if (marginDisable === 'all' || marginDisable === 'horizontal') {
		return {
			shape: (
				<MarginRightSideShape
					className={[
						'side-horizontal',
						'side-margin-right',
						'disabled-side',
					]}
				/>
			),
			label: <></>,
		};
	}

	if (value.marginLock !== 'none' && value.marginLock !== 'vertical') {
		return {
			shape: <></>,
			label: <></>,
		};
	}

	return {
		shape: (
			<MarginRightSideShape
				className={[
					'side-horizontal',
					'side-margin-right',
					focusSide === sideId ? 'selected-side' : '',
					valueAddonControlProps.isOpen
						? 'selected-side selected-side-value-addon'
						: '',
					_isSetValueAddon ? 'is-value-addon-side' : '',
					!_isSetValueAddon && sideSpace?.unit !== 'func'
						? 'side-drag-active'
						: '',
					valueAddonControlProps.isDeletedVar
						? 'is-value-addon-deleted'
						: '',
				]}
				{...(!_isSetValueAddon
					? {
							onMouseDown: (event) => {
								// prevent to catch double click
								if (event.detail > 1) {
									return;
								}

								if (sideSpace.unit === 'func') {
									event.preventDefault();
									return;
								}

								onDragStart(event);
								setFocusSide(sideId);
							},
					  }
					: {})}
				onMouseEnter={() => {
					if (!openPopover && !valueAddonControlProps.isOpen) {
						setFocusSide(sideId);
						setLabelClassName('label-hover');
					}
				}}
				onMouseLeave={() => {
					if (
						!openPopover &&
						!isDragStarted &&
						!valueAddonControlProps.isOpen
					) {
						setOpenPopover('');
						setFocusSide('');
						setLabelClassName('');
					}
				}}
				onClick={(event) => {
					// open on double click
					// or value addon
					// or CSS Value
					if (
						_isSetValueAddon ||
						sideSpace?.unit === 'func' ||
						event.detail > 1
					) {
						setFocusSide(sideId);
						setOpenPopover(sideId);
					}
				}}
			/>
		),
		label: (
			<>
				{marginDisable !== 'horizontal' && marginDisable !== 'all' && (
					<div
						className={controlInnerClassNames(
							'label-side',
							'side-horizontal',
							'side-margin-right',
							labelClassName
						)}
						data-cy="box-spacing-margin-right"
					>
						<LabelControl
							ariaLabel={__('Right Margin', 'publisher-core')}
							label={
								_isSetValueAddon
									? fixLabelText(value.margin.right)
									: fixLabelText(sideSpace)
							}
							onClick={() => {
								setFocusSide(sideId);
								setOpenPopover(sideId);
							}}
							{...{
								value,
								attribute,
								blockName,
								defaultValue,
								resetToDefault,
								singularId: 'margin.right',
								path: getControlPath(attribute, 'margin.right'),
								mode: 'advanced',
							}}
						/>

						<ValueAddonPointer />

						{openPopover === sideId && (
							<SidePopover
								id={getId(id, 'margin.right')}
								offset={255}
								icon={<MarginRightIcon />}
								onClose={() => {
									setFocusSide('');
									setOpenPopover('');
								}}
								title={__(
									'Right Margin Space',
									'publisher-core'
								)}
								inputLabel={__(
									'Right Margin',
									'publisher-core'
								)}
								inputLabelPopoverTitle={__(
									'Right Margin Space',
									'publisher-core'
								)}
								inputLabelDescription={
									<>
										<p>
											{__(
												'It enables you to set a margin space that applies only to the right edge of the block.',
												'publisher-core'
											)}
										</p>
									</>
								}
								isOpen={true}
								unit={sideSpace.unit}
								onChange={(newValue) => {
									setValue({
										...value,
										margin: {
											...value.margin,
											right: newValue,
										},
									});
								}}
							/>
						)}
					</div>
				)}
			</>
		),
	};
}
