// @flow
/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';

/**
 * Blockera dependencies
 */
import { controlInnerClassNames } from '@blockera/classnames';
import { useDragValue } from '@blockera/utils';
import { setValueAddon, useValueAddon } from '@blockera/editor';

/**
 * Internal dependencies
 */
import { extractNumberAndUnit, LabelControl } from '../../../index';
import type { Side, SideProps, SideReturn } from '../../types';
import { SidePopover } from '../side-popover';
import { useDragSetValues } from '../../hooks/use-drag-setValues';
import { fixLabelText } from '../../utils';
import PaddingBottomIcon from '../../icons/padding-bottom';
import { PaddingBottomSideShape } from './shapes/padding-bottom-shape';

export function PaddingBottom({
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
	const sideId: Side = 'padding-bottom';

	const { bottomPaddingDragSetValue: onDragSetValue } = useDragSetValues({
		value,
		setValue,
	});

	const [labelClassName, setLabelClassName] = useState('');

	// $FlowFixMe
	const { isSetValueAddon, ValueAddonPointer, valueAddonControlProps } =
		useValueAddon({
			types: ['variable'],
			value: value.padding.bottom,
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
		sideSpace = extractNumberAndUnit(value.padding.bottom);
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

	if (paddingDisable === 'all' || paddingDisable === 'vertical') {
		return {
			shape: (
				<PaddingBottomSideShape
					className={[
						'side-vertical',
						'side-padding-bottom',
						'disabled-side',
					]}
				/>
			),
			label: <></>,
		};
	}

	if (value.paddingLock !== 'none' && value.paddingLock !== 'horizontal') {
		return {
			shape: <></>,
			label: <></>,
		};
	}

	return {
		shape: (
			<PaddingBottomSideShape
				className={[
					'side-vertical',
					'side-padding-bottom',
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
						'side-vertical',
						'side-padding-bottom',
						labelClassName
					)}
					data-cy="box-spacing-padding-bottom"
				>
					<LabelControl
						ariaLabel={__('Bottom Padding', 'blockera')}
						label={
							_isSetValueAddon
								? fixLabelText(value.padding.bottom)
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
							singularId: 'padding.bottom',
							path: getControlPath(attribute, 'padding.bottom'),
							mode: 'advanced',
						}}
					/>

					<ValueAddonPointer />
				</div>

				{openPopover === sideId && (
					<SidePopover
						id={getId(id, 'padding.bottom')}
						type="padding"
						icon={<PaddingBottomIcon />}
						onClose={() => {
							setFocusSide('');
							setOpenPopover('');
						}}
						title={__('Bottom Padding Space', 'blockera')}
						inputLabel={__('Bottom Padding', 'blockera')}
						inputLabelPopoverTitle={__(
							'Bottom Padding Space',
							'blockera'
						)}
						inputLabelDescription={
							<>
								<p>
									{__(
										'It enables you to set a padding space that applies only to the bottom edge of the block.',
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
									bottom: newValue,
								},
							});
						}}
					/>
				)}
			</>
		),
	};
}