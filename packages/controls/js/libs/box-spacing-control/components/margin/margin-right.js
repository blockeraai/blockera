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

/**
 * Internal dependencies
 */
import { useValueAddon } from '../../../../';
import { extractNumberAndUnit, LabelControl } from '../../../index';
import type { SideProps, SideReturn, Side } from '../../types';
import { SidePopover } from '../side-popover';
import { useDragSetValues } from '../../hooks/use-drag-setValues';
import { fixLabelText } from '../../utils';
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
	marginLock,
}: SideProps): SideReturn {
	const sideId: Side = 'margin-right';

	const { rightMarginDragSetValue: onDragSetValue } = useDragSetValues({
		value,
		setValue,
	});

	const [labelClassName, setLabelClassName] = useState('');
	const [mouseDownTime, setMouseDownTime] = useState(0);

	// $FlowFixMe
	const { isSetValueAddon, ValueAddonPointer, valueAddonControlProps } =
		useValueAddon({
			types: ['variable'],
			value: value.margin.right,
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
				popoverOffset: 255,
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
		movement: 'vertical',
		onEnd: () => {
			if (!openPopover) setFocusSide('');
			setLabelClassName('');
		},
		threshold: 0,
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
			popover: <></>,
		};
	}

	if (marginLock !== 'none' && marginLock !== 'vertical') {
		return {
			shape: <></>,
			label: <></>,
			popover: <></>,
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
							ariaLabel={__('Right Margin', 'blockera')}
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
								attribute,
								blockName,
								resetToDefault,
								mode: 'advanced',
								singularId: 'margin.right',
								value: value?.margin?.right,
								defaultValue: defaultValue?.margin?.right,
								path: getControlPath(attribute, 'margin.right'),
							}}
						/>

						<ValueAddonPointer />
					</div>
				)}
			</>
		),
		popover: (
			<>
				{marginDisable !== 'horizontal' && marginDisable !== 'all' && (
					<>
						{openPopover === sideId && (
							<SidePopover
								hasValue={value?.margin?.right}
								resetToDefault={() => {
									setValue({
										...value,
										margin: {
											...value.margin,
											right: '',
										},
									});
								}}
								defaultValue={defaultValue}
								id={getId(id, 'margin.right')}
								onClose={() => {
									setFocusSide('');
									setOpenPopover('');
								}}
								inputLabel={__('Right Margin', 'blockera')}
								inputLabelPopoverTitle={__(
									'Right Margin Space',
									'blockera'
								)}
								inputLabelDescription={
									<p>
										{__(
											'It enables you to set a margin space that applies only to the right edge of the block.',
											'blockera'
										)}
									</p>
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
					</>
				)}
			</>
		),
	};
}
