// @flow
/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';

/**
 * Publisher dependencies
 */
import { useDragValue } from '@publisher/utils';
import { controlInnerClassNames } from '@publisher/classnames';
import { useValueAddon } from '@publisher/hooks';

/**
 * Internal dependencies
 */
import { extractNumberAndUnit, LabelControl } from '../../../index';
import type { Side, SideProps, SideReturn } from '../../types';
import { SidePopover } from '../side-popover';
import { useDragSetValues } from '../../hooks/use-drag-setValues';
import PaddingTopBottomIcon from '../../icons/padding-top-bottom';
import { PaddingVerticalShape } from './shapes/padding-vertical-shape';
import { fixLabelText } from '../../utils';

export function PaddingVertical({
	id,
	getId,
	//
	value,
	setValue,
	attribute,
	blockName,
	description,
	defaultValue,
	resetToDefault,
	getControlPath,
	//
	focusSide,
	setFocusSide,
	openPopover,
	setOpenPopover,
	paddingDisable,
}: SideProps): SideReturn {
	const sideId: Side = 'padding-vertical';

	const { topBottomPaddingDragSetValue: onDragSetValue } = useDragSetValues({
		value,
		setValue,
	});

	const [labelClassName, setLabelClassName] = useState('');

	// $FlowFixMe
	const { isSetValueAddon, ValueAddonPointer, valueAddonControlProps } =
		useValueAddon({
			types: ['variable'],
			value: value.padding.top,
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
		sideSpace = extractNumberAndUnit(value.padding.top);
	}

	const { onDragStart, isDragStarted } = useDragValue({
		value:
			!_isSetValueAddon && sideSpace?.value !== '' ? sideSpace?.value : 0,
		setValue: onDragSetValue,
		movement: 'vertical',
		min: 0,
		onEnd: () => {
			if (!openPopover) setFocusSide('');
			setLabelClassName('');
		},
	});

	let paddingLock = value.paddingLock;
	if (paddingLock === 'vertical-horizontal') {
		paddingLock = 'vertical';
	}

	if (
		paddingLock !== 'vertical' ||
		(paddingLock === 'vertical' && paddingDisable === 'all')
	) {
		return {
			shape: <></>,
			label: <></>,
		};
	}

	if (paddingDisable === 'vertical') {
		return {
			shape: (
				<PaddingVerticalShape
					className={[
						'side-vertical',
						'side-padding-vertical',
						'disabled-side',
					]}
				/>
			),
			label: <></>,
		};
	}

	return {
		shape: (
			<PaddingVerticalShape
				className={[
					'side-vertical',
					'side-padding-vertical',
					focusSide === sideId ? 'selected-side' : '',
					valueAddonControlProps.isOpen
						? 'selected-side selected-side-value-addon'
						: '',
					_isSetValueAddon ? 'is-value-addon-side' : '',
					!_isSetValueAddon && sideSpace?.unit !== 'func'
						? 'side-drag-active'
						: '',
				]}
				{...(!_isSetValueAddon
					? {
							onMouseDown: (event) => {
								// prevent to catch double click
								if (event.detail > 1) {
									return;
								}

								if (
									_isSetValueAddon ||
									sideSpace?.unit === 'func'
								) {
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
				<div
					className={controlInnerClassNames(
						'label-side',
						'side-vertical',
						'side-padding-top',
						labelClassName
					)}
					data-cy="box-spacing-padding-top"
				>
					<LabelControl
						ariaLabel={__('Top & Bottom Padding', 'publisher-core')}
						label={
							_isSetValueAddon
								? fixLabelText(value.padding.top)
								: fixLabelText(sideSpace)
						}
						popoverTitle={__(
							'Top & Bottom Padding',
							'publisher-core'
						)}
						onClick={() => {
							setFocusSide(sideId);
							setOpenPopover(sideId);
						}}
						{...{
							value,
							attribute,
							blockName,
							description,
							defaultValue,
							resetToDefault,
							singularId: 'padding.top',
							path: getControlPath(attribute, 'padding.top'),
							mode: 'advanced',
						}}
					/>

					<ValueAddonPointer />
				</div>

				<div
					className={controlInnerClassNames(
						'label-side',
						'side-vertical',
						'side-padding-bottom',
						labelClassName
					)}
					data-cy="box-spacing-padding-bottom"
				>
					<LabelControl
						ariaLabel={__('Top & Bottom Padding', 'publisher-core')}
						label={
							_isSetValueAddon
								? fixLabelText(value.padding.top)
								: fixLabelText(sideSpace)
						}
						popoverTitle={__(
							'Top & Bottom Padding',
							'publisher-core'
						)}
						onClick={() => {
							setFocusSide(sideId);
							setOpenPopover(sideId);
						}}
						{...{
							value,
							attribute,
							blockName,
							description,
							defaultValue,
							resetToDefault,
							singularId: 'padding.bottom',
							path: getControlPath(attribute, 'padding.bottom'),
							mode: 'advanced',
						}}
					/>
				</div>

				<SidePopover
					id={getId(id, 'padding.top')}
					type="padding"
					icon={<PaddingTopBottomIcon />}
					onClose={() => {
						setFocusSide('');
						setOpenPopover('');
					}}
					title={__('Top & Bottom Padding', 'publisher-core')}
					isOpen={openPopover === sideId}
					unit={sideSpace.unit}
					onChange={(newValue) => {
						setValue({
							...value,
							padding: {
								...value.padding,
								top: newValue,
								bottom: newValue,
							},
						});
					}}
				/>
			</>
		),
	};
}
