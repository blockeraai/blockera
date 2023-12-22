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
import MarginTopBottomIcon from '../../icons/margin-top-bottom';
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
	description,
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
	const marginTop = extractNumberAndUnit(value.margin.top);

	const { topBottomMarginDragSetValue } = useDragSetValues({
		value,
		setValue,
	});

	const topMarginDragValueHandler = useDragValue({
		value: marginTop.value !== '' ? marginTop.value : 0,
		setValue: topBottomMarginDragSetValue,
		movement: 'vertical',
		onEnd: () => {
			if (!openPopover) setFocusSide('');
		},
	});

	let marginLock = value.marginLock;
	if (marginLock === 'vertical-horizontal') {
		marginLock = 'vertical';
	}

	if (
		marginLock !== 'vertical' ||
		(marginLock === 'vertical' && marginDisable === 'all')
	) {
		return {
			shape: <></>,
			label: <></>,
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
		};
	}

	return {
		shape: (
			<MarginVerticalSideShape
				className={[
					'side-vertical',
					'side-margin-vertical',
					focusSide === 'margin-vertical' ? 'selected-side' : '',
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

					topMarginDragValueHandler(event);
					setFocusSide('margin-vertical');
				}}
				onClick={(event) => {
					// open on double click
					if (event.detail > 1) {
						setFocusSide('margin-vertical');
						setOpenPopover('margin-vertical');
						return;
					}

					if (marginTop.unit === 'func') {
						setOpenPopover('margin-vertical');
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
						ariaLabel={__('Top & Bottom Margin', 'publisher-core')}
						label={fixLabelText(marginTop)}
						popoverTitle={__(
							'Top & Bottom Margin',
							'publisher-core'
						)}
						onClick={() => {
							setFocusSide('margin-vertical');
							setOpenPopover('margin-vertical');
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
						'side-margin-bottom'
					)}
					data-cy="box-spacing-margin-bottom"
				>
					<LabelControl
						ariaLabel={__('Top & Bottom Margin', 'publisher-core')}
						label={fixLabelText(marginTop)}
						popoverTitle={__(
							'Top & Bottom Margin',
							'publisher-core'
						)}
						onClick={() => {
							setFocusSide('margin-vertical');
							setOpenPopover('margin-vertical');
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

				<SidePopover
					id={getId(id, 'margin.top')}
					type="margin"
					icon={<MarginTopBottomIcon />}
					onClose={() => {
						setFocusSide('');
						setOpenPopover('');
					}}
					title={__('Top & Bottom Margin', 'publisher-core')}
					isOpen={openPopover === 'margin-vertical'}
					unit={extractNumberAndUnit(value.margin.top).unit}
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
			</>
		),
	};
}
