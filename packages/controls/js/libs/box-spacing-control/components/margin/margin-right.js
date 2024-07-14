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

	if (marginLock !== 'none' && marginLock !== 'vertical') {
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

						{openPopover === sideId && (
							<SidePopover
								id={getId(id, 'margin.right')}
								offset={255}
								icon={
									<Icon icon="margin-right" iconSize="18" />
								}
								onClose={() => {
									setFocusSide('');
									setOpenPopover('');
								}}
								title={__('Right Margin Space', 'blockera')}
								inputLabel={__('Right Margin', 'blockera')}
								inputLabelPopoverTitle={__(
									'Right Margin Space',
									'blockera'
								)}
								inputLabelDescription={
									<>
										<p>
											{__(
												'It enables you to set a margin space that applies only to the right edge of the block.',
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
