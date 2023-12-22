// @flow
/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Publisher dependencies
 */
import { useDragValue } from '@publisher/utils';
import { controlInnerClassNames } from '@publisher/classnames';

/**
 * Internal dependencies
 */
import { extractNumberAndUnit, LabelControl } from '../../../index';
import type { SideProps, SideReturn } from '../../types';
import { SidePopover } from '../side-popover';
import { useDragSetValues } from '../../hooks/use-drag-setValues';
import PaddingAllIcon from '../../icons/padding-all';
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
	description,
	defaultValue,
	resetToDefault,
	getControlPath,
	//
	focusSide,
	setFocusSide,
	openPopover,
	setOpenPopover,
}: SideProps): SideReturn {
	const paddingTop = extractNumberAndUnit(value.padding.top);

	const { allPaddingDragSetValue } = useDragSetValues({ value, setValue });

	const allPaddingDragValueHandler = useDragValue({
		value: paddingTop.value !== '' ? paddingTop.value : 0,
		setValue: allPaddingDragSetValue,
		movement: 'vertical',
		min: 0,
		onEnd: () => {
			if (!openPopover) setFocusSide('');
		},
	});

	if (value.paddingLock !== 'all') {
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
					focusSide === 'padding-all' ? 'selected-side' : '',
					paddingTop.unit !== 'func' ? 'side-drag-active' : '',
				]}
				onMouseDown={(event) => {
					// prevent to catch double click
					if (event.detail > 1) {
						return;
					}

					if (paddingTop.unit === 'func') {
						event.preventDefault();
						return;
					}

					allPaddingDragValueHandler(event);
					setFocusSide('padding-all');
				}}
				onClick={(event) => {
					// open on double click
					if (event.detail > 1) {
						setFocusSide('padding-all');
						setOpenPopover('padding-all');
						return;
					}

					if (paddingTop.unit === 'func') {
						setOpenPopover('padding-all');
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
						'side-padding-top'
					)}
					data-cy="box-spacing-padding-top"
				>
					<LabelControl
						ariaLabel={__('All Sides Padding', 'publisher-core')}
						label={fixLabelText(paddingTop)}
						popoverTitle={__('All Sides Padding', 'publisher-core')}
						onClick={() => {
							setFocusSide('padding-all');
							setOpenPopover('padding-all');
						}}
						{...{
							value,
							attribute,
							blockName,
							description,
							defaultValue,
							resetToDefault,
							fieldId: 'padding.top',
							path: getControlPath(attribute, 'padding.top'),
						}}
					/>
				</div>

				<div
					className={controlInnerClassNames(
						'label-side',
						'side-horizontal',
						'side-padding-right'
					)}
					data-cy="box-spacing-padding-right"
				>
					<LabelControl
						ariaLabel={__('All Sides Padding', 'publisher-core')}
						label={fixLabelText(paddingTop)}
						popoverTitle={__('All Sides Padding', 'publisher-core')}
						onClick={() => {
							setFocusSide('padding-all');
							setOpenPopover('padding-all');
						}}
						{...{
							value,
							attribute,
							blockName,
							description,
							defaultValue,
							resetToDefault,
							fieldId: 'padding.right',
							path: getControlPath(attribute, 'padding.right'),
						}}
					/>
				</div>

				<div
					className={controlInnerClassNames(
						'label-side',
						'side-vertical',
						'side-padding-bottom'
					)}
					data-cy="box-spacing-padding-bottom"
				>
					<LabelControl
						ariaLabel={__('All Sides Padding', 'publisher-core')}
						label={fixLabelText(paddingTop)}
						popoverTitle={__('All Sides Padding', 'publisher-core')}
						onClick={() => {
							setFocusSide('padding-all');
							setOpenPopover('padding-all');
						}}
						{...{
							value,
							attribute,
							blockName,
							description,
							defaultValue,
							resetToDefault,
							fieldId: 'padding.bottom',
							path: getControlPath(attribute, 'padding.bottom'),
						}}
					/>
				</div>

				<div
					className={controlInnerClassNames(
						'label-side',
						'side-horizontal',
						'side-padding-left'
					)}
					data-cy="box-spacing-padding-left"
				>
					<LabelControl
						ariaLabel={__('All Sides Padding', 'publisher-core')}
						label={fixLabelText(paddingTop)}
						popoverTitle={__('All Sides Padding', 'publisher-core')}
						onClick={() => {
							setFocusSide('padding-all');
							setOpenPopover('padding-all');
						}}
						{...{
							value,
							attribute,
							blockName,
							description,
							defaultValue,
							resetToDefault,
							fieldId: 'padding.left',
							path: getControlPath(attribute, 'padding.left'),
						}}
					/>
				</div>

				<SidePopover
					id={getId(id, 'padding.top')}
					type="padding"
					icon={<PaddingAllIcon />}
					onClose={() => {
						setFocusSide('');
						setOpenPopover('');
					}}
					title={__('All Sides Padding', 'publisher-core')}
					isOpen={openPopover === 'padding-all'}
					unit={paddingTop.unit}
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
			</>
		),
	};
}
