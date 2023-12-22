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
import MarginRightIcon from '../../icons/margin-right';
import { MarginRightSideShape } from './shapes/margin-right-shape';

export function MarginRight({
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

	const { rightMarginDragSetValue } = useDragSetValues({
		value,
		setValue,
	});

	const rightMarginDragValueHandler = useDragValue({
		value: marginRight.value || 0,
		setValue: rightMarginDragSetValue,
		movement: 'horizontal',
		onEnd: () => {
			if (!openPopover) setFocusSide('');
		},
	});

	if (marginDisable === 'all' || marginDisable === 'horizontal') {
		return {
			shape: (
				<MarginRightSideShape
					className={[
						'side-horizontal',
						'side-margin-right',
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
			<MarginRightSideShape
				className={[
					'side-horizontal',
					'side-margin-right',
					openPopover === 'margin-right' ||
					focusSide === 'margin-right'
						? 'selected-side'
						: '',
					marginRight.unit !== 'func' ? 'side-drag-active' : '',
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
					setFocusSide('margin-right');
				}}
				onClick={(event) => {
					// open on double click
					if (event.detail > 1) {
						setFocusSide('margin-right');
						setOpenPopover('margin-right');
						return;
					}

					if (marginRight.unit === 'func') {
						setOpenPopover('margin-right');
					}
				}}
			/>
		),
		label: (
			<>
				{marginDisable !== 'horizontal' && marginDisable !== 'all' && (
					<div
						className={controlInnerClassNames(
							'label-side',
							'side-horizontal',
							'side-margin-right'
						)}
						data-cy="box-spacing-margin-right"
					>
						<LabelControl
							ariaLabel={__('Right Margin', 'publisher-core')}
							popoverTitle={__('Right Margin', 'publisher-core')}
							label={fixLabelText(marginRight)}
							onClick={() => {
								setFocusSide('margin-right');
								setOpenPopover('margin-right');
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

						<SidePopover
							id={getId(id, 'margin.right')}
							offset={255}
							icon={<MarginRightIcon />}
							onClose={() => {
								setFocusSide('');
								setOpenPopover('');
							}}
							title={__('Right Margin', 'publisher-core')}
							isOpen={openPopover === 'margin-right'}
							unit={marginRight.unit}
							onChange={(newValue) => {
								setValue({
									...value,
									margin: {
										...value.margin,
										right: newValue,
									},
								});
							}}
						/>
					</div>
				)}
			</>
		),
	};
}
