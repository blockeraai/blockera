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
import PaddingLeftRightIcon from '../../icons/padding-left-right';
import { PaddingHorizontalShape } from './shapes/padding-horizontal-shape';
import { fixLabelText } from '../../utils';

export function PaddingHorizontal({
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

	const { leftRightPaddingDragSetValue } = useDragSetValues({
		value,
		setValue,
	});

	const rightPaddingDragValueHandler = useDragValue({
		value: paddingRight.value || 0,
		setValue: leftRightPaddingDragSetValue,
		movement: 'horizontal',
		min: 0,
		onEnd: () => {
			if (!openPopover) setFocusSide('');
		},
	});

	let paddingLock = value.paddingLock;
	if (paddingLock === 'vertical-horizontal') {
		paddingLock = 'horizontal';
	}

	if (
		paddingLock !== 'horizontal' ||
		(paddingLock === 'horizontal' && paddingDisable === 'all')
	) {
		return {
			shape: <></>,
			label: <></>,
		};
	}

	if (paddingDisable === 'horizontal') {
		return {
			shape: (
				<PaddingHorizontalShape
					className={[
						'side-horizontal',
						'side-padding-horizontal',
						'disabled-side',
					]}
				/>
			),
			label: <></>,
		};
	}

	return {
		shape: (
			<PaddingHorizontalShape
				className={[
					'side-horizontal',
					'side-padding-right',
					openPopover === 'padding-horizontal' ||
					focusSide === 'padding-horizontal'
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
					setFocusSide('padding-horizontal');
				}}
				onClick={(event) => {
					// open on double click
					if (event.detail > 1) {
						setFocusSide('padding-horizontal');
						setOpenPopover('padding-horizontal');
						return;
					}

					if (paddingRight.unit === 'func') {
						setOpenPopover('padding-horizontal');
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
						ariaLabel={__('left & Right Padding', 'publisher-core')}
						label={fixLabelText(paddingRight)}
						popoverTitle={__(
							'left & Right Padding',
							'publisher-core'
						)}
						onClick={() => {
							setFocusSide('padding-horizontal');
							setOpenPopover('padding-horizontal');
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
						'side-horizontal',
						'side-padding-left'
					)}
					data-cy="box-spacing-padding-left"
				>
					<LabelControl
						ariaLabel={__('left & Right Padding', 'publisher-core')}
						label={fixLabelText(paddingRight)}
						popoverTitle={__(
							'left & Right Padding',
							'publisher-core'
						)}
						onClick={() => {
							setFocusSide('padding-horizontal');
							setOpenPopover('padding-horizontal');
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
					id={getId(id, 'padding.left')}
					type="padding"
					icon={<PaddingLeftRightIcon />}
					onClose={() => {
						setFocusSide('');
						setOpenPopover('');
					}}
					title={__('left & Right Padding', 'publisher-core')}
					isOpen={openPopover === 'padding-horizontal'}
					unit={extractNumberAndUnit(value.padding.left).unit}
					onChange={(newValue) => {
						setValue({
							...value,
							padding: {
								...value.padding,
								left: newValue,
								right: newValue,
							},
						});
					}}
				/>
			</>
		),
	};
}
