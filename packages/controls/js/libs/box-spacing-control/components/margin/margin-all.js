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
import { setValueAddon, useValueAddon } from '../../../../';
import { LabelControl, extractNumberAndUnit } from '../../../index';
import { SidePopover } from '../side-popover';
import { useDragSetValues } from '../../hooks/use-drag-setValues';
import { MarginAllSideShape } from './shapes/margin-all-shape';
import type { Side, SideProps, SideReturn } from '../../types';
import { fixLabelText } from '../../utils';

export function MarginAll({
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
}: SideProps): SideReturn {
	const sideId: Side = 'margin-all';

	const { allMarginDragSetValue: onDragSetValue } = useDragSetValues({
		value,
		setValue,
	});

	const [labelClassName, setLabelClassName] = useState('');

	// $FlowFixMe
	const { isSetValueAddon, ValueAddonPointer, valueAddonControlProps } =
		useValueAddon({
			types: ['variable'],
			value: value.margin.top,
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
	});

	if (value.marginLock !== 'all') {
		return {
			shape: <></>,
			label: <></>,
		};
	}

	return {
		shape: (
			<MarginAllSideShape
				className={[
					'side-all',
					'side-margin-all',
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
						'side-margin-top',
						labelClassName
					)}
					data-cy="box-spacing-margin-top"
				>
					<LabelControl
						ariaLabel={__('All Sides Margin', 'blockera')}
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
							value,
							attribute,
							blockName,
							defaultValue,
							resetToDefault,
							singularId: 'margin.top',
							path: getControlPath(attribute, 'margin.top'),
						}}
					/>

					<ValueAddonPointer />
				</div>

				<div
					className={controlInnerClassNames(
						'label-side',
						'side-vertical',
						'side-margin-right',
						labelClassName
					)}
					data-cy="box-spacing-margin-right"
				>
					<LabelControl
						ariaLabel={__('All Sides Margin', 'blockera')}
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
						ariaLabel={__('All Sides Margin', 'blockera')}
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
							value,
							attribute,
							blockName,
							defaultValue,
							resetToDefault,
							singularId: 'margin.bottom',
							path: getControlPath(attribute, 'margin.bottom'),
							mode: 'advanced',
						}}
					/>
				</div>

				<div
					className={controlInnerClassNames(
						'label-side',
						'side-vertical',
						'side-margin-left',
						labelClassName
					)}
					data-cy="box-spacing-margin-left"
				>
					<LabelControl
						ariaLabel={__('All Sides Margin', 'blockera')}
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
							value,
							attribute,
							blockName,
							defaultValue,
							resetToDefault,
							singularId: 'margin.left',
							path: getControlPath(attribute, 'margin.left'),
							mode: 'advanced',
						}}
					/>
				</div>

				{openPopover === sideId && (
					<SidePopover
						id={getId(id, 'margin.top')}
						type="margin"
						icon={<Icon icon="margin-all" iconSize="18" />}
						onClose={() => {
							setFocusSide('');
							setOpenPopover('');
						}}
						title={__('All Sides Margin', 'blockera')}
						isOpen={true}
						unit={sideSpace?.unit}
						onChange={(newValue) => {
							setValue({
								...value,
								margin: {
									top: newValue,
									right: newValue,
									bottom: newValue,
									left: newValue,
								},
							});
						}}
						inputLabel={__('Margin', 'blockera')}
						inputLabelPopoverTitle={__(
							'All Sides Margin',
							'blockera'
						)}
						inputLabelDescription={
							<>
								<p>
									{__(
										'It enables you to set a single margin space that is uniformly applied to all four edges (top, right, bottom, and left) of the block.',
										'blockera'
									)}
								</p>
							</>
						}
					/>
				)}
			</>
		),
	};
}
