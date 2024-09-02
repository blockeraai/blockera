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
import { MarginLeftSideShape } from './shapes/margin-left-shape';

export function MarginLeft({
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
	const sideId: Side = 'margin-left';

	const { leftMarginDragSetValue: onDragSetValue } = useDragSetValues({
		value,
		setValue,
	});

	const [labelClassName, setLabelClassName] = useState('');

	// $FlowFixMe
	const { isSetValueAddon, ValueAddonPointer, valueAddonControlProps } =
		useValueAddon({
			types: ['variable'],
			value: value.margin.left,
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
		sideSpace = extractNumberAndUnit(value.margin.left);
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

	if (marginDisable === 'all' || marginDisable === 'horizontal') {
		return {
			shape: (
				<MarginLeftSideShape
					className={[
						'side-horizontal',
						'side-margin-left',
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
			<MarginLeftSideShape
				className={[
					'side-horizontal',
					'side-margin-left',
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
						ariaLabel={__('Left Margin', 'blockera')}
						label={
							_isSetValueAddon
								? fixLabelText(value.margin.left)
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

					<ValueAddonPointer />
				</div>

				{openPopover === sideId && (
					<SidePopover
						defaultValue={defaultValue}
						id={getId(id, 'margin.left')}
						icon={<Icon icon="margin-left" iconSize="18" />}
						onClose={() => {
							setFocusSide('');
							setOpenPopover('');
						}}
						title={__('Left Margin Space', 'blockera')}
						inputLabel={__('Left Margin', 'blockera')}
						inputLabelPopoverTitle={__(
							'Left Margin Space',
							'blockera'
						)}
						inputLabelDescription={
							<>
								<p>
									{__(
										'It enables you to set a margin space that applies only to the left edge of the block.',
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
