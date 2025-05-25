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
import { Icon } from '@blockera/icons';

/**
 * Internal dependencies
 */
import { useValueAddon } from '../../../../';
import { extractNumberAndUnit, LabelControl } from '../../../index';
import type { Side, SideProps, SideReturn } from '../../types';
import { SidePopover } from '../side-popover';
import { useDragSetValues } from '../../hooks/use-drag-setValues';
import { PaddingAllSideShape } from './shapes/padding-all-shape';
import { fixLabelText } from '../../utils';

export function PaddingAll({
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
	paddingLock,
}: SideProps): SideReturn {
	const sideId: Side = 'padding-all';

	const { allPaddingDragSetValue: onDragSetValue } = useDragSetValues({
		value,
		setValue,
	});

	const [labelClassName, setLabelClassName] = useState('');
	const [mouseDownTime, setMouseDownTime] = useState(0);

	// $FlowFixMe
	const { isSetValueAddon, ValueAddonPointer, valueAddonControlProps } =
		useValueAddon({
			types: ['variable'],
			value: value.padding.top,
			setValue: (): void => {
				// no need to set value because we do it on onChange
			},
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
				popoverOffset: 73,
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
		threshold: 0,
	});

	if (paddingLock !== 'all') {
		return {
			shape: <></>,
			label: <></>,
		};
	}

	return {
		shape: (
			<PaddingAllSideShape
				className={[
					'side-all',
					'side-padding-all',
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

								// Store the mouse down timestamp
								setMouseDownTime(Date.now());
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
					// Calculate click duration
					const clickDuration = Date.now() - mouseDownTime;

					// If it's a quick click (less than 200ms) or it's a value addon/func
					if (
						_isSetValueAddon ||
						sideSpace?.unit === 'func' ||
						event.detail > 1 ||
						clickDuration < 200
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
						ariaLabel={__('All Sides Padding', 'blockera')}
						label={
							_isSetValueAddon
								? fixLabelText(value.padding.top)
								: fixLabelText(sideSpace)
						}
						onClick={() => {
							setFocusSide(sideId);
							setOpenPopover(sideId);
						}}
						{...{
							attribute,
							blockName,
							resetToDefault,
							mode: 'advanced',
							singularId: 'padding.top',
							value: value?.padding?.top,
							defaultValue: defaultValue?.padding?.top,
							path: getControlPath(attribute, 'padding.top'),
						}}
					/>

					<ValueAddonPointer />
				</div>

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
						ariaLabel={__('All Sides Padding', 'blockera')}
						label={
							_isSetValueAddon
								? fixLabelText(value.padding.top)
								: fixLabelText(sideSpace)
						}
						onClick={() => {
							setFocusSide(sideId);
							setOpenPopover(sideId);
						}}
						{...{
							attribute,
							blockName,
							resetToDefault,
							mode: 'advanced',
							singularId: 'padding.right',
							value: value?.padding?.right,
							defaultValue: defaultValue?.padding?.right,
							path: getControlPath(attribute, 'padding.right'),
						}}
					/>
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
						ariaLabel={__('All Sides Padding', 'blockera')}
						label={
							_isSetValueAddon
								? fixLabelText(value.padding.top)
								: fixLabelText(sideSpace)
						}
						onClick={() => {
							setFocusSide(sideId);
							setOpenPopover(sideId);
						}}
						{...{
							attribute,
							blockName,
							resetToDefault,
							mode: 'advanced',
							singularId: 'padding.bottom',
							value: value?.padding?.bottom,
							defaultValue: defaultValue?.padding?.bottom,
							path: getControlPath(attribute, 'padding.bottom'),
						}}
					/>
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
						ariaLabel={__('All Sides Padding', 'blockera')}
						label={
							_isSetValueAddon
								? fixLabelText(value.padding.top)
								: fixLabelText(sideSpace)
						}
						onClick={() => {
							setFocusSide(sideId);
							setOpenPopover(sideId);
						}}
						{...{
							attribute,
							blockName,
							resetToDefault,
							mode: 'advanced',
							singularId: 'padding.left',
							value: value?.padding?.left,
							defaultValue: defaultValue?.padding?.left,
							path: getControlPath(attribute, 'padding.left'),
						}}
					/>
				</div>

				{openPopover === sideId && (
					<SidePopover
						hasValue={
							value?.padding?.top ||
							value?.padding?.right ||
							value?.padding?.bottom ||
							value?.padding?.left
						}
						resetToDefault={() => {
							setValue({
								...value,
								padding: {
									top: '',
									right: '',
									bottom: '',
									left: '',
								},
							});
						}}
						defaultValue={defaultValue}
						id={getId(id, 'padding.top')}
						type="padding"
						icon={<Icon icon="padding-all" iconSize="18" />}
						onClose={() => {
							setFocusSide('');
							setOpenPopover('');
						}}
						title={__('All Sides Padding', 'blockera')}
						inputLabel={__('Padding', 'blockera')}
						inputLabelPopoverTitle={__(
							'All Sides Padding',
							'blockera'
						)}
						inputLabelDescription={
							<>
								<p>
									{__(
										'It enables you to set a single padding space that is uniformly applied to all four edges (top, right, bottom, and left) of the block.',
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
									top: newValue,
									right: newValue,
									bottom: newValue,
									left: newValue,
								},
							});
						}}
					/>
				)}
			</>
		),
	};
}
