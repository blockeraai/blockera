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
import PaddingLeftIcon from '../../icons/padding-left';
import { PaddingLeftShape } from './shapes/padding-left-shape';

export function PaddingLeft({
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
	const paddingLeft = extractNumberAndUnit(value.padding.left);

	const { leftPaddingDragSetValue } = useDragSetValues({
		value,
		setValue,
	});

	const leftPaddingDragValueHandler = useDragValue({
		value: paddingLeft.value || 0,
		setValue: leftPaddingDragSetValue,
		movement: 'horizontal',
		min: 0,
		onEnd: () => {
			if (!openPopover) setFocusSide('');
		},
	});

	if (paddingDisable === 'all' || paddingDisable === 'horizontal') {
		return {
			shape: (
				<PaddingLeftShape
					className={[
						'side-horizontal',
						'side-padding-left',
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
			<PaddingLeftShape
				className={[
					'side-left',
					'side-padding-left',
					openPopover === 'padding-left' ||
					focusSide === 'padding-left'
						? 'selected-side'
						: '',
					paddingLeft.unit !== 'func' ? 'side-drag-active' : '',
				]}
				onMouseDown={(event) => {
					// prevent to catch double click
					if (event.detail > 1) {
						return;
					}

					if (paddingLeft.unit === 'func') {
						event.preventDefault();
						return;
					}

					leftPaddingDragValueHandler(event);
					setFocusSide('padding-left');
				}}
				onClick={(event) => {
					// open on double click
					if (event.detail > 1) {
						setFocusSide('padding-left');
						setOpenPopover('padding-left');
						return;
					}

					if (paddingLeft.unit === 'func') {
						setOpenPopover('padding-left');
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
						'side-padding-left'
					)}
					data-cy="box-spacing-padding-left"
				>
					<LabelControl
						ariaLabel={__('Left Padding', 'publisher-core')}
						label={fixLabelText(paddingLeft)}
						popoverTitle={__('Left Padding', 'publisher-core')}
						onClick={() => {
							setFocusSide('padding-left');
							setOpenPopover('padding-left');
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
					offset={78}
					type="padding"
					icon={<PaddingLeftIcon />}
					onClose={() => {
						setFocusSide('');
						setOpenPopover('');
					}}
					title={__('Left Padding', 'publisher-core')}
					isOpen={openPopover === 'padding-left'}
					unit={paddingLeft.unit}
					onChange={(newValue) => {
						setValue({
							...value,
							padding: {
								...value.padding,
								left: newValue,
							},
						});
					}}
				/>
			</>
		),
	};
}
