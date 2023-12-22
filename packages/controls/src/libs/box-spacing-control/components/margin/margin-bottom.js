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
import { SidePopover } from '../side-popover';
import { useDragSetValues } from '../../hooks/use-drag-setValues';
import { fixLabelText } from '../../utils';
import MarginBottomIcon from '../../icons/margin-bottom';
import { MarginBottomSideShape } from './shapes/margin-bottom-shape';
import type { SideProps, SideReturn } from '../../types';

export function MarginBottom({
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
	const marginBottom = extractNumberAndUnit(value.margin.bottom);

	const { bottomMarginDragSetValue } = useDragSetValues({
		value,
		setValue,
	});

	const bottomMarginDragValueHandler = useDragValue({
		value: marginBottom.value || 0,
		setValue: bottomMarginDragSetValue,
		movement: 'vertical',
		onEnd: () => {
			if (!openPopover) setFocusSide('');
		},
	});

	if (marginDisable === 'all' || marginDisable === 'vertical') {
		return {
			shape: (
				<MarginBottomSideShape
					className={[
						'side-vertical',
						'side-margin-bottom',
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
			<MarginBottomSideShape
				className={[
					'side-vertical',
					'side-margin-bottom',
					openPopover === 'margin-bottom' ||
					focusSide === 'margin-bottom'
						? 'selected-side'
						: '',
					marginBottom.unit !== 'func' ? 'side-drag-active' : '',
				]}
				onMouseDown={(event) => {
					// prevent to catch double click
					if (event.detail > 1) {
						return;
					}

					if (marginBottom.unit === 'func') {
						event.preventDefault();
						return;
					}

					bottomMarginDragValueHandler(event);
					setFocusSide('margin-bottom');
				}}
				onClick={(event) => {
					// open on double click
					if (event.detail > 1) {
						setFocusSide('margin-bottom');
						setOpenPopover('margin-bottom');
						return;
					}

					if (marginBottom.unit === 'func') {
						setOpenPopover('margin-bottom');
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
						'side-margin-bottom'
					)}
					data-cy="box-spacing-margin-bottom"
				>
					<LabelControl
						ariaLabel={__('Bottom Margin', 'publisher-core')}
						popoverTitle={__('Bottom Margin', 'publisher-core')}
						label={fixLabelText(marginBottom)}
						onClick={() => {
							setFocusSide('margin-bottom');
							setOpenPopover('margin-bottom');
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
					id={getId(id, 'margin.bottom')}
					icon={<MarginBottomIcon />}
					onClose={() => {
						setFocusSide('');
						setOpenPopover('');
					}}
					title={__('Bottom Margin', 'publisher-core')}
					isOpen={openPopover === 'margin-bottom'}
					unit={marginBottom.unit}
					onChange={(newValue) => {
						setValue({
							...value,
							margin: {
								...value.margin,
								bottom: newValue,
							},
						});
					}}
				/>
			</>
		),
	};
}
