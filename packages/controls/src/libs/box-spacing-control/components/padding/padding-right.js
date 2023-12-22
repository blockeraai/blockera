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
import PaddingRightIcon from '../../icons/padding-right';
import { PaddingRightShape } from './shapes/padding-right-shape';

export function PaddingRight({
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
	const paddingRight = extractNumberAndUnit(value.padding.right);

	const { rightPaddingDragSetValue } = useDragSetValues({
		value,
		setValue,
	});

	const rightPaddingDragValueHandler = useDragValue({
		value: paddingRight.value || 0,
		setValue: rightPaddingDragSetValue,
		movement: 'horizontal',
		min: 0,
		onEnd: () => {
			if (!openPopover) setFocusSide('');
		},
	});

	if (paddingDisable === 'all' || paddingDisable === 'horizontal') {
		return {
			shape: (
				<PaddingRightShape
					className={[
						'side-horizontal',
						'side-padding-right',
						'disabled-side',
					]}
				/>
			),
			label: <></>,
		};
	}

	if (value.paddingLock !== 'none' && value.paddingLock !== 'vertical') {
		return {
			shape: <></>,
			label: <></>,
		};
	}

	return {
		shape: (
			<PaddingRightShape
				className={[
					'side-horizontal',
					'side-padding-right',
					openPopover === 'padding-right' ||
					focusSide === 'padding-right'
						? 'selected-side'
						: '',
					paddingRight.unit !== 'func' ? 'side-drag-active' : '',
				]}
				onMouseDown={(event) => {
					// prevent to catch double click
					if (event.detail > 1) {
						return;
					}

					if (paddingRight.unit === 'func') {
						event.preventDefault();
						return;
					}

					rightPaddingDragValueHandler(event);
					setFocusSide('padding-right');
				}}
				onClick={(event) => {
					// open on double click
					if (event.detail > 1) {
						setFocusSide('padding-right');
						setOpenPopover('padding-right');
						return;
					}

					if (paddingRight.unit === 'func') {
						setOpenPopover('padding-right');
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
						'side-padding-right'
					)}
					data-cy="box-spacing-padding-right"
				>
					<LabelControl
						ariaLabel={__('Right Padding', 'publisher-core')}
						label={fixLabelText(paddingRight)}
						popoverTitle={__('Right Padding', 'publisher-core')}
						onClick={() => {
							setFocusSide('padding-right');
							setOpenPopover('padding-right');
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

				<SidePopover
					id={getId(id, 'padding.right')}
					offset={215}
					type="padding"
					icon={<PaddingRightIcon />}
					onClose={() => {
						setFocusSide('');
						setOpenPopover('');
					}}
					title={__('Right Padding', 'publisher-core')}
					isOpen={openPopover === 'padding-right'}
					unit={paddingRight.unit}
					onChange={(newValue) => {
						setValue({
							...value,
							padding: {
								...value.padding,
								right: newValue,
							},
						});
					}}
				/>
			</>
		),
	};
}
