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
import { useDragSetValues } from '../../hooks/use-drag-setValues';
import MarginLeftRightIcon from '../../icons/margin-left-right';
import { MarginHorizontalSideShape } from './shapes/margin-horizontal-shape';
import type { SideProps, SideReturn } from '../../types';
import { fixLabelText } from '../../utils';

export function MarginHorizontal({
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
	const marginRight = extractNumberAndUnit(value.margin.right);

	const { leftRightMarginDragSetValue } = useDragSetValues({
		value,
		setValue,
	});

	const rightMarginDragValueHandler = useDragValue({
		value: marginRight.value || 0,
		setValue: leftRightMarginDragSetValue,
		movement: 'horizontal',
		onEnd: () => {
			if (!openPopover) setFocusSide('');
		},
	});

	let marginLock = value.marginLock;
	if (marginLock === 'vertical-horizontal') {
		marginLock = 'horizontal';
	}

	if (
		marginLock !== 'horizontal' ||
		(marginLock === 'horizontal' && marginDisable === 'all')
	) {
		return {
			shape: <></>,
			label: <></>,
		};
	}

	if (marginDisable === 'horizontal') {
		return {
			shape: (
				<MarginHorizontalSideShape
					className={[
						'side-horizontal',
						'side-margin-horizontal',
						'disabled-side',
					]}
				/>
			),
			label: <></>,
		};
	}

	return {
		shape: (
			<>
				{
					<MarginHorizontalSideShape
						className={[
							'side-horizontal',
							'side-margin-horizontal',
							focusSide === 'margin-horizontal'
								? 'selected-side'
								: '',
							marginRight.unit !== 'func'
								? 'side-drag-active'
								: '',
						]}
						onMouseDown={(event) => {
							// prevent to catch double click
							if (event.detail > 1) {
								return;
							}

							if (marginRight.unit === 'func') {
								event.preventDefault();
								return;
							}

							rightMarginDragValueHandler(event);
							setFocusSide('margin-horizontal');
						}}
						onClick={(event) => {
							// open on double click
							if (event.detail > 1) {
								setFocusSide('margin-horizontal');
								setOpenPopover('margin-horizontal');
								return;
							}

							if (marginRight.unit === 'func') {
								setOpenPopover('margin-horizontal');
							}
						}}
					/>
				}
			</>
		),
		label: (
			<>
				<div
					className={controlInnerClassNames(
						'label-side',
						'side-horizontal',
						'side-margin-right'
					)}
					data-cy="box-spacing-margin-right"
				>
					<LabelControl
						ariaLabel={__('Left & Right Margin', 'publisher-core')}
						label={fixLabelText(marginRight)}
						popoverTitle={__(
							'Left & Right Margin',
							'publisher-core'
						)}
						onClick={() => {
							setFocusSide('margin-horizontal');
							setOpenPopover('margin-horizontal');
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
						'side-horizontal',
						'side-margin-left'
					)}
					data-cy="box-spacing-margin-left"
				>
					<LabelControl
						ariaLabel={__('Left & Right Margin', 'publisher-core')}
						label={fixLabelText(marginRight)}
						popoverTitle={__(
							'Left & Right Margin',
							'publisher-core'
						)}
						onClick={() => {
							setFocusSide('margin-horizontal');
							setOpenPopover('margin-horizontal');
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
					id={getId(id, 'margin.left')}
					type="margin"
					icon={<MarginLeftRightIcon />}
					onClose={() => {
						setFocusSide('');
						setOpenPopover('');
					}}
					title={__('Left & Right Margin', 'publisher-core')}
					isOpen={openPopover === 'margin-horizontal'}
					unit={extractNumberAndUnit(value.margin.left).unit}
					onChange={(newValue) => {
						setValue({
							...value,
							margin: {
								...value.margin,
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
