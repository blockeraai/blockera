// @flow
/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';

/**
 * Blockera dependencies
 */
import { useDragValue } from '@blockera/utils';
import { controlInnerClassNames } from '@blockera/classnames';
import { setValueAddon, useValueAddon } from '@blockera/editor';

/**
 * Internal dependencies
 */
import { extractNumberAndUnit, LabelControl } from '../../../index';
import type { Side, SideProps, SideReturn } from '../../types';
import { SidePopover } from '../side-popover';
import { useDragSetValues } from '../../hooks/use-drag-setValues';
import PaddingLeftRightIcon from '../../icons/padding-left-right';
import { PaddingHorizontalShape } from './shapes/padding-horizontal-shape';
import { fixLabelText } from '../../utils';

export function PaddingHorizontal({
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
	paddingDisable,
}: SideProps): SideReturn {
	const sideId: Side = 'padding-horizontal';

	const { leftRightPaddingDragSetValue: onDragSetValue } = useDragSetValues({
		value,
		setValue,
	});

	const [labelClassName, setLabelClassName] = useState('');

	// $FlowFixMe
	const { isSetValueAddon, ValueAddonPointer, valueAddonControlProps } =
		useValueAddon({
			types: ['variable'],
			value: value.padding.right,
			setValue: (newValue: any): void =>
				setValueAddon(newValue, setValue, defaultValue),
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
		sideSpace = extractNumberAndUnit(value.padding.right);
	}

	const { onDragStart, isDragStarted } = useDragValue({
		value:
			!_isSetValueAddon && sideSpace?.value !== '' ? sideSpace?.value : 0,
		setValue: onDragSetValue,
		movement: 'horizontal',
		min: 0,
		onEnd: () => {
			if (!openPopover) setFocusSide('');
			setLabelClassName('');
		},
	});

	let paddingLock = value.paddingLock;
	if (paddingLock === 'vertical-horizontal') {
		paddingLock = 'horizontal';
	}

	if (
		paddingLock !== 'horizontal' ||
		(paddingLock === 'horizontal' && paddingDisable === 'all')
	) {
		return {
			shape: <></>,
			label: <></>,
		};
	}

	if (paddingDisable === 'horizontal') {
		return {
			shape: (
				<PaddingHorizontalShape
					className={[
						'side-horizontal',
						'side-padding-horizontal',
						'disabled-side',
					]}
				/>
			),
			label: <></>,
		};
	}

	return {
		shape: (
			<PaddingHorizontalShape
				className={[
					'side-horizontal',
					'side-padding-right',
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
						'side-horizontal',
						'side-padding-right',
						labelClassName
					)}
					data-cy="box-spacing-padding-right"
				>
					<LabelControl
						ariaLabel={__('left & Right Padding', 'blockera')}
						label={
							_isSetValueAddon
								? fixLabelText(value.padding.right)
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
							singularId: 'padding.right',
							path: getControlPath(attribute, 'padding.right'),
							mode: 'advanced',
						}}
					/>

					<ValueAddonPointer />
				</div>

				<div
					className={controlInnerClassNames(
						'label-side',
						'side-horizontal',
						'side-padding-left',
						labelClassName
					)}
					data-cy="box-spacing-padding-left"
				>
					<LabelControl
						ariaLabel={__('left & Right Padding', 'blockera')}
						label={
							_isSetValueAddon
								? fixLabelText(value.padding.right)
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
							singularId: 'padding.left',
							path: getControlPath(attribute, 'padding.left'),
							mode: 'advanced',
						}}
					/>
				</div>

				{openPopover === sideId && (
					<SidePopover
						id={getId(id, 'padding.left')}
						type="padding"
						icon={<PaddingLeftRightIcon />}
						onClose={() => {
							setFocusSide('');
							setOpenPopover('');
						}}
						title={__('Left & Right Padding Space', 'blockera')}
						inputLabel={__('Horizontal Padding', 'blockera')}
						inputLabelPopoverTitle={__(
							'Horizontal Padding Space',
							'blockera'
						)}
						inputLabelDescription={
							<>
								<p>
									{__(
										'It enables you to set a padding space that applies to both the left and right edges of the block.',
										'blockera'
									)}
								</p>
							</>
						}
						isOpen={true}
						unit={sideSpace.unit}
						onChange={(newValue) => {
							setValue({
								...value,
								padding: {
									...value.padding,
									left: newValue,
									right: newValue,
								},
							});
						}}
					/>
				)}
			</>
		),
	};
}
