// @flow
/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Publisher dependencies
 */
import { controlInnerClassNames } from '@publisher/classnames';
import { useDragValue } from '@publisher/utils';

/**
 * Internal dependencies
 */
import { extractNumberAndUnit, LabelControl } from '../../../index';
import type { SideProps, SideReturn } from '../../types';
import { SidePopover } from '../side-popover';
import { useDragSetValues } from '../../hooks/use-drag-setValues';
import { fixLabelText } from '../../utils';
import PaddingTopIcon from '../../icons/padding-top';
import { PaddingTopShape } from './shapes/padding-top-shape';

export function PaddingTop({
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

	const { topPaddingDragSetValue } = useDragSetValues({
		value,
		setValue,
	});

	const topPaddingDragValueHandler = useDragValue({
		value: paddingTop.value || 0,
		setValue: topPaddingDragSetValue,
		movement: 'vertical',
		min: 0,
		onEnd: () => {
			if (!openPopover) setFocusSide('');
		},
	});

	if (paddingDisable === 'all' || paddingDisable === 'vertical') {
		return {
			shape: (
				<PaddingTopShape
					className={[
						'side-vertical',
						'side-padding-top',
						'disabled-side',
					]}
				/>
			),
			label: <></>,
		};
	}

	if (value.paddingLock !== 'none' && value.paddingLock !== 'horizontal') {
		return {
			shape: <></>,
			label: <></>,
		};
	}

	return {
		shape: (
			<PaddingTopShape
				className={[
					'side-vertical',
					'side-padding-top',
					openPopover === 'padding-top' || focusSide === 'padding-top'
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
					setFocusSide('padding-top');
				}}
				onClick={(event) => {
					// open on double click
					if (event.detail > 1) {
						setFocusSide('padding-top');
						setOpenPopover('padding-top');
						return;
					}

					if (paddingTop.unit === 'func') {
						setOpenPopover('padding-top');
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
						ariaLabel={__('Top Padding', 'publisher-core')}
						label={fixLabelText(paddingTop)}
						popoverTitle={__('Top Padding', 'publisher-core')}
						onClick={() => {
							setFocusSide('padding-top');
							setOpenPopover('padding-top');
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

				<SidePopover
					id={getId(id, 'padding.top')}
					type="padding"
					icon={<PaddingTopIcon />}
					onClose={() => {
						setFocusSide('');
						setOpenPopover('');
					}}
					title={__('Top Padding', 'publisher-core')}
					isOpen={openPopover === 'padding-top'}
					unit={paddingTop.unit}
					onChange={(newValue) => {
						setValue({
							...value,
							padding: {
								...value.padding,
								top: newValue,
							},
						});
					}}
				/>
			</>
		),
	};
}
