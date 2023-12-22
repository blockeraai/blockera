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
import PaddingBottomIcon from '../../icons/padding-bottom';
import { PaddingBottomSideShape } from './shapes/padding-bottom-shape';

export function PaddingBottom({
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
	const paddingBottom = extractNumberAndUnit(value.padding.bottom);

	const { bottomPaddingDragSetValue } = useDragSetValues({
		value,
		setValue,
	});

	const bottomPaddingDragValueHandler = useDragValue({
		value: paddingBottom.value || 0,
		setValue: bottomPaddingDragSetValue,
		movement: 'vertical',
		min: 0,
		onEnd: () => {
			if (!openPopover) setFocusSide('');
		},
	});

	if (paddingDisable === 'all' || paddingDisable === 'vertical') {
		return {
			shape: (
				<PaddingBottomSideShape
					className={[
						'side-vertical',
						'side-padding-bottom',
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
			<PaddingBottomSideShape
				className={[
					'side-vertical',
					'side-padding-bottom',
					openPopover === 'padding-bottom' ||
					focusSide === 'padding-bottom'
						? 'selected-side'
						: '',
					paddingBottom.unit !== 'func' ? 'side-drag-active' : '',
				]}
				onMouseDown={(event) => {
					// prevent to catch double click
					if (event.detail > 1) {
						return;
					}

					if (paddingBottom.unit === 'func') {
						event.preventDefault();
						return;
					}

					bottomPaddingDragValueHandler(event);
					setFocusSide('padding-bottom');
				}}
				onClick={(event) => {
					// open on double click
					if (event.detail > 1) {
						setFocusSide('padding-bottom');
						setOpenPopover('padding-bottom');
						return;
					}

					if (paddingBottom.unit === 'func') {
						setOpenPopover('padding-bottom');
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
						'side-padding-bottom'
					)}
					data-cy="box-spacing-padding-bottom"
				>
					<LabelControl
						ariaLabel={__('Bottom Padding', 'publisher-core')}
						label={fixLabelText(paddingBottom)}
						popoverTitle={__('Bottom Padding', 'publisher-core')}
						onClick={() => {
							setFocusSide('padding-bottom');
							setOpenPopover('padding-bottom');
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
					id={getId(id, 'padding.bottom')}
					type="padding"
					icon={<PaddingBottomIcon />}
					onClose={() => {
						setFocusSide('');
						setOpenPopover('');
					}}
					title={__('Bottom Padding', 'publisher-core')}
					isOpen={openPopover === 'padding-bottom'}
					unit={paddingBottom.unit}
					onChange={(newValue) => {
						setValue({
							...value,
							padding: {
								...value.padding,
								bottom: newValue,
							},
						});
					}}
				/>
			</>
		),
	};
}
