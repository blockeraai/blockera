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
import { Icon } from '@blockera/icons';

/**
 * Internal dependencies
 */
import { useValueAddon } from '../../../../';
import { extractNumberAndUnit, LabelControl } from '../../../index';
import type { Side, SideProps, SideReturn } from '../../types';
import { SidePopover } from '../side-popover';
import { useDragSetValues } from '../../hooks/use-drag-setValues';
import { fixLabelText } from '../../utils';
import { PaddingRightShape } from './shapes/padding-right-shape';

export function PaddingRight({
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
	paddingLock,
}: SideProps): SideReturn {
	const sideId: Side = 'padding-right';

	const { rightPaddingDragSetValue: onDragSetValue } = useDragSetValues({
		value,
		setValue,
	});

	const [labelClassName, setLabelClassName] = useState('');
	const [mouseDownTime, setMouseDownTime] = useState(0);

	// $FlowFixMe
	const { isSetValueAddon, ValueAddonPointer, valueAddonControlProps } =
		useValueAddon({
			types: ['variable'],
			value: value.padding.right,
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
				popoverOffset: 218,
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
		movement: 'vertical',
		min: 0,
		onEnd: () => {
			if (!openPopover) setFocusSide('');
			setLabelClassName('');
		},
		threshold: 0,
	});

	if (paddingDisable === 'all' || paddingDisable === 'horizontal') {
		return {
			shape: (
				<PaddingRightShape
					className={[
						'side-horizontal',
						'side-padding-right',
						'disabled-side',
					]}
				/>
			),
			label: <></>,
			popover: <></>,
		};
	}

	if (paddingLock !== 'none' && paddingLock !== 'vertical') {
		return {
			shape: <></>,
			label: <></>,
			popover: <></>,
		};
	}

	return {
		shape: (
			<PaddingRightShape
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
				tooltipText={__('Right Padding', 'blockera')}
			/>
		),
		label: (
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
					ariaLabel={__('Right Padding', 'blockera')}
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

				<ValueAddonPointer />
			</div>
		),
		popover: (
			<>
				{openPopover === sideId && (
					<SidePopover
						hasValue={value?.padding?.right}
						resetToDefault={() => {
							setValue({
								...value,
								padding: {
									...value.padding,
									right: '',
								},
							});
						}}
						defaultValue={defaultValue}
						id={getId(id, 'padding.right')}
						icon={<Icon icon="padding-right" iconSize="18" />}
						title={__('Right Padding Space', 'blockera')}
						type="padding"
						onClose={() => {
							setFocusSide('');
							setOpenPopover('');
						}}
						inputLabel={__('Right Padding', 'blockera')}
						inputLabelPopoverTitle={__(
							'Right Padding Space',
							'blockera'
						)}
						inputLabelDescription={
							<p>
								{__(
									'It enables you to set a padding space that applies only to the right edge of the block.',
									'blockera'
								)}
							</p>
						}
						isOpen={true}
						unit={sideSpace.unit}
						onChange={(newValue) => {
							setValue({
								...value,
								padding: {
									...value.padding,
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
