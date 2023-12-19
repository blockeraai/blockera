// @flow
/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';
import PropTypes from 'prop-types';

/**
 * Publisher dependencies
 */
import {
	controlClassNames,
	controlInnerClassNames,
} from '@publisher/classnames';
import { useDragValue } from '@publisher/utils';

/**
 * Internal dependencies
 */
import { LabelControl, BaseControl } from '../index';
import { SidePopover } from './components/side-popover';
import { useControlContext } from '../../context';
import { useDragSetValues } from './hooks/use-drag-setValues';
import { extractNumberAndUnit } from '../input-control/utils';

/**
 * Types
 */
import type { BoxSpacingControlProps } from './types';
import type { MixedElement } from 'react';

// icons
import { default as MarginTopIcon } from './icons/margin-top';
import { default as MarginRightIcon } from './icons/margin-right';
import { default as MarginBottomIcon } from './icons/margin-bottom';
import { default as MarginLeftIcon } from './icons/margin-left';
import { default as PaddingTopIcon } from './icons/padding-top';
import { default as PaddingRightIcon } from './icons/padding-right';
import { default as PaddingBottomIcon } from './icons/padding-bottom';
import { default as PaddingLeftIcon } from './icons/padding-left';

export default function BoxSpacingControl({
	className,
	openSide = '',
	//
	id,
	label = '',
	columns = '',
	defaultValue = {
		margin: {
			top: '',
			right: '',
			bottom: '',
			left: '',
		},
		padding: {
			top: '',
			right: '',
			bottom: '',
			left: '',
		},
	},
	onChange = () => {},
	field,
	//
	...props
}: BoxSpacingControlProps): MixedElement {
	const {
		value,
		setValue,
		getId,
		attribute,
		blockName,
		description,
		resetToDefault,
		getControlPath,
	} = useControlContext({
		id,
		onChange,
		defaultValue,
		mergeInitialAndDefault: true,
	});

	const marginTop = extractNumberAndUnit(value.margin.top);
	const marginRight = extractNumberAndUnit(value.margin.right);
	const marginBottom = extractNumberAndUnit(value.margin.bottom);
	const marginLeft = extractNumberAndUnit(value.margin.left);

	const paddingTop = extractNumberAndUnit(value.padding.top);
	const paddingRight = extractNumberAndUnit(value.padding.right);
	const paddingBottom = extractNumberAndUnit(value.padding.bottom);
	const paddingLeft = extractNumberAndUnit(value.padding.left);

	const {
		// margin set values
		topMarginDragSetValue,
		leftMarginDragSetValue,
		rightMarginDragSetValue,
		bottomMarginDragSetValue,

		// padding set values
		topPaddingDragSetValue,
		leftPaddingDragSetValue,
		rightPaddingDragSetValue,
		bottomPaddingDragSetValue,
	} = useDragSetValues({ value, setValue });

	const topMarginDragValueHandler = useDragValue({
		value: marginTop.value !== '' ? marginTop.value : 0,
		setValue: topMarginDragSetValue,
		movement: 'vertical',
		onEnd: () => {
			setFocusSide('');
		},
	});

	const leftMarginDragValueHandler = useDragValue({
		value: marginLeft.value || 0,
		setValue: leftMarginDragSetValue,
		movement: 'horizontal',
		onEnd: () => {
			setFocusSide('');
		},
	});

	const rightMarginDragValueHandler = useDragValue({
		value: marginRight.value || 0,
		setValue: rightMarginDragSetValue,
		movement: 'horizontal',
		onEnd: () => {
			setFocusSide('');
		},
	});

	const bottomMarginDragValueHandler = useDragValue({
		value: marginBottom.value || 0,
		setValue: bottomMarginDragSetValue,
		movement: 'vertical',
		onEnd: () => {
			setFocusSide('');
		},
	});

	const topPaddingDragValueHandler = useDragValue({
		value: paddingTop.value || 0,
		setValue: topPaddingDragSetValue,
		movement: 'vertical',
		min: 0,
		onEnd: () => {
			setFocusSide('');
		},
	});

	const leftPaddingDragValueHandler = useDragValue({
		value: paddingLeft.value || 0,
		setValue: leftPaddingDragSetValue,
		movement: 'horizontal',
		min: 0,
		onEnd: () => {
			setFocusSide('');
		},
	});

	const rightPaddingDragValueHandler = useDragValue({
		value: paddingRight.value || 0,
		setValue: rightPaddingDragSetValue,
		movement: 'horizontal',
		min: 0,
		onEnd: () => {
			setFocusSide('');
		},
	});

	const bottomPaddingDragValueHandler = useDragValue({
		value: paddingBottom.value || 0,
		setValue: bottomPaddingDragSetValue,
		movement: 'vertical',
		min: 0,
		onEnd: () => {
			setFocusSide('');
		},
	});

	const [openPopover, setOpenPopover] = useState(openSide);
	const [focusSide, setFocusSide] = useState('');

	function fixLabelText(value: Object | string): any {
		if (value === '') {
			return '-';
		}

		const extracted = extractNumberAndUnit(value);

		if (extracted.value === '' && extracted.unit === '') {
			return '-';
		}

		switch (extracted.unit) {
			case 'func':
				return <b>CSS</b>;

			case 'px':
				return extracted.value !== '' ? extracted.value : '0';

			case 'auto':
				return <b>AUTO</b>;

			default:
				return (
					<>
						{extracted.value !== '' ? extracted.value : '0'}
						<i>{extracted.unit}</i>
					</>
				);
		}
	}

	return (
		<BaseControl
			label={label}
			columns={columns}
			controlName={field}
			className={className}
			{...(label
				? {
						value,
						attribute,
						blockName,
						description,
						defaultValue,
						resetToDefault,
						mode: 'advanced',
				  }
				: {})}
		>
			<div
				{...props}
				className={controlClassNames('box-spacing', className)}
				data-cy="box-spacing-control"
			>
				<svg
					width="250"
					height="159"
					viewBox="0 0 250 159"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						className={controlInnerClassNames(
							'shape-side',
							'side-horizontal',
							'side-margin-top',
							openPopover === 'margin-top' ||
								focusSide === 'margin-top'
								? 'selected-side'
								: '',
							marginTop.unit !== 'func' ? 'side-drag-active' : ''
						)}
						onMouseDown={(event) => {
							if (marginTop.unit === 'func') {
								event.preventDefault();
								return;
							}

							topMarginDragValueHandler(event);
							setFocusSide('margin-top');
						}}
						onClick={() => {
							if (marginTop.unit === 'func') {
								setOpenPopover('margin-top');
							}
						}}
						d="M6.242 0.5H243.757C245.094 0.5 245.763 2.11571 244.818 3.06066L218.697 29.182C217.853 30.0259 216.708 30.5 215.515 30.5H34.4846C33.2912 30.5 32.1466 30.0259 31.3027 29.182L5.18134 3.06066C4.2364 2.11571 4.90565 0.5 6.242 0.5Z"
					/>

					<path
						className={controlInnerClassNames(
							'shape-side',
							'side-vertical',
							'side-margin-right',
							openPopover === 'margin-right' ||
								focusSide === 'margin-right'
								? 'selected-side'
								: '',
							marginRight.unit !== 'func'
								? 'side-drag-active'
								: ''
						)}
						onMouseDown={(event) => {
							if (marginRight.unit === 'func') {
								event.preventDefault();
								return;
							}

							rightMarginDragValueHandler(event);
							setFocusSide('margin-right');
						}}
						onClick={() => {
							if (marginRight.unit === 'func') {
								setOpenPopover('margin-right');
							}
						}}
						d="M219.5 124.468V34.4854C219.5 33.2919 219.974 32.1473 220.818 31.3034L246.939 5.18207C247.884 4.23713 249.5 4.90638 249.5 6.24273V152.711C249.5 154.047 247.884 154.716 246.939 153.771L220.818 127.65C219.974 126.806 219.5 125.661 219.5 124.468Z"
					/>

					<path
						className={controlInnerClassNames(
							'shape-side',
							'side-horizontal',
							'side-margin-bottom',
							openPopover === 'margin-bottom' ||
								focusSide === 'margin-bottom'
								? 'selected-side'
								: '',
							marginBottom.unit !== 'func'
								? 'side-drag-active'
								: ''
						)}
						onMouseDown={(event) => {
							if (marginBottom.unit === 'func') {
								event.preventDefault();
								return;
							}

							bottomMarginDragValueHandler(event);
							setFocusSide('margin-bottom');
						}}
						onClick={() => {
							if (marginBottom.unit === 'func') {
								setOpenPopover('margin-bottom');
							}
						}}
						d="M218.744 129.818L244.865 155.939C245.81 156.884 245.141 158.5 243.804 158.5H6.1961C4.85974 158.5 4.19049 156.884 5.13544 155.939L31.2568 129.818C32.1007 128.974 33.2453 128.5 34.4387 128.5H215.562C216.755 128.5 217.9 128.974 218.744 129.818Z"
					/>

					<path
						className={controlInnerClassNames(
							'shape-side',
							'side-vertical',
							'side-margin-left',
							openPopover === 'margin-left' ||
								focusSide === 'margin-left'
								? 'selected-side'
								: '',
							marginLeft.unit !== 'func' ? 'side-drag-active' : ''
						)}
						onMouseDown={(event) => {
							if (marginLeft.unit === 'func') {
								event.preventDefault();
								return;
							}

							leftMarginDragValueHandler(event);
							setFocusSide('margin-left');
						}}
						onClick={() => {
							if (marginLeft.unit === 'func') {
								setOpenPopover('margin-left');
							}
						}}
						d="M0.5 152.711V6.24322C0.5 4.90687 2.11571 4.23762 3.06066 5.18257L29.182 31.3039C30.0259 32.1478 30.5 33.2924 30.5 34.4859V124.468C30.5 125.661 30.0259 126.806 29.182 127.65L3.06066 153.771C2.11571 154.716 0.5 154.047 0.5 152.711Z"
					/>

					<path
						className={controlInnerClassNames(
							'shape-side',
							'side-horizontal',
							'side-padding-top',
							openPopover === 'padding-top' ||
								focusSide === 'padding-top'
								? 'selected-side'
								: '',
							paddingTop.unit !== 'func' ? 'side-drag-active' : ''
						)}
						onMouseDown={(event) => {
							if (paddingTop.unit === 'func') {
								event.preventDefault();
								return;
							}

							topPaddingDragValueHandler(event);
							setFocusSide('padding-top');
						}}
						onClick={() => {
							if (paddingTop.unit === 'func') {
								setOpenPopover('padding-top');
							}
						}}
						d="M42.242 39H207.757C208.649 39 209.094 40.0771 208.464 40.7071L208.818 41.0607L208.464 40.7071L183.343 65.8284C182.593 66.5786 181.575 67 180.515 67H69.4846C68.4238 67 67.4064 66.5786 66.6562 65.8284L41.5349 40.7072C41.5349 40.7072 41.5349 40.7072 41.5349 40.7071C40.9049 40.0771 41.3511 39 42.242 39Z"
					/>

					<path
						className={controlInnerClassNames(
							'shape-side',
							'side-vertical',
							'side-padding-right',
							openPopover === 'padding-right' ||
								focusSide === 'padding-right'
								? 'selected-side'
								: '',
							paddingRight.unit !== 'func'
								? 'side-drag-active'
								: ''
						)}
						onMouseDown={(event) => {
							if (paddingRight.unit === 'func') {
								event.preventDefault();
								return;
							}

							rightPaddingDragValueHandler(event);
							setFocusSide('padding-right');
						}}
						onClick={() => {
							if (paddingRight.unit === 'func') {
								setOpenPopover('padding-right');
							}
						}}
						d="M185.172 68.657L185.172 68.6569L210.293 43.5356C210.923 42.9056 212 43.3519 212 44.2427V114.711C212 115.601 210.923 116.048 210.293 115.417L185.172 90.2963L185.172 90.2963C184.421 89.5462 184 88.5288 184 87.4679V71.4854C184 70.4245 184.421 69.4071 185.172 68.657Z"
					/>

					<path
						className={controlInnerClassNames(
							'shape-side',
							'side-horizontal',
							'side-padding-bottom',
							openPopover === 'padding-bottom' ||
								focusSide === 'padding-bottom'
								? 'selected-side'
								: '',
							paddingBottom.unit !== 'func'
								? 'side-drag-active'
								: ''
						)}
						onMouseDown={(event) => {
							if (paddingBottom.unit === 'func') {
								event.preventDefault();
								return;
							}

							bottomPaddingDragValueHandler(event);
							setFocusSide('padding-bottom');
						}}
						onClick={() => {
							if (paddingBottom.unit === 'func') {
								setOpenPopover('padding-bottom');
							}
						}}
						d="M69.4387 92H180.562C181.622 92 182.64 92.4214 183.39 93.1716L208.511 118.293C209.142 118.923 208.695 120 207.804 120H42.1961C41.3053 120 40.8589 118.923 41.489 118.293L66.6103 93.1716L66.2568 92.818L66.6104 93.1716C67.3605 92.4214 68.3779 92 69.4387 92Z"
					/>

					<path
						className={controlInnerClassNames(
							'shape-side',
							'side-vertical',
							'side-padding-left',
							openPopover === 'padding-left' ||
								focusSide === 'padding-left'
								? 'selected-side'
								: '',
							paddingLeft.unit !== 'func'
								? 'side-drag-active'
								: ''
						)}
						onMouseDown={(event) => {
							if (paddingLeft.unit === 'func') {
								event.preventDefault();
								return;
							}

							leftPaddingDragValueHandler(event);
							setFocusSide('padding-left');
						}}
						onClick={() => {
							if (paddingLeft.unit === 'func') {
								setOpenPopover('padding-left');
							}
						}}
						d="M38 114.711V44.2432C38 43.3524 39.0771 42.9061 39.7071 43.5362L64.8284 68.6575C65.5786 69.4076 66 70.425 66 71.4859V87.468C66 88.5289 65.5786 89.5463 64.8284 90.2965L39.7071 115.417C39.0769 116.048 38 115.601 38 114.711Z"
					/>
				</svg>

				<span
					className={controlInnerClassNames(
						'box-model-label',
						'box-mode-margin'
					)}
				>
					<LabelControl
						mode={'advanced'}
						ariaLabel={__('Margin Spacing')}
						label={__('Margin', 'publisher-core')}
						{...{
							value,
							attribute,
							blockName,
							description,
							defaultValue,
							resetToDefault,
							fieldId: 'margin',
							path: getControlPath(attribute, 'margin'),
						}}
					/>
				</span>

				<span
					className={controlInnerClassNames(
						'box-model-label',
						'box-mode-padding'
					)}
				>
					<LabelControl
						mode={'advanced'}
						ariaLabel={__('Padding Spacing')}
						label={__('Padding', 'publisher-core')}
						{...{
							value,
							attribute,
							blockName,
							description,
							defaultValue,
							resetToDefault,
							fieldId: 'padding',
							path: getControlPath(attribute, 'padding'),
						}}
					/>
				</span>

				<div
					className={controlInnerClassNames(
						'label-side',
						'side-horizontal',
						'side-margin-top'
					)}
					data-cy="box-spacing-margin-top"
				>
					<LabelControl
						ariaLabel={__('Top Margin', 'publisher-core')}
						label={fixLabelText(marginTop)}
						popoverTitle={__('Top Margin', 'publisher-core')}
						onClick={() => setOpenPopover('margin-top')}
					/>

					<SidePopover
						id={getId(id, 'margin.top')}
						icon={<MarginTopIcon />}
						onClose={() => setOpenPopover('')}
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

				<div
					className={controlInnerClassNames(
						'label-side',
						'side-vertical',
						'side-margin-right'
					)}
					data-cy="box-spacing-margin-right"
				>
					<LabelControl
						ariaLabel={__('Right Margin', 'publisher-core')}
						popoverTitle={__('Right Margin', 'publisher-core')}
						label={fixLabelText(marginRight)}
						onClick={() => setOpenPopover('margin-right')}
					/>

					<SidePopover
						id={getId(id, 'margin.right')}
						offset={255}
						icon={<MarginRightIcon />}
						onClose={() => setOpenPopover('')}
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

				<div
					className={controlInnerClassNames(
						'label-side',
						'side-horizontal',
						'side-margin-bottom'
					)}
					data-cy="box-spacing-margin-bottom"
				>
					<LabelControl
						ariaLabel={__('Bottom Margin', 'publisher-core')}
						popoverTitle={__('Bottom Margin', 'publisher-core')}
						label={fixLabelText(marginBottom)}
						onClick={() => setOpenPopover('margin-bottom')}
					/>

					<SidePopover
						id={getId(id, 'margin.bottom')}
						icon={<MarginBottomIcon />}
						onClose={() => setOpenPopover('')}
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
				</div>

				<div
					className={controlInnerClassNames(
						'label-side',
						'side-vertical',
						'side-margin-left'
					)}
					data-cy="box-spacing-margin-left"
				>
					<LabelControl
						ariaLabel={__('Left Margin', 'publisher-core')}
						popoverTitle={__('Left Margin', 'publisher-core')}
						label={fixLabelText(marginLeft)}
						onClick={() => setOpenPopover('margin-left')}
					/>

					<SidePopover
						id={getId(id, 'margin.left')}
						icon={<MarginLeftIcon />}
						onClose={() => setOpenPopover('')}
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

				<div
					className={controlInnerClassNames(
						'label-side',
						'side-horizontal',
						'side-padding-top'
					)}
					data-cy="box-spacing-padding-top"
				>
					<LabelControl
						ariaLabel={__('Top Padding', 'publisher-core')}
						popoverTitle={__('Top Padding', 'publisher-core')}
						label={fixLabelText(paddingTop)}
						onClick={() => setOpenPopover('padding-top')}
					/>

					<SidePopover
						id={getId(id, 'padding.top')}
						type="padding"
						icon={<PaddingTopIcon />}
						onClose={() => setOpenPopover('')}
						title={__('Top Padding', 'publisher-core')}
						isOpen={openPopover === 'padding.top'}
						unit={extractNumberAndUnit(value.padding.top).unit}
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
				</div>

				<div
					className={controlInnerClassNames(
						'label-side',
						'side-vertical',
						'side-padding-right'
					)}
					data-cy="box-spacing-padding-right"
				>
					<LabelControl
						ariaLabel={__('Right Padding', 'publisher-core')}
						popoverTitle={__('Right Padding', 'publisher-core')}
						label={fixLabelText(paddingRight)}
						onClick={() => setOpenPopover('padding-right')}
					/>

					<SidePopover
						id={getId(id, 'padding.right')}
						offset={215}
						type="padding"
						icon={<PaddingRightIcon />}
						onClose={() => setOpenPopover('')}
						title={__('Right Padding', 'publisher-core')}
						isOpen={openPopover === 'padding-right'}
						unit={extractNumberAndUnit(value.padding.right).unit}
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
				</div>

				<div
					className={controlInnerClassNames(
						'label-side',
						'side-horizontal',
						'side-padding-bottom'
					)}
					data-cy="box-spacing-padding-bottom"
				>
					<LabelControl
						ariaLabel={__('Bottom Padding', 'publisher-core')}
						popoverTitle={__('Bottom Padding', 'publisher-core')}
						label={fixLabelText(paddingBottom)}
						onClick={() => setOpenPopover('padding-bottom')}
					/>

					<SidePopover
						id={getId(id, 'padding.bottom')}
						type="padding"
						icon={<PaddingBottomIcon />}
						onClose={() => setOpenPopover('')}
						title={__('Bottom Padding', 'publisher-core')}
						isOpen={openPopover === 'padding-bottom'}
						unit={extractNumberAndUnit(value.padding.bottom).unit}
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
				</div>

				<div
					className={controlInnerClassNames(
						'label-side',
						'side-vertical',
						'side-padding-left'
					)}
					data-cy="box-spacing-padding-left"
				>
					<LabelControl
						ariaLabel={__('Left Padding', 'publisher-core')}
						popoverTitle={__('Left Padding', 'publisher-core')}
						label={fixLabelText(paddingLeft)}
						onClick={() => setOpenPopover('padding-left')}
					/>

					<SidePopover
						id={getId(id, 'padding.left')}
						offset={78}
						type="padding"
						icon={<PaddingLeftIcon />}
						onClose={() => setOpenPopover('')}
						title={__('Left Padding', 'publisher-core')}
						isOpen={openPopover === 'padding-left'}
						unit={extractNumberAndUnit(value.padding.left).unit}
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
				</div>
			</div>
		</BaseControl>
	);
}

BoxSpacingControl.propTypes = {
	/**
	 * ID for retrieving value from control context
	 */
	id: PropTypes.string,
	/**
	 * Control Label
	 *
	 * @default `Position`
	 */
	label: PropTypes.string,
	/**
	 * It sets the control default value if the value not provided. By using it the control will not fire onChange event for this default value on control first render,
	 */
	defaultValue: (PropTypes.shape({
		margin: (PropTypes.shape({
			top: PropTypes.string,
			right: PropTypes.string,
			bottom: PropTypes.string,
			left: PropTypes.string,
		}): any),
		padding: (PropTypes.shape({
			top: PropTypes.string,
			right: PropTypes.string,
			bottom: PropTypes.string,
			left: PropTypes.string,
		}): any),
	}): any),
	/**
	 * Function that will be fired while the control value state changes.
	 */
	onChange: PropTypes.func,
	/**
	 * It sets the control default value if the value not provided. By using it the control will not fire onChange event for this default value on control first render,
	 */
	/**
	 * Specifies which side is open by default.
	 *
	 * @default ``
	 */
	openSide: PropTypes.string,
};
