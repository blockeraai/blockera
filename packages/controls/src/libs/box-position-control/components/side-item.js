// @flow
/**
 * External dependencies
 */
import { __, sprintf } from '@wordpress/i18n';
import { useState } from '@wordpress/element';
import type { MixedElement } from 'react';

/**
 * Blockera dependencies
 */
import { controlInnerClassNames } from '@blockera/classnames';
import { useDragValue } from '@blockera/utils';
import { isValid, setValueAddon, useValueAddon } from '@blockera/hooks';

/**
 * Internal dependencies
 */
import { extractNumberAndUnit, LabelControl } from '../../../index';
import type { Side, SideProps, SideReturn } from '../types';
import { SidePopover } from './side-popover';
import { fixLabelText } from '../../box-spacing-control/utils';
import SideTopIcon from '../icons/side-top';
import SideBottomIcon from '../icons/side-bottom';
import SideLeftIcon from '../icons/side-left';
import SideRightIcon from '../icons/side-right';
import { SideShape } from './side-shape';

export function SideItem({
	side,
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
	const sideId: Side = side;

	function onDragSetValue(property: string, newValue: string) {
		if (isValid(newValue)) {
			setValue({
				...value,
				position: {
					...value.position,
					[property]: newValue,
				},
			});
		} else if (newValue === '') {
			setValue({
				...value,
				position: {
					...value.position,
					[property]: '',
				},
			});
		} else {
			const extracted = extractNumberAndUnit(value.position[property]);

			if (
				extracted.unit === 'auto' ||
				extracted.unit === '' ||
				extracted.unit === 'func'
			) {
				extracted.unit = 'px';
			}

			setValue({
				...value,
				position: {
					...value.position,
					[property]: `${newValue}${extracted.unit}`,
				},
			});
		}
	}

	const [labelClassName, setLabelClassName] = useState('');

	// $FlowFixMe
	const { isSetValueAddon, ValueAddonPointer, valueAddonControlProps } =
		useValueAddon({
			types: ['variable'],
			value: value.position[side],
			setValue: (newValue: any): void =>
				setValueAddon(newValue, setValue, defaultValue),
			variableTypes: ['spacing'],
			onChange: (newValue) => {
				setOpenPopover('');
				setFocusSide('');
				onDragSetValue(side, newValue);
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
		sideSpace = extractNumberAndUnit(value.position[side]);
	}

	const { onDragStart, isDragStarted } = useDragValue({
		value:
			!_isSetValueAddon && sideSpace?.value !== '' ? sideSpace?.value : 0,
		setValue: (newValue) => {
			onDragSetValue(side, newValue);
		},
		movement:
			side === 'top' || side === 'bottom' ? 'vertical' : 'horizontal',
		onEnd: () => {
			if (!openPopover) setFocusSide('');
			setLabelClassName('');
		},
	});

	function getSideIcon(side: Side): MixedElement {
		switch (side) {
			case 'top':
				return <SideTopIcon />;
			case 'bottom':
				return <SideBottomIcon />;
			case 'left':
				return <SideLeftIcon />;
			case 'right':
				return <SideRightIcon />;
		}

		return <></>;
	}

	function getSideLabel(side: Side): string {
		switch (side) {
			case 'top':
				return __('Top', 'blockera-core');
			case 'bottom':
				return __('Bottom', 'blockera-core');
			case 'left':
				return __('Left', 'blockera-core');
			case 'right':
				return __('Right', 'blockera-core');
		}

		return '';
	}

	return {
		shape: (
			<SideShape
				side={side}
				className={[
					'side-' +
						(side === 'top' || side === 'bottom'
							? 'vertical'
							: 'horizontal'),
					'side-' + side,
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
						'side-' +
							(side === 'top' || side === 'bottom'
								? 'vertical'
								: 'horizontal'),
						'side-' + side,
						labelClassName
					)}
				>
					<LabelControl
						ariaLabel={sprintf(
							// Translators: %s is the position name (top, right, bottom, left)
							__('%s Position', 'blockera-core'),
							getSideLabel(side)
						)}
						label={
							_isSetValueAddon
								? fixLabelText(value.position[side])
								: fixLabelText(sideSpace)
						}
						onClick={() => {
							setFocusSide(sideId);
							setOpenPopover(sideId);
						}}
						{...{
							value: value.position[side],
							attribute,
							blockName,
							defaultValue,
							resetToDefault,
							singularId: 'position.' + side,
							path: getControlPath(attribute, 'position.' + side),
							mode: 'advanced',
						}}
					/>

					<ValueAddonPointer />
				</div>

				<SidePopover
					id={id}
					getId={getId}
					sideId={side}
					property={'position.' + side}
					title={sprintf(
						// Translators: %s is the position name (top, right, bottom, left)
						__('%s Position', 'blockera-core'),
						getSideLabel(side)
					)}
					sideLabel={getSideLabel(side)}
					icon={getSideIcon(side)}
					onClose={() => {
						setFocusSide('');
						setOpenPopover('');
					}}
					isOpen={openPopover === sideId}
					unit={sideSpace?.unit}
					onChange={(newValue) => {
						setValue({
							...value,
							position: {
								...value.position,
								[(side: string)]: newValue,
							},
						});
					}}
					defaultValue={defaultValue}
				/>
			</>
		),
	};
}
