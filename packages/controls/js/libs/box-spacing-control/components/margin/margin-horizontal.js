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
import { SidePopover } from '../side-popover';
import { useDragSetValues } from '../../hooks/use-drag-setValues';
import { MarginHorizontalSideShape } from './shapes/margin-horizontal-shape';
import type { Side, SideProps, SideReturn } from '../../types';
import { fixLabelText } from '../../utils';

export function MarginHorizontal({
	id,
	getId,
	//
	value,
	setValue,
	attribute,
	blockName,
	defaultValue,
	getControlPath,
	//
	focusSide,
	setFocusSide,
	openPopover,
	setOpenPopover,
	marginDisable,
	marginLock,
}: SideProps): SideReturn {
	const sideId: Side = 'margin-horizontal';

	const { leftRightMarginDragSetValue: onDragSetValue } = useDragSetValues({
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

	let _marginLock = marginLock;
	if (_marginLock === 'vertical-horizontal') {
		_marginLock = 'horizontal';
	}

	if (
		_marginLock !== 'horizontal' ||
		(_marginLock === 'horizontal' && marginDisable === 'all')
	) {
		return {
			shape: <></>,
			label: <></>,
			popover: <></>,
		};
	}

	if (marginDisable === 'horizontal') {
		return {
			shape: (
				<MarginHorizontalSideShape
					className={[
						'side-horizontal',
						'side-margin-horizontal',
						'disabled-side',
					]}
				/>
			),
			label: <></>,
			popover: <></>,
		};
	}

	function resetToDefault() {
		setValue({
			...value,
			margin: {
				...value.margin,
				left: '',
				right: '',
			},
		});
	}

	return {
		shape: (
			<>
				{
					<MarginHorizontalSideShape
						className={[
							'side-horizontal',
							'side-margin-horizontal',
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
							if (
								!openPopover &&
								!valueAddonControlProps.isOpen
							) {
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
						tooltipText={__('Horizontal Margin', 'blockera')}
					/>
				}
			</>
		),
		label: (
			<>
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
						ariaLabel={__('Left & Right Margin', 'blockera')}
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

				<div
					className={controlInnerClassNames(
						'label-side',
						'side-horizontal',
						'side-margin-left',
						labelClassName
					)}
					data-cy="box-spacing-margin-left"
				>
					<LabelControl
						ariaLabel={__('Left & Right Margin', 'blockera')}
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
							singularId: 'margin.left',
							value: value?.margin?.left,
							defaultValue: defaultValue?.margin?.left,
							path: getControlPath(attribute, 'margin.left'),
						}}
					/>
				</div>
			</>
		),
		popover: (
			<>
				{openPopover === sideId && (
					<SidePopover
						hasValue={value?.margin?.left || value?.margin?.right}
						resetToDefault={resetToDefault}
						defaultValue={defaultValue}
						id={getId(id, 'margin.left')}
						icon={<Icon icon="margin-horizontal" iconSize="18" />}
						title={__('Left & Right Margin', 'blockera')}
						type="margin"
						onClose={() => {
							setFocusSide('');
							setOpenPopover('');
						}}
						inputLabel={__('Horizontal Margin', 'blockera')}
						inputLabelPopoverTitle={__(
							'Horizontal Margin',
							'blockera'
						)}
						inputLabelDescription={
							<p>
								{__(
									'It enables you to set a margin space that applies to both the left and right edges of the block.',
									'blockera'
								)}
							</p>
						}
						isOpen={true}
						unit={sideSpace?.unit}
						onChange={(newValue) => {
							setValue({
								...value,
								margin: {
									...value.margin,
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
