// @flow
/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';

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
import { LabelControl, BaseControl, SelectControl } from '../index';
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
import { default as LockNoneIcon } from './icons/lock-none';
import { default as LockHorizontalIcon } from './icons/lock-horizontal';
import { default as LockVerticalIcon } from './icons/lock-vertical';
import { default as LockAllIcon } from './icons/lock-all';
import { default as PaddingTopBottomIcon } from './icons/padding-top-bottom';
import { default as PaddingLeftRightIcon } from './icons/padding-left-right';
import { default as MarginTopBottomIcon } from './icons/margin-top-bottom';
import { default as MarginLeftRightIcon } from './icons/margin-left-right';
import { default as MarginAllIcon } from './icons/margin-all';
import { default as PaddingAllIcon } from './icons/padding-all';
import { default as LockVerticalHorizontalIcon } from './icons/lock-vertical-horizontal';

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
		marginLock: 'vertical-horizontal',
		padding: {
			top: '',
			right: '',
			bottom: '',
			left: '',
		},
		paddingLock: 'vertical-horizontal',
	},
	onChange = () => {},
	field,
	marginDisable = 'none',
	paddingDisable = 'none',
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

	const [openPopover, setOpenPopover] = useState(openSide);
	const [focusSide, setFocusSide] = useState('');
	const [controlClassName, setControlClassName] = useState('');

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
		allMarginDragSetValue,
		topBottomMarginDragSetValue,
		leftRightMarginDragSetValue,
		topMarginDragSetValue,
		leftMarginDragSetValue,
		rightMarginDragSetValue,
		bottomMarginDragSetValue,

		// padding set values
		allPaddingDragSetValue,
		topBottomPaddingDragSetValue,
		leftRightPaddingDragSetValue,
		topPaddingDragSetValue,
		leftPaddingDragSetValue,
		rightPaddingDragSetValue,
		bottomPaddingDragSetValue,
	} = useDragSetValues({ value, setValue });

	const onEnd = () => {
		if (!openPopover) setFocusSide('');
	};

	const allMarginDragValueHandler = useDragValue({
		value: marginTop.value !== '' ? marginTop.value : 0,
		setValue: allMarginDragSetValue,
		movement: 'vertical',
		onEnd,
	});

	const topMarginDragValueHandler = useDragValue({
		value: marginTop.value !== '' ? marginTop.value : 0,
		setValue:
			value.marginLock === 'vertical' ||
			value.marginLock === 'vertical-horizontal'
				? topBottomMarginDragSetValue
				: topMarginDragSetValue,
		movement: 'vertical',
		onEnd,
	});

	const leftMarginDragValueHandler = useDragValue({
		value: marginLeft.value || 0,
		setValue:
			value.marginLock === 'horizontal' ||
			value.marginLock === 'vertical-horizontal'
				? leftRightMarginDragSetValue
				: leftMarginDragSetValue,
		movement: 'horizontal',
		onEnd,
	});

	const rightMarginDragValueHandler = useDragValue({
		value: marginRight.value || 0,
		setValue:
			value.marginLock === 'horizontal' ||
			value.marginLock === 'vertical-horizontal'
				? leftRightMarginDragSetValue
				: rightMarginDragSetValue,
		movement: 'horizontal',
		onEnd,
	});

	const bottomMarginDragValueHandler = useDragValue({
		value: marginBottom.value || 0,
		setValue:
			value.marginLock === 'vertical' ||
			value.marginLock === 'vertical-horizontal'
				? topBottomMarginDragSetValue
				: bottomMarginDragSetValue,
		movement: 'vertical',
		onEnd,
	});

	const allPaddingDragValueHandler = useDragValue({
		value: paddingTop.value !== '' ? paddingTop.value : 0,
		setValue: allPaddingDragSetValue,
		movement: 'vertical',
		min: 0,
		onEnd,
	});

	const topPaddingDragValueHandler = useDragValue({
		value: paddingTop.value || 0,
		setValue:
			value.paddingLock === 'vertical' ||
			value.paddingLock === 'vertical-horizontal'
				? topBottomPaddingDragSetValue
				: topPaddingDragSetValue,
		movement: 'vertical',
		min: 0,
		onEnd,
	});

	const leftPaddingDragValueHandler = useDragValue({
		value: paddingLeft.value || 0,
		setValue:
			value.paddingLock === 'horizontal' ||
			value.paddingLock === 'vertical-horizontal'
				? leftRightPaddingDragSetValue
				: leftPaddingDragSetValue,
		movement: 'horizontal',
		min: 0,
		onEnd,
	});

	const rightPaddingDragValueHandler = useDragValue({
		value: paddingRight.value || 0,
		setValue:
			value.paddingLock === 'horizontal' ||
			value.paddingLock === 'vertical-horizontal'
				? leftRightPaddingDragSetValue
				: rightPaddingDragSetValue,
		movement: 'horizontal',
		min: 0,
		onEnd,
	});

	const bottomPaddingDragValueHandler = useDragValue({
		value: paddingBottom.value || 0,
		setValue:
			value.paddingLock === 'vertical' ||
			value.paddingLock === 'vertical-horizontal'
				? topBottomPaddingDragSetValue
				: bottomPaddingDragSetValue,
		movement: 'vertical',
		min: 0,
		onEnd,
	});

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
				className={controlClassNames(
					'box-spacing',
					'padding-lock-' + value.paddingLock,
					'margin-lock-' + value.marginLock,
					className,
					controlClassName
				)}
				data-cy="box-spacing-control"
			>
				<svg
					width="250"
					height="159"
					viewBox="0 0 250 159"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
				>
					{/* Margin - All */}
					{value.marginLock === 'all' && marginDisable !== 'all' && (
						<path
							className={controlInnerClassNames(
								'shape-side',
								'side-all',
								'side-margin-all',
								focusSide === 'margin-all'
									? 'selected-side'
									: '',
								marginTop.unit !== 'func'
									? 'side-drag-active'
									: ''
							)}
							onMouseDown={(event) => {
								// prevent to catch double click
								if (event.detail > 1) {
									return;
								}

								if (marginTop.unit === 'func') {
									event.preventDefault();
									return;
								}

								allMarginDragValueHandler(event);
								setFocusSide('margin-all');
							}}
							onClick={() => {
								// open on double click
								if (event.detail > 1) {
									setFocusSide('margin-all');
									setOpenPopover('margin-all');
									return;
								}

								if (marginTop.unit === 'func') {
									setOpenPopover('margin-all');
								}
							}}
							d="M0.5 4C0.5 2.06889 2.0723 0.5 4.01606 0.5H245.984C247.928 0.5 249.5 2.06889 249.5 4V154C249.5 155.931 247.928 157.5 245.984 157.5H4.01607C2.07231 157.5 0.5 155.931 0.5 154V4ZM32.1285 29.5C30.7453 29.5 29.6205 30.6174 29.6205 32V126C29.6205 127.383 30.7453 128.5 32.1285 128.5H217.871C219.255 128.5 220.38 127.383 220.38 126V32C220.38 30.6174 219.255 29.5 217.871 29.5H32.1285Z"
						/>
					)}

					{/* Margin - Top & Bottom */}
					{(value.marginLock === 'vertical' ||
						value.marginLock === 'vertical-horizontal') &&
						marginDisable !== 'all' &&
						marginDisable !== 'vertical' && (
							<path
								className={controlInnerClassNames(
									'shape-side',
									'side-vertical',
									'side-margin-vertical',
									focusSide === 'margin-vertical'
										? 'selected-side'
										: '',
									marginTop.unit !== 'func'
										? 'side-drag-active'
										: ''
								)}
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
									setFocusSide('margin-vertical');
								}}
								onClick={() => {
									// open on double click
									if (event.detail > 1) {
										setFocusSide('margin-vertical');
										setOpenPopover('margin-vertical');
										return;
									}

									if (marginTop.unit === 'func') {
										setOpenPopover('margin-vertical');
									}
								}}
								d="M5.51224 0.5H244.487C245.393 0.5 245.832 1.58019 245.202 2.20602L245.555 2.56066L245.202 2.20603L218.921 28.3273C218.166 29.0778 217.14 29.5 216.072 29.5H33.9285C32.8593 29.5 31.8346 29.0778 31.0795 28.3274L4.79753 2.20603C4.79753 2.20603 4.79753 2.20603 4.79753 2.20602C4.16784 1.58017 4.60739 0.5 5.51224 0.5ZM218.931 129.673L245.202 155.794C245.832 156.42 245.392 157.5 244.488 157.5H5.51166C4.6078 157.5 4.16763 156.42 4.79743 155.794L31.0692 129.673C31.824 128.922 32.8483 128.5 33.9169 128.5H216.083C217.152 128.5 218.176 128.922 218.931 129.673Z"
							/>
						)}

					{/* Margin - Top */}
					{value.marginLock !== 'all' &&
						value.marginLock !== 'vertical' &&
						value.marginLock !== 'vertical-horizontal' && (
							<path
								className={controlInnerClassNames(
									'shape-side',
									'side-vertical',
									'side-margin-top',
									(marginDisable === 'none' ||
										marginDisable !== 'all') &&
										marginDisable !== 'vertical'
										? [
												focusSide === 'margin-top'
													? 'selected-side'
													: '',
												marginTop.unit !== 'func'
													? 'side-drag-active'
													: '',
										  ]
										: ['disabled-side']
								)}
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
								onClick={() => {
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
								d="M5.51224 0.5H244.487C245.393 0.5 245.832 1.58019 245.202 2.20602L245.555 2.56066L245.202 2.20603L218.921 28.3274C218.166 29.0778 217.14 29.5 216.072 29.5H33.9285C32.8593 29.5 31.8346 29.0778 31.0795 28.3274L4.79753 2.20603C4.79753 2.20603 4.79753 2.20603 4.79753 2.20602C4.16784 1.58017 4.60739 0.5 5.51224 0.5Z"
							/>
						)}

					{/* Margin - Bottom */}
					{value.marginLock !== 'all' &&
						value.marginLock !== 'vertical' &&
						value.marginLock !== 'vertical-horizontal' && (
							<path
								className={controlInnerClassNames(
									'shape-side',
									'side-vertical',
									'side-margin-bottom',
									(marginDisable === 'none' ||
										marginDisable !== 'all') &&
										marginDisable !== 'vertical'
										? [
												openPopover ===
													'margin-bottom' ||
												focusSide === 'margin-bottom'
													? 'selected-side'
													: '',
												marginBottom.unit !== 'func'
													? 'side-drag-active'
													: '',
										  ]
										: ['disabled-side']
								)}
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
								onClick={() => {
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
								d="M31.0692 129.673L31.0692 129.673C31.824 128.922 32.8483 128.5 33.9169 128.5H216.083C217.152 128.5 218.176 128.922 218.931 129.673L245.202 155.794C245.832 156.42 245.392 157.5 244.488 157.5H5.51166C4.6078 157.5 4.16764 156.42 4.79743 155.794C4.79743 155.794 4.79744 155.794 4.79744 155.794L31.0692 129.673Z"
							/>
						)}

					{/* Margin - Left & Right */}
					{(value.marginLock === 'horizontal' ||
						value.marginLock === 'vertical-horizontal') &&
						marginDisable !== 'all' &&
						marginDisable !== 'horizontal' && (
							<path
								className={controlInnerClassNames(
									'shape-side',
									'side-horizontal',
									'side-margin-horizontal',
									focusSide === 'margin-horizontal'
										? 'selected-side'
										: '',
									marginRight.unit !== 'func'
										? 'side-drag-active'
										: ''
								)}
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
								onClick={() => {
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
								d="M2.20735 153.202L2.20648 153.203C1.57865 153.833 0.5 153.39 0.5 152.492V5.5083C0.5 4.60941 1.57888 4.16702 2.20649 4.79684L28.3278 31.0102C29.0781 31.7632 29.5 32.7848 29.5 33.8505V124.277C29.5 125.342 29.0782 126.364 28.328 127.117C28.328 127.117 28.3279 127.117 28.3278 127.117L2.20735 153.202ZM220.5 124.15V33.8504C220.5 32.7847 220.922 31.7631 221.672 31.0102L247.793 4.79684C248.421 4.16693 249.5 4.60952 249.5 5.50829V152.492C249.5 153.39 248.421 153.833 247.793 153.203L221.672 126.99C220.922 126.237 220.5 125.215 220.5 124.15Z"
							/>
						)}

					{/* Margin - Right */}
					{value.marginLock !== 'all' &&
						value.marginLock !== 'horizontal' &&
						value.marginLock !== 'vertical-horizontal' && (
							<path
								className={controlInnerClassNames(
									'shape-side',
									'side-horizontal',
									'side-margin-right',
									(marginDisable === 'none' ||
										marginDisable !== 'all') &&
										marginDisable !== 'horizontal'
										? [
												openPopover ===
													'margin-right' ||
												focusSide === 'margin-right'
													? 'selected-side'
													: '',
												marginRight.unit !== 'func'
													? 'side-drag-active'
													: '',
										  ]
										: ['disabled-side']
								)}
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
								onClick={() => {
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
								d="M221.672 31.0102L221.672 31.0101L247.793 4.79684C247.793 4.79684 247.793 4.79683 247.793 4.79683C248.421 4.16694 249.5 4.60953 249.5 5.50829V152.492C249.5 153.39 248.421 153.833 247.793 153.203L221.672 126.99C220.922 126.237 220.5 125.215 220.5 124.15V33.8504C220.5 32.7847 220.922 31.7631 221.672 31.0102Z"
							/>
						)}

					{/* Margin - Left */}
					{value.marginLock !== 'all' &&
						value.marginLock !== 'horizontal' &&
						value.marginLock !== 'vertical-horizontal' && (
							<path
								className={controlInnerClassNames(
									'shape-side',
									'side-horizontal',
									'side-margin-left',
									(marginDisable === 'none' ||
										marginDisable !== 'all') &&
										marginDisable !== 'horizontal'
										? [
												openPopover === 'margin-left' ||
												focusSide === 'margin-left'
													? 'selected-side'
													: '',
												marginLeft.unit !== 'func'
													? 'side-drag-active'
													: '',
										  ]
										: ['disabled-side']
								)}
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
								onClick={() => {
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
								d="M2.20735 153.202L2.20648 153.203C1.57865 153.833 0.5 153.39 0.5 152.492V5.5083C0.5 4.60941 1.57888 4.16702 2.20649 4.79684L28.3278 31.0102C29.0781 31.7632 29.5 32.7848 29.5 33.8505V124.277C29.5 125.342 29.0782 126.364 28.328 127.117C28.328 127.117 28.3279 127.117 28.3278 127.117L2.20735 153.202Z"
							/>
						)}

					{/* Padding - All */}
					{value.paddingLock === 'all' &&
						paddingDisable !== 'all' && (
							<path
								className={controlInnerClassNames(
									'shape-side',
									'side-all',
									'side-padding-all',
									focusSide === 'padding-all'
										? 'selected-side'
										: '',
									marginTop.unit !== 'func'
										? 'side-drag-active'
										: ''
								)}
								onMouseDown={(event) => {
									// prevent to catch double click
									if (event.detail > 1) {
										return;
									}

									if (marginTop.unit === 'func') {
										event.preventDefault();
										return;
									}

									allPaddingDragValueHandler(event);
									setFocusSide('padding-all');
								}}
								onClick={() => {
									// open on double click
									if (event.detail > 1) {
										setFocusSide('padding-all');
										setOpenPopover('padding-all');
										return;
									}

									if (marginTop.unit === 'func') {
										setOpenPopover('padding-all');
									}
								}}
								d="M37.5 41.0976C37.5 39.102 39.0859 37.5 41.0229 37.5H208.977C210.914 37.5 212.5 39.102 212.5 41.0976V116.902C212.5 118.898 210.914 120.5 208.977 120.5H41.0229C39.0859 120.5 37.5 118.898 37.5 116.902V41.0976ZM69.0114 66.4512C67.6158 66.4512 66.5 67.6011 66.5 69V89C66.5 90.3989 67.6158 91.5488 69.0114 91.5488H181C182.396 91.5488 183.511 90.3989 183.511 89V69C183.511 67.6011 182.396 66.4512 181 66.4512H69.0114Z"
							/>
						)}

					{/* Padding - Top & Bottom */}
					{(value.paddingLock === 'vertical' ||
						value.paddingLock === 'vertical-horizontal') &&
						paddingDisable !== 'all' &&
						paddingDisable !== 'vertical' && (
							<path
								className={controlInnerClassNames(
									'shape-side',
									'side-vertical',
									'side-padding-vertical',
									openPopover === 'padding-vertical' ||
										focusSide === 'padding-vertical'
										? 'selected-side'
										: '',
									paddingTop.unit !== 'func'
										? 'side-drag-active'
										: ''
								)}
								onMouseDown={(event) => {
									// prevent to catch double click
									if (event.detail > 1) {
										return;
									}

									if (paddingTop.unit === 'func') {
										event.preventDefault();
										return;
									}

									topPaddingDragValueHandler(event);
									setFocusSide('padding-vertical');
								}}
								onClick={() => {
									// open on double click
									if (event.detail > 1) {
										setFocusSide('padding-vertical');
										setOpenPopover('padding-vertical');
										return;
									}

									if (paddingTop.unit === 'func') {
										setOpenPopover('padding-vertical');
									}
								}}
								d="M67.8312 65.2875L67.8313 65.2875L67.8265 65.2827L41.802 39.2978C41.1427 38.618 41.6374 37.5 42.5161 37.5H207.484C208.363 37.5 208.857 38.6178 208.198 39.2976C208.197 39.2984 208.197 39.2992 208.196 39.2999L182.205 65.2829L182.2 65.2875C181.442 66.0654 180.415 66.5 179.348 66.5H70.6827C69.6157 66.5 68.5897 66.0654 67.8312 65.2875ZM68.1354 92.7194L68.1355 92.7194L68.1423 92.7124C68.9003 91.9345 69.9255 91.5 70.9917 91.5H179.204C180.27 91.5 181.296 91.9346 182.054 92.7125L182.059 92.7181L208.196 118.7C208.197 118.7 208.198 118.701 208.198 118.702C208.857 119.382 208.362 120.5 207.484 120.5H42.5151C41.6384 120.5 41.143 119.383 41.8009 118.703C41.8019 118.702 41.803 118.701 41.804 118.7L68.1354 92.7194Z"
							/>
						)}

					{/* Padding - Top */}
					{value.paddingLock !== 'all' &&
						value.paddingLock !== 'vertical' &&
						value.paddingLock !== 'vertical-horizontal' && (
							<path
								className={controlInnerClassNames(
									'shape-side',
									'side-vertical',
									'side-padding-top',
									(paddingDisable === 'none' ||
										paddingDisable !== 'all') &&
										paddingDisable !== 'vertical'
										? [
												openPopover === 'padding-top' ||
												focusSide === 'padding-top'
													? 'selected-side'
													: '',
												paddingTop.unit !== 'func'
													? 'side-drag-active'
													: '',
										  ]
										: ['disabled-side']
								)}
								onMouseDown={(event) => {
									// prevent to catch double click
									if (event.detail > 1) {
										return;
									}

									if (paddingTop.unit === 'func') {
										event.preventDefault();
										return;
									}

									topPaddingDragValueHandler(event);
									setFocusSide('padding-top');
								}}
								onClick={() => {
									// open on double click
									if (event.detail > 1) {
										setFocusSide('padding-top');
										setOpenPopover('padding-top');
										return;
									}

									if (paddingTop.unit === 'func') {
										setOpenPopover('padding-top');
									}
								}}
								d="M182.205 65.2829L182.2 65.2875C181.442 66.0654 180.415 66.5 179.348 66.5H70.6827C69.6157 66.5 68.5897 66.0654 67.8312 65.2875L67.8313 65.2875L67.8265 65.2827L41.802 39.2978C41.1427 38.618 41.6374 37.5 42.5161 37.5H207.484C208.363 37.5 208.857 38.6185 208.197 39.2981C208.197 39.2987 208.196 39.2993 208.196 39.2999L182.205 65.2829Z"
							/>
						)}

					{/* Padding - Bottom */}
					{value.paddingLock !== 'all' &&
						value.paddingLock !== 'vertical' &&
						value.paddingLock !== 'vertical-horizontal' && (
							<path
								className={controlInnerClassNames(
									'shape-side',
									'side-vertical',
									'side-padding-bottom',
									(paddingDisable === 'none' ||
										paddingDisable !== 'all') &&
										paddingDisable !== 'vertical'
										? [
												openPopover ===
													'padding-bottom' ||
												focusSide === 'padding-bottom'
													? 'selected-side'
													: '',
												paddingBottom.unit !== 'func'
													? 'side-drag-active'
													: '',
										  ]
										: ['disabled-side']
								)}
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
								onClick={() => {
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
								d="M182.054 92.7124L182.054 92.7125L182.059 92.7181L208.196 118.7C208.197 118.701 208.198 118.701 208.198 118.702C208.857 119.383 208.362 120.5 207.484 120.5H42.5151C41.6384 120.5 41.143 119.383 41.8009 118.703L68.1354 92.7194L68.1355 92.7194L68.1423 92.7124C68.9003 91.9345 69.9255 91.5 70.9917 91.5H179.204C180.27 91.5 181.296 91.9346 182.054 92.7124Z"
							/>
						)}

					{/* Padding - Left & Right */}
					{(value.paddingLock === 'horizontal' ||
						value.paddingLock === 'vertical-horizontal') &&
						paddingDisable !== 'all' &&
						paddingDisable !== 'horizontal' && (
							<path
								className={controlInnerClassNames(
									'shape-side',
									'side-horizontal',
									'side-padding-right',
									openPopover === 'padding-horizontal' ||
										focusSide === 'padding-horizontal'
										? 'selected-side'
										: '',
									paddingRight.unit !== 'func'
										? 'side-drag-active'
										: ''
								)}
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
								onClick={() => {
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
								d="M65.2862 90.242L65.2832 90.2449L39.2986 116.194C39.2982 116.194 39.2977 116.195 39.2973 116.195C38.6223 116.856 37.5 116.368 37.5 115.473V42.5271C37.5 41.6319 38.6224 41.1443 39.2972 41.8048C39.2977 41.8052 39.2982 41.8057 39.2986 41.8062L65.283 67.7891L65.283 67.7891L65.2862 67.7923C66.0645 68.5567 66.5 69.5916 66.5 70.6687V87.3655C66.5 88.4427 66.0644 89.4776 65.2862 90.242ZM184.717 90.2449L184.714 90.242C183.936 89.4776 183.5 88.4427 183.5 87.3655V70.6687C183.5 69.5916 183.936 68.5567 184.714 67.7923L184.717 67.7891L210.701 41.8062C210.702 41.8058 210.702 41.8053 210.703 41.8049C211.377 41.1442 212.5 41.6318 212.5 42.5271V115.473C212.5 116.368 211.377 116.856 210.702 116.194C210.702 116.194 210.702 116.194 210.701 116.194L184.717 90.2449Z"
							/>
						)}

					{/* Padding - Left */}
					{value.paddingLock !== 'all' &&
						value.paddingLock !== 'horizontal' &&
						value.paddingLock !== 'vertical-horizontal' && (
							<path
								className={controlInnerClassNames(
									'shape-side',
									'side-left',
									'side-padding-left',
									(paddingDisable === 'none' ||
										paddingDisable !== 'all') &&
										paddingDisable !== 'horizontal'
										? [
												openPopover ===
													'padding-left' ||
												focusSide === 'padding-left'
													? 'selected-side'
													: '',
												paddingLeft.unit !== 'func'
													? 'side-drag-active'
													: '',
										  ]
										: ['disabled-side']
								)}
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
								onClick={() => {
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
								d="M65.283 67.7891L65.283 67.7891L65.2862 67.7923C66.0645 68.5567 66.5 69.5916 66.5 70.6687V87.3655C66.5 88.4427 66.0645 89.4776 65.2862 90.242L65.2832 90.2449L39.2986 116.194C39.2982 116.194 39.2977 116.195 39.2972 116.195C38.6222 116.856 37.5 116.368 37.5 115.473L37.5 42.5271C37.5 41.6319 38.6224 41.1443 39.2972 41.8048C39.2977 41.8053 39.2982 41.8057 39.2986 41.8062L65.283 67.7891Z"
							/>
						)}

					{/* Padding - Right */}
					{value.paddingLock !== 'all' &&
						value.paddingLock !== 'horizontal' &&
						value.paddingLock !== 'vertical-horizontal' && (
							<path
								className={controlInnerClassNames(
									'shape-side',
									'side-horizontal',
									'side-padding-right',
									(paddingDisable === 'none' ||
										paddingDisable !== 'all') &&
										paddingDisable !== 'horizontal'
										? [
												openPopover ===
													'padding-right' ||
												focusSide === 'padding-right'
													? 'selected-side'
													: '',
												paddingRight.unit !== 'func'
													? 'side-drag-active'
													: '',
										  ]
										: ['disabled-side']
								)}
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
								onClick={() => {
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
								d="M184.717 67.7891L184.717 67.7891L184.714 67.7923C183.936 68.5567 183.5 69.5916 183.5 70.6687V87.3655C183.5 88.4427 183.936 89.4776 184.714 90.242L184.717 90.2449L210.701 116.194C210.702 116.194 210.702 116.195 210.703 116.195C211.378 116.856 212.5 116.368 212.5 115.473L212.5 42.5271C212.5 41.6319 211.378 41.1443 210.703 41.8048C210.702 41.8053 210.702 41.8057 210.701 41.8062L184.717 67.7891Z"
							/>
						)}
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
							fieldId: 'margin',
							path: getControlPath(attribute, 'padding'),
						}}
					/>
				</span>

				<SidePopover
					id={getId(id, 'margin.top')}
					type="margin"
					icon={<MarginAllIcon />}
					onClose={() => {
						setFocusSide('');
						setOpenPopover('');
					}}
					title={__('All Sides Margin', 'publisher-core')}
					isOpen={openPopover === 'margin-all'}
					unit={extractNumberAndUnit(value.margin.top).unit}
					onChange={(newValue) => {
						setValue({
							...value,
							margin: {
								top: newValue,
								right: newValue,
								bottom: newValue,
								left: newValue,
							},
						});
					}}
				/>

				<SidePopover
					id={getId(id, 'margin.top')}
					type="margin"
					icon={<MarginTopBottomIcon />}
					onClose={() => {
						setFocusSide('');
						setOpenPopover('');
					}}
					title={__('Top & Bottom Margin', 'publisher-core')}
					isOpen={openPopover === 'margin-vertical'}
					unit={extractNumberAndUnit(value.margin.top).unit}
					onChange={(newValue) => {
						setValue({
							...value,
							margin: {
								...value.margin,
								top: newValue,
								bottom: newValue,
							},
						});
					}}
				/>

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

				{marginDisable !== 'vertical' && marginDisable !== 'all' && (
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
								if (value.marginLock === 'all') {
									setFocusSide('margin-all');
									setOpenPopover('margin-all');
								} else if (
									value.marginLock === 'vertical' ||
									value.marginLock === 'vertical-horizontal'
								) {
									setFocusSide('margin-vertical');
									setOpenPopover('margin-vertical');
								} else {
									setFocusSide('margin-top');
									setOpenPopover('margin-top');
								}
							}}
							{...{
								attribute,
								blockName,
								description,
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
				)}

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
								if (value.marginLock === 'all') {
									setFocusSide('margin-all');
									setOpenPopover('margin-all');
								} else if (
									value.marginLock === 'horizontal' ||
									value.marginLock === 'vertical-horizontal'
								) {
									setFocusSide('margin-horizontal');
									setOpenPopover('margin-horizontal');
								} else {
									setFocusSide('margin-right');
									setOpenPopover('margin-right');
								}
							}}
							{...{
								attribute,
								blockName,
								description,
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

				{marginDisable !== 'vertical' && marginDisable !== 'all' && (
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
								if (value.marginLock === 'all') {
									setFocusSide('margin-all');
									setOpenPopover('margin-all');
								} else if (
									value.marginLock === 'vertical' ||
									value.marginLock === 'vertical-horizontal'
								) {
									setFocusSide('margin-vertical');
									setOpenPopover('margin-vertical');
								} else {
									setFocusSide('margin-bottom');
									setOpenPopover('margin-bottom');
								}
							}}
							{...{
								attribute,
								blockName,
								description,
								resetToDefault,
								fieldId: 'margin.bottom',
								path: getControlPath(
									attribute,
									'margin.bottom'
								),
							}}
						/>

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
					</div>
				)}

				{marginDisable !== 'horizontal' && marginDisable !== 'all' && (
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
								if (value.marginLock === 'all') {
									setFocusSide('margin-all');
									setOpenPopover('margin-all');
								} else if (
									value.marginLock === 'horizontal' ||
									value.marginLock === 'vertical-horizontal'
								) {
									setFocusSide('margin-horizontal');
									setOpenPopover('margin-horizontal');
								} else {
									setFocusSide('margin-left');
									setOpenPopover('margin-left');
								}
							}}
							{...{
								attribute,
								blockName,
								description,
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
				)}

				{paddingDisable !== 'vertical' && paddingDisable !== 'all' && (
					<div
						className={controlInnerClassNames(
							'label-side',
							'side-vertical',
							'side-padding-top'
						)}
						data-cy="box-spacing-padding-top"
					>
						<LabelControl
							ariaLabel={__('Top Padding', 'publisher-core')}
							popoverTitle={__('Top Padding', 'publisher-core')}
							label={fixLabelText(paddingTop)}
							onClick={() => {
								if (value.paddingLock === 'all') {
									setFocusSide('padding-all');
									setOpenPopover('padding-all');
								} else if (
									value.paddingLock === 'vertical' ||
									value.paddingLock === 'vertical-horizontal'
								) {
									setFocusSide('padding-vertical');
									setOpenPopover('padding-vertical');
								} else {
									setFocusSide('padding-top');
									setOpenPopover('padding-top');
								}
							}}
							{...{
								attribute,
								blockName,
								description,
								resetToDefault,
								fieldId: 'padding.top',
								path: getControlPath(attribute, 'padding-top'),
							}}
						/>

						<SidePopover
							id={getId(id, 'padding.top')}
							type="padding"
							icon={<PaddingTopIcon />}
							onClose={() => {
								setFocusSide('');
								setOpenPopover('');
							}}
							title={__('Top Padding', 'publisher-core')}
							isOpen={openPopover === 'padding-top'}
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
				)}

				<SidePopover
					id={getId(id, 'padding.top')}
					type="padding"
					icon={<PaddingAllIcon />}
					onClose={() => {
						setFocusSide('');
						setOpenPopover('');
					}}
					title={__('All Sides Padding', 'publisher-core')}
					isOpen={openPopover === 'padding-all'}
					unit={extractNumberAndUnit(value.padding.top).unit}
					onChange={(newValue) => {
						setValue({
							...value,
							padding: {
								top: newValue,
								right: newValue,
								bottom: newValue,
								left: newValue,
							},
						});
					}}
				/>

				<SidePopover
					id={getId(id, 'padding.top')}
					type="padding"
					icon={<PaddingTopBottomIcon />}
					onClose={() => {
						setFocusSide('');
						setOpenPopover('');
					}}
					title={__('Top & Bottom Padding', 'publisher-core')}
					isOpen={openPopover === 'padding-vertical'}
					unit={extractNumberAndUnit(value.padding.top).unit}
					onChange={(newValue) => {
						setValue({
							...value,
							padding: {
								...value.padding,
								top: newValue,
								bottom: newValue,
							},
						});
					}}
				/>

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

				{paddingDisable !== 'horizontal' &&
					paddingDisable !== 'all' && (
						<div
							className={controlInnerClassNames(
								'label-side',
								'side-horizontal',
								'side-padding-right'
							)}
							data-cy="box-spacing-padding-right"
						>
							<LabelControl
								ariaLabel={__(
									'Right Padding',
									'publisher-core'
								)}
								popoverTitle={__(
									'Right Padding',
									'publisher-core'
								)}
								label={fixLabelText(paddingRight)}
								onClick={() => {
									if (value.paddingLock === 'all') {
										setFocusSide('padding-all');
										setOpenPopover('padding-all');
									} else if (
										value.paddingLock === 'horizontal' ||
										value.paddingLock ===
											'vertical-horizontal'
									) {
										setFocusSide('padding-horizontal');
										setOpenPopover('padding-horizontal');
									} else {
										setFocusSide('padding-right');
										setOpenPopover('padding-right');
									}
								}}
								{...{
									attribute,
									blockName,
									description,
									resetToDefault,
									fieldId: 'padding.right',
									path: getControlPath(
										attribute,
										'padding.right'
									),
								}}
							/>

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
								unit={
									extractNumberAndUnit(value.padding.right)
										.unit
								}
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
					)}

				{paddingDisable !== 'vertical' && paddingDisable !== 'all' && (
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
							popoverTitle={__(
								'Bottom Padding',
								'publisher-core'
							)}
							label={fixLabelText(paddingBottom)}
							onClick={() => {
								if (value.paddingLock === 'all') {
									setFocusSide('padding-all');
									setOpenPopover('padding-all');
								} else if (
									value.paddingLock === 'vertical' ||
									value.paddingLock === 'vertical-horizontal'
								) {
									setFocusSide('padding-vertical');
									setOpenPopover('padding-vertical');
								} else {
									setFocusSide('padding-bottom');
									setOpenPopover('padding-bottom');
								}
							}}
							{...{
								attribute,
								blockName,
								description,
								resetToDefault,
								fieldId: 'padding.bottom',
								path: getControlPath(
									attribute,
									'padding.bottom'
								),
							}}
						/>

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
							unit={
								extractNumberAndUnit(value.padding.bottom).unit
							}
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
				)}

				{paddingDisable !== 'horizontal' &&
					paddingDisable !== 'all' && (
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
								popoverTitle={__(
									'Left Padding',
									'publisher-core'
								)}
								label={fixLabelText(paddingLeft)}
								onClick={() => {
									if (value.paddingLock === 'all') {
										setFocusSide('padding-all');
										setOpenPopover('padding-all');
									} else if (
										value.paddingLock === 'horizontal' ||
										value.paddingLock ===
											'vertical-horizontal'
									) {
										setFocusSide('padding-horizontal');
										setOpenPopover('padding-horizontal');
									} else {
										setFocusSide('padding-left');
										setOpenPopover('padding-left');
									}
								}}
								{...{
									attribute,
									blockName,
									description,
									resetToDefault,
									fieldId: 'padding.left',
									path: getControlPath(
										attribute,
										'padding.left'
									),
								}}
							/>

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
								unit={
									extractNumberAndUnit(value.padding.left)
										.unit
								}
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
					)}

				{marginDisable !== 'all' && (
					<SelectControl
						id={getId(id, 'marginLock')}
						defaultValue={defaultValue.marginLock}
						type="custom"
						noBorder={true}
						customHideInputLabel={true}
						customHideInputCaret={true}
						className={controlInnerClassNames(
							'spacing-lock',
							'margin-lock'
						)}
						onChange={(newValue) => {
							// setFocusSide('');
							setOpenPopover('');
							setValue({
								...value,
								marginLock: newValue,
							});

							const shakeSide = 'margin-' + newValue;

							if (shakeSide) {
								if (shakeSide === 'margin-none') {
									setFocusSide('margin-top');
									setControlClassName(
										'disable-pointer-events'
									);

									setTimeout(() => {
										setFocusSide('margin-right');

										setTimeout(() => {
											setFocusSide('margin-bottom');

											setTimeout(() => {
												setFocusSide('margin-left');

												setTimeout(() => {
													setFocusSide('');
													setControlClassName('');
												}, 200);
											}, 200);
										}, 200);
									}, 200);
								} else if (
									shakeSide === 'margin-vertical-horizontal'
								) {
									setFocusSide('margin-vertical');
									setControlClassName(
										'disable-pointer-events'
									);

									setTimeout(() => {
										setFocusSide('');

										setTimeout(() => {
											setFocusSide('margin-horizontal');

											setTimeout(() => {
												setFocusSide('');
												setControlClassName('');
											}, 300);
										}, 100);
									}, 300);
								} else {
									setFocusSide(shakeSide);
									setControlClassName(
										'disable-pointer-events'
									);

									setTimeout(() => {
										setFocusSide('');

										setTimeout(() => {
											setFocusSide(shakeSide);

											setTimeout(() => {
												setFocusSide('');
												setControlClassName('');
											}, 200);
										}, 200);
									}, 200);
								}
							}
						}}
						options={[
							{
								label: __('No Lock', 'publisher-core'),
								value: 'none',
								icon: <LockNoneIcon />,
							},
							marginDisable !== 'horizontal' &&
							marginDisable !== 'all'
								? {
										label: __(
											'Lock Horizontally',
											'publisher-core'
										),
										value: 'horizontal',
										icon: <LockHorizontalIcon />,
								  }
								: {},
							marginDisable !== 'vertical' &&
							marginDisable !== 'all'
								? {
										label: __(
											'Lock Vertically',
											'publisher-core'
										),
										value: 'vertical',
										icon: <LockVerticalIcon />,
								  }
								: {},
							marginDisable === 'none'
								? {
										label: __(
											'Lock Vertically & Horizontally',
											'publisher-core'
										),
										value: 'vertical-horizontal',
										icon: <LockVerticalHorizontalIcon />,
								  }
								: {},
							marginDisable === 'none'
								? {
										label: __('Lock All', 'publisher-core'),
										value: 'all',
										icon: <LockAllIcon />,
								  }
								: {},
						]}
					/>
				)}

				{paddingDisable !== 'all' && (
					<SelectControl
						id={getId(id, 'paddingLock')}
						defaultValue={defaultValue.paddingLock}
						type="custom"
						noBorder={true}
						customHideInputLabel={true}
						customHideInputCaret={true}
						className={controlInnerClassNames(
							'spacing-lock',
							'padding-lock'
						)}
						onChange={(newValue) => {
							setOpenPopover('');
							setValue({
								...value,
								paddingLock: newValue,
							});

							const shakeSide = 'padding-' + newValue;

							if (shakeSide) {
								if (shakeSide === 'padding-none') {
									setFocusSide('padding-top');
									setControlClassName(
										'disable-pointer-events'
									);

									setTimeout(() => {
										setFocusSide('padding-right');

										setTimeout(() => {
											setFocusSide('padding-bottom');

											setTimeout(() => {
												setFocusSide('padding-left');

												setTimeout(() => {
													setFocusSide('');
													setControlClassName('');
												}, 200);
											}, 200);
										}, 200);
									}, 200);
								} else if (
									shakeSide === 'padding-vertical-horizontal'
								) {
									setFocusSide('padding-vertical');
									setControlClassName(
										'disable-pointer-events'
									);

									setTimeout(() => {
										setFocusSide('');

										setTimeout(() => {
											setFocusSide('padding-horizontal');

											setTimeout(() => {
												setFocusSide('');
												setControlClassName('');
											}, 300);
										}, 100);
									}, 300);
								} else {
									setFocusSide(shakeSide);
									setControlClassName(
										'disable-pointer-events'
									);

									setTimeout(() => {
										setFocusSide('');

										setTimeout(() => {
											setFocusSide(shakeSide);

											setTimeout(() => {
												setFocusSide('');
												setControlClassName('');
											}, 200);
										}, 200);
									}, 200);
								}
							}
						}}
						options={[
							{
								label: __('No Lock', 'publisher-core'),
								value: 'none',
								icon: <LockNoneIcon />,
							},
							paddingDisable !== 'horizontal' &&
							paddingDisable !== 'all'
								? {
										label: __(
											'Lock Horizontally',
											'publisher-core'
										),
										value: 'horizontal',
										icon: <LockHorizontalIcon />,
								  }
								: {},
							paddingDisable !== 'vertical' &&
							paddingDisable !== 'all'
								? {
										label: __(
											'Lock Vertically',
											'publisher-core'
										),
										value: 'vertical',
										icon: <LockVerticalIcon />,
								  }
								: {},
							paddingDisable === 'none'
								? {
										label: __(
											'Lock Vertically & Horizontally',
											'publisher-core'
										),
										value: 'vertical-horizontal',
										icon: <LockVerticalHorizontalIcon />,
								  }
								: {},
							paddingDisable === 'none'
								? {
										label: __('Lock All', 'publisher-core'),
										value: 'all',
										icon: <LockAllIcon />,
								  }
								: {},
						]}
					/>
				)}
			</div>
		</BaseControl>
	);
}
