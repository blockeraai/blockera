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
import { MarginVerticalSideShape } from './shapes/margin-vertical-shape';
import { fixLabelText } from '../../utils';

export function MarginVertical({
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
	const sideId: Side = 'margin-vertical';

	const { topBottomMarginDragSetValue: onDragSetValue } = useDragSetValues({
		value,
		setValue,
	});

	const [labelClassName, setLabelClassName] = useState('');
	const [mouseDownTime, setMouseDownTime] = useState(0);

	// $FlowFixMe
	const { isSetValueAddon, ValueAddonPointer, valueAddonControlProps } =
		useValueAddon({
			types: ['variable'],
			value: value.margin.top,
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
				popoverOffset: 35,
			},
		});

	const _isSetValueAddon = isSetValueAddon();

	let sideSpace: { value?: string, unit?: string } = {};
	if (!_isSetValueAddon) {
		sideSpace = extractNumberAndUnit(value.margin.top);
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
		_marginLock = 'vertical';
	}

	if (
		_marginLock !== 'vertical' ||
		(_marginLock === 'vertical' && marginDisable === 'all')
	) {
		return {
			shape: <></>,
			label: <></>,
			popover: <></>,
		};
	}

	if (marginDisable === 'vertical') {
		return {
			shape: (
				<MarginVerticalSideShape
					className={[
						'side-vertical',
						'side-margin-vertical',
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
				top: '',
				bottom: '',
			},
		});
	}

	return {
		shape: (
			<MarginVerticalSideShape
				className={[
					'side-vertical',
					'side-margin-vertical',
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
				tooltipText={__('Vertical Margin', 'blockera')}
			/>
		),
		label: (
			<>
				<div
					className={controlInnerClassNames(
						'label-side',
						'side-vertical',
						'side-margin-top',
						labelClassName
					)}
					data-cy="box-spacing-margin-top"
				>
					<LabelControl
						ariaLabel={__('Top & Bottom Margin', 'blockera')}
						label={
							_isSetValueAddon
								? fixLabelText(value.margin.top)
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
							singularId: 'margin.top',
							value: value?.margin?.top,
							defaultValue: defaultValue?.margin?.top,
							path: getControlPath(attribute, 'margin.top'),
						}}
					/>

					<ValueAddonPointer />
				</div>

				<div
					className={controlInnerClassNames(
						'label-side',
						'side-vertical',
						'side-margin-bottom',
						labelClassName
					)}
					data-cy="box-spacing-margin-bottom"
				>
					<LabelControl
						ariaLabel={__('Top & Bottom Margin', 'blockera')}
						label={
							_isSetValueAddon
								? fixLabelText(value.margin.top)
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
							singularId: 'margin.bottom',
							value: value?.margin?.bottom,
							defaultValue: defaultValue?.margin?.bottom,
							path: getControlPath(attribute, 'margin.bottom'),
						}}
					/>
				</div>
			</>
		),
		popover: (
			<>
				{openPopover === sideId && (
					<SidePopover
						hasValue={value?.margin?.top || value?.margin?.bottom}
						resetToDefault={resetToDefault}
						defaultValue={defaultValue}
						id={getId(id, 'margin.top')}
						icon={<Icon icon="margin-vertical" iconSize="18" />}
						title={__('Top & Bottom Margin', 'blockera')}
						type="margin"
						onClose={() => {
							setFocusSide('');
							setOpenPopover('');
						}}
						inputLabel={__('Vertical Margin', 'blockera')}
						inputLabelPopoverTitle={__(
							'Vertical Margin',
							'blockera'
						)}
						inputLabelDescription={
							<p>
								{__(
									'It enables you to set a margin space that applies to both the top and bottom edges of the block.',
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
									top: newValue,
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
