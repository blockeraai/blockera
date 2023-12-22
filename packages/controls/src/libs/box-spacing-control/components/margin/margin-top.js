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
import MarginTopIcon from '../../icons/margin-top';
import { MarginTopSideShape } from './shapes/margin-top-shape';

export function MarginTop({
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

	const { topMarginDragSetValue } = useDragSetValues({
		value,
		setValue,
	});

	const topMarginDragValueHandler = useDragValue({
		value: marginTop.value !== '' ? marginTop.value : 0,
		setValue: topMarginDragSetValue,
		movement: 'vertical',
		onEnd: () => {
			if (!openPopover) setFocusSide('');
		},
	});

	if (marginDisable === 'all' || marginDisable === 'vertical') {
		return {
			shape: (
				<MarginTopSideShape
					className={[
						'side-vertical',
						'side-margin-top',
						'disabled-side',
					]}
				/>
			),
			label: <></>,
		};
	}

	if (value.marginLock !== 'none' && value.marginLock !== 'horizontal') {
		return {
			shape: <></>,
			label: <></>,
		};
	}

	return {
		shape: (
			<MarginTopSideShape
				className={[
					'side-vertical',
					'side-margin-top',
					focusSide === 'margin-top' ? 'selected-side' : '',
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
					setFocusSide('margin-top');
				}}
				onClick={(event) => {
					// open on double click
					if (event.detail > 1) {
						setFocusSide('margin-top');
						setOpenPopover('margin-top');
						return;
					}

					if (marginTop.unit === 'func') {
						setOpenPopover('margin-top');
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
						ariaLabel={__('Top Margin', 'publisher-core')}
						label={fixLabelText(marginTop)}
						popoverTitle={__('Top Margin', 'publisher-core')}
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

					<SidePopover
						id={getId(id, 'margin.top')}
						icon={<MarginTopIcon />}
						onClose={() => {
							setFocusSide('');
							setOpenPopover('');
						}}
						title={__('Top Margin', 'publisher-core')}
						isOpen={openPopover === 'margin-top'}
						unit={marginTop.unit}
						onChange={(newValue) => {
							setValue({
								...value,
								margin: {
									...value.margin,
									top: newValue,
								},
							});
						}}
					/>
				</div>
			</>
		),
	};
}
