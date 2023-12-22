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
import MarginLeftIcon from '../../icons/margin-left';
import { MarginLeftSideShape } from './shapes/margin-left-shape';

export function MarginLeft({
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
	const marginLeft = extractNumberAndUnit(value.margin.left);

	const { leftMarginDragSetValue } = useDragSetValues({
		value,
		setValue,
	});

	const leftMarginDragValueHandler = useDragValue({
		value: marginLeft.value || 0,
		setValue: leftMarginDragSetValue,
		movement: 'horizontal',
		onEnd: () => {
			if (!openPopover) setFocusSide('');
		},
	});

	if (marginDisable === 'all' || marginDisable === 'horizontal') {
		return {
			shape: (
				<MarginLeftSideShape
					className={[
						'side-horizontal',
						'side-margin-left',
						'disabled-side',
					]}
				/>
			),
			label: <></>,
		};
	}

	if (value.marginLock !== 'none' && value.marginLock !== 'vertical') {
		return {
			shape: <></>,
			label: <></>,
		};
	}

	return {
		shape: (
			<MarginLeftSideShape
				className={[
					'side-horizontal',
					'side-margin-left',
					openPopover === 'margin-left' || focusSide === 'margin-left'
						? 'selected-side'
						: '',
					marginLeft.unit !== 'func' ? 'side-drag-active' : '',
				]}
				onMouseDown={(event) => {
					// prevent to catch double click
					if (event.detail > 1) {
						return;
					}

					if (marginLeft.unit === 'func') {
						event.preventDefault();
						return;
					}

					leftMarginDragValueHandler(event);
					setFocusSide('margin-left');
				}}
				onClick={(event) => {
					// open on double click
					if (event.detail > 1) {
						setFocusSide('margin-left');
						setOpenPopover('margin-left');
						return;
					}

					if (marginLeft.unit === 'func') {
						setOpenPopover('margin-left');
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
						'side-margin-left'
					)}
					data-cy="box-spacing-margin-left"
				>
					<LabelControl
						ariaLabel={__('Left Margin', 'publisher-core')}
						popoverTitle={__('Left Margin', 'publisher-core')}
						label={fixLabelText(marginLeft)}
						onClick={() => {
							setFocusSide('margin-left');
							setOpenPopover('margin-left');
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

					<SidePopover
						id={getId(id, 'margin.left')}
						icon={<MarginLeftIcon />}
						onClose={() => {
							setFocusSide('');
							setOpenPopover('');
						}}
						title={__('Left Margin', 'publisher-core')}
						isOpen={openPopover === 'margin-left'}
						unit={marginLeft.unit}
						onChange={(newValue) => {
							setValue({
								...value,
								margin: {
									...value.margin,
									left: newValue,
								},
							});
						}}
					/>
				</div>
			</>
		),
	};
}
