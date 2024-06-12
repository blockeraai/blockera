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
import { setValueAddon, useValueAddon } from '@blockera/value-addons';

/**
 * Internal dependencies
 */
import { extractNumberAndUnit, LabelControl } from '../../../index';
import type { Side, SideProps, SideReturn } from '../../types';
import { SidePopover } from '../side-popover';
import { useDragSetValues } from '../../hooks/use-drag-setValues';
import { fixLabelText } from '../../utils';
import MarginTopIcon from '../../icons/margin-top';
import { MarginTopSideShape } from './shapes/margin-top-shape';

export function MarginTop({
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
}: SideProps): SideReturn {
	const sideId: Side = 'margin-top';

	const { topMarginDragSetValue: onDragSetValue } = useDragSetValues({
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

	if (marginDisable === 'all' || marginDisable === 'vertical') {
		return {
			shape: (
				<MarginTopSideShape
					className={[
						'side-vertical',
						'side-margin-top',
						'disabled-side',
					]}
				/>
			),
			label: <></>,
		};
	}

	if (value.marginLock !== 'none' && value.marginLock !== 'horizontal') {
		return {
			shape: <></>,
			label: <></>,
		};
	}

	return {
		shape: (
			<MarginTopSideShape
				className={[
					'side-vertical',
					'side-margin-top',
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
						ariaLabel={__('Top Margin', 'blockera')}
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
							mode: 'advanced',
						}}
					/>

					<ValueAddonPointer />
				</div>

				{openPopover === sideId && (
					<SidePopover
						id={getId(id, 'margin.top')}
						icon={<MarginTopIcon />}
						onClose={() => {
							setFocusSide('');
							setOpenPopover('');
						}}
						title={__('Top Margin Space', 'blockera')}
						inputLabel={__('Top Margin', 'blockera')}
						inputLabelPopoverTitle={__(
							'Top Margin Space',
							'blockera'
						)}
						inputLabelDescription={
							<>
								<p>
									{__(
										'It enables you to set a margin space that applies only to the top edge of the block.',
										'blockera'
									)}
								</p>
							</>
						}
						isOpen={true}
						unit={sideSpace?.unit}
						onChange={(newValue) => {
							setValue({
								...value,
								margin: {
									...value.margin,
									top: newValue,
								},
							});
						}}
					/>
				)}
			</>
		),
	};
}
