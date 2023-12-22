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
import { SidePopover } from '../side-popover';
import MarginAllIcon from '../../icons/margin-all';
import { useDragSetValues } from '../../hooks/use-drag-setValues';
import { MarginAllSideShape } from './shapes/margin-all-shape';
import type { SideProps, SideReturn } from '../../types';
import { fixLabelText } from '../../utils';

export function MarginAll({
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
	const marginTop = extractNumberAndUnit(value.margin.top);

	const { allMarginDragSetValue } = useDragSetValues({ value, setValue });

	const allMarginDragValueHandler = useDragValue({
		value: marginTop.value !== '' ? marginTop.value : 0,
		setValue: allMarginDragSetValue,
		movement: 'vertical',
		onEnd: () => {
			if (!openPopover) setFocusSide('');
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
					focusSide === 'margin-all' ? 'selected-side' : '',
					marginTop.unit !== 'func' ? 'side-drag-active' : '',
				]}
				onMouseDown={(event) => {
					// prevent to catch double click
					if (event.detail > 1) {
						return;
					}

					if (marginTop.unit === 'func') {
						event.preventDefault();
						return;
					}

					allMarginDragValueHandler(event);
					setFocusSide('margin-all');
				}}
				onClick={(event) => {
					// open on double click
					if (event.detail > 1) {
						setFocusSide('margin-all');
						setOpenPopover('margin-all');
						return;
					}

					if (marginTop.unit === 'func') {
						setOpenPopover('margin-all');
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
						'side-margin-top'
					)}
					data-cy="box-spacing-margin-top"
				>
					<LabelControl
						ariaLabel={__('All Sides Margin', 'publisher-core')}
						label={fixLabelText(marginTop)}
						popoverTitle={__('All Sides Margin', 'publisher-core')}
						onClick={() => {
							setFocusSide('margin-top');
							setOpenPopover('margin-top');
						}}
						{...{
							value,
							attribute,
							blockName,
							description,
							defaultValue,
							resetToDefault,
							fieldId: 'margin.top',
							path: getControlPath(attribute, 'margin.top'),
						}}
					/>
				</div>

				<div
					className={controlInnerClassNames(
						'label-side',
						'side-vertical',
						'side-margin-right'
					)}
					data-cy="box-spacing-margin-right"
				>
					<LabelControl
						ariaLabel={__('All Sides Margin', 'publisher-core')}
						label={fixLabelText(marginTop)}
						popoverTitle={__('All Sides Margin', 'publisher-core')}
						onClick={() => {
							setFocusSide('margin-top');
							setOpenPopover('margin-top');
						}}
						{...{
							value,
							attribute,
							blockName,
							description,
							defaultValue,
							resetToDefault,
							fieldId: 'margin.right',
							path: getControlPath(attribute, 'margin.right'),
						}}
					/>
				</div>

				<div
					className={controlInnerClassNames(
						'label-side',
						'side-vertical',
						'side-margin-bottom'
					)}
					data-cy="box-spacing-margin-bottom"
				>
					<LabelControl
						ariaLabel={__('All Sides Margin', 'publisher-core')}
						label={fixLabelText(marginTop)}
						popoverTitle={__('All Sides Margin', 'publisher-core')}
						onClick={() => {
							setFocusSide('margin-top');
							setOpenPopover('margin-top');
						}}
						{...{
							value,
							attribute,
							blockName,
							description,
							defaultValue,
							resetToDefault,
							fieldId: 'margin.bottom',
							path: getControlPath(attribute, 'margin.bottom'),
						}}
					/>
				</div>

				<div
					className={controlInnerClassNames(
						'label-side',
						'side-vertical',
						'side-margin-left'
					)}
					data-cy="box-spacing-margin-left"
				>
					<LabelControl
						ariaLabel={__('All Sides Margin', 'publisher-core')}
						label={fixLabelText(marginTop)}
						popoverTitle={__('All Sides Margin', 'publisher-core')}
						onClick={() => {
							setFocusSide('margin-top');
							setOpenPopover('margin-top');
						}}
						{...{
							value,
							attribute,
							blockName,
							description,
							defaultValue,
							resetToDefault,
							fieldId: 'margin.left',
							path: getControlPath(attribute, 'margin.left'),
						}}
					/>
				</div>

				<SidePopover
					id={getId(id, 'margin.top')}
					type="margin"
					icon={<MarginAllIcon />}
					onClose={() => {
						setFocusSide('');
						setOpenPopover('');
					}}
					title={__('All Sides Margin', 'publisher-core')}
					isOpen={openPopover === 'margin-all'}
					unit={extractNumberAndUnit(value.margin.top).unit}
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
				/>
			</>
		),
	};
}
