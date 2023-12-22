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
import PaddingTopBottomIcon from '../../icons/padding-top-bottom';
import { PaddingVerticalShape } from './shapes/padding-vertical-shape';
import { fixLabelText } from '../../utils';

export function PaddingVertical({
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
	paddingDisable,
}: SideProps): SideReturn {
	const paddingTop = extractNumberAndUnit(value.padding.top);

	const { topBottomPaddingDragSetValue } = useDragSetValues({
		value,
		setValue,
	});

	const topPaddingDragValueHandler = useDragValue({
		value: paddingTop.value || 0,
		setValue: topBottomPaddingDragSetValue,
		movement: 'vertical',
		min: 0,
		onEnd: () => {
			if (!openPopover) setFocusSide('');
		},
	});

	let paddingLock = value.paddingLock;
	if (paddingLock === 'vertical-horizontal') {
		paddingLock = 'vertical';
	}

	if (
		paddingLock !== 'vertical' ||
		(paddingLock === 'vertical' && paddingDisable === 'all')
	) {
		return {
			shape: <></>,
			label: <></>,
		};
	}

	if (paddingDisable === 'vertical') {
		return {
			shape: (
				<PaddingVerticalShape
					className={[
						'side-vertical',
						'side-padding-vertical',
						'disabled-side',
					]}
				/>
			),
			label: <></>,
		};
	}

	return {
		shape: (
			<PaddingVerticalShape
				className={[
					'side-vertical',
					'side-padding-vertical',
					openPopover === 'padding-vertical' ||
					focusSide === 'padding-vertical'
						? 'selected-side'
						: '',
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

					topPaddingDragValueHandler(event);
					setFocusSide('padding-vertical');
				}}
				onClick={(event) => {
					// open on double click
					if (event.detail > 1) {
						setFocusSide('padding-vertical');
						setOpenPopover('padding-vertical');
						return;
					}

					if (paddingTop.unit === 'func') {
						setOpenPopover('padding-vertical');
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
						ariaLabel={__('Top & Bottom Padding', 'publisher-core')}
						label={fixLabelText(paddingTop)}
						popoverTitle={__(
							'Top & Bottom Padding',
							'publisher-core'
						)}
						onClick={() => {
							setFocusSide('padding-vertical');
							setOpenPopover('padding-vertical');
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
						'side-vertical',
						'side-padding-bottom'
					)}
					data-cy="box-spacing-padding-bottom"
				>
					<LabelControl
						ariaLabel={__('Top & Bottom Padding', 'publisher-core')}
						label={fixLabelText(paddingTop)}
						popoverTitle={__(
							'Top & Bottom Padding',
							'publisher-core'
						)}
						onClick={() => {
							setFocusSide('padding-vertical');
							setOpenPopover('padding-vertical');
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

				<SidePopover
					id={getId(id, 'padding.top')}
					type="padding"
					icon={<PaddingTopBottomIcon />}
					onClose={() => {
						setFocusSide('');
						setOpenPopover('');
					}}
					title={__('Top & Bottom Padding', 'publisher-core')}
					isOpen={openPopover === 'padding-vertical'}
					unit={extractNumberAndUnit(value.padding.top).unit}
					onChange={(newValue) => {
						setValue({
							...value,
							padding: {
								...value.padding,
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
