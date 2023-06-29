/**
 * WordPress dependencies
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

/**
 * Internal dependencies
 */
import { LabelControl } from '../index';
import { SidePopover } from './components/side-popover';

// icons
import { default as MarginTopIcon } from './icons/margin-top';
import { default as MarginRightIcon } from './icons/margin-right';
import { default as MarginBottomIcon } from './icons/margin-bottom';
import { default as MarginLeftIcon } from './icons/margin-left';
import { default as PaddingTopIcon } from './icons/padding-top';
import { default as PaddingRightIcon } from './icons/padding-right';
import { default as PaddingBottomIcon } from './icons/padding-bottom';
import { default as PaddingLeftIcon } from './icons/padding-left';

const BoxSpacingControl = ({
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
	value,
	//
	className,
	onChange = (newValue) => {
		return newValue;
	},
	onValueChange = (newValue) => {
		return newValue;
	},
	...props
}) => {
	const [controlValue, setControlValue] = useState({
		...defaultValue,
		...value,
	});

	const [openPopover, setOpenPopover] = useState('');

	function fixLabelText(value) {
		if (value === '') {
			value = '-';
		} else {
			value = value.replace('px', '');
		}

		return value;
	}

	return (
		<div {...props} className={controlClassNames('box-spacing', className)}>
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
						'side-margin-top',
						openPopover === 'margin-top' ? 'selected-side' : ''
					)}
					d="M6.242 0.5H243.757C245.094 0.5 245.763 2.11571 244.818 3.06066L218.697 29.182C217.853 30.0259 216.708 30.5 215.515 30.5H34.4846C33.2912 30.5 32.1466 30.0259 31.3027 29.182L5.18134 3.06066C4.2364 2.11571 4.90565 0.5 6.242 0.5Z"
				/>

				<path
					className={controlInnerClassNames(
						'shape-side',
						'side-margin-right',
						openPopover === 'margin-right' ? 'selected-side' : ''
					)}
					d="M219.5 124.468V34.4854C219.5 33.2919 219.974 32.1473 220.818 31.3034L246.939 5.18207C247.884 4.23713 249.5 4.90638 249.5 6.24273V152.711C249.5 154.047 247.884 154.716 246.939 153.771L220.818 127.65C219.974 126.806 219.5 125.661 219.5 124.468Z"
				/>

				<path
					className={controlInnerClassNames(
						'shape-side',
						'side-margin-bottom',
						openPopover === 'margin-bottom' ? 'selected-side' : ''
					)}
					d="M218.744 129.818L244.865 155.939C245.81 156.884 245.141 158.5 243.804 158.5H6.1961C4.85974 158.5 4.19049 156.884 5.13544 155.939L31.2568 129.818C32.1007 128.974 33.2453 128.5 34.4387 128.5H215.562C216.755 128.5 217.9 128.974 218.744 129.818Z"
				/>

				<path
					className={controlInnerClassNames(
						'shape-side',
						'side-margin-left',
						openPopover === 'margin-left' ? 'selected-side' : ''
					)}
					d="M0.5 152.711V6.24322C0.5 4.90687 2.11571 4.23762 3.06066 5.18257L29.182 31.3039C30.0259 32.1478 30.5 33.2924 30.5 34.4859V124.468C30.5 125.661 30.0259 126.806 29.182 127.65L3.06066 153.771C2.11571 154.716 0.5 154.047 0.5 152.711Z"
				/>

				<path
					className={controlInnerClassNames(
						'shape-side',
						'side-padding-top',
						openPopover === 'padding-top' ? 'selected-side' : ''
					)}
					d="M47.242 41.5H202.757C204.094 41.5 204.763 43.1157 203.818 44.0607L178.697 69.182C177.853 70.0259 176.708 70.5 175.515 70.5H74.4846C73.2912 70.5 72.1466 70.0259 71.3027 69.182L46.1813 44.0607C45.2364 43.1157 45.9056 41.5 47.242 41.5Z"
				/>

				<path
					className={controlInnerClassNames(
						'shape-side',
						'side-padding-right',
						openPopover === 'padding-right' ? 'selected-side' : ''
					)}
					d="M178.5 83.4679V75.4854C178.5 74.2919 178.974 73.1473 179.818 72.3034L204.939 47.1821C205.884 46.2371 207.5 46.9064 207.5 48.2427V110.711C207.5 112.047 205.884 112.716 204.939 111.771L179.818 86.6499C178.974 85.806 178.5 84.6614 178.5 83.4679Z"
				/>

				<path
					className={controlInnerClassNames(
						'shape-side',
						'side-padding-bottom',
						openPopover === 'padding-bottom' ? 'selected-side' : ''
					)}
					d="M74.4387 88.5H175.562C176.755 88.5 177.9 88.9741 178.744 89.818L203.865 114.939C204.81 115.884 204.141 117.5 202.804 117.5H47.1961C45.8597 117.5 45.1905 115.884 46.1354 114.939L71.2568 89.818C72.1007 88.9741 73.2453 88.5 74.4387 88.5Z"
				/>

				<path
					className={controlInnerClassNames(
						'shape-side',
						'side-padding-left',
						openPopover === 'padding-left' ? 'selected-side' : ''
					)}
					d="M42.5 110.711V48.2432C42.5 46.9069 44.1157 46.2376 45.0607 47.1826L70.182 72.3039C71.0259 73.1478 71.5 74.2924 71.5 75.4859V83.468C71.5 84.6615 71.0259 85.8061 70.182 86.65L45.0607 111.771C44.1157 112.716 42.5 112.047 42.5 110.711Z"
				/>
			</svg>

			<span
				className={controlInnerClassNames(
					'box-model-label',
					'box-mode-margin'
				)}
			>
				{__('Margin', 'publisher-core')}
			</span>

			<span
				className={controlInnerClassNames(
					'box-model-label',
					'box-mode-padding'
				)}
			>
				{__('Padding', 'publisher-core')}
			</span>

			<div
				className={controlInnerClassNames(
					'label-side',
					'side-margin-top'
				)}
			>
				<LabelControl
					label={fixLabelText(controlValue.margin.top)}
					onClick={() => setOpenPopover('margin-top')}
				/>

				<SidePopover
					icon={<MarginTopIcon />}
					onClose={() => setOpenPopover('')}
					title={__('Margin Top', 'publisher-core')}
					value={controlValue.margin.top}
					isOpen={openPopover === 'margin-top'}
					onValueChange={(newValue) => {
						const value = onChange({
							...controlValue,
							margin: {
								...controlValue.margin,
								top: newValue,
							},
						});

						setControlValue(value);

						onValueChange(value);

						return value;
					}}
				/>
			</div>

			<div
				className={controlInnerClassNames(
					'label-side',
					'side-margin-right'
				)}
			>
				<LabelControl
					label={fixLabelText(controlValue.margin.right)}
					onClick={() => setOpenPopover('margin-right')}
				/>

				<SidePopover
					offset={255}
					icon={<MarginRightIcon />}
					onClose={() => setOpenPopover('')}
					title={__('Margin Right', 'publisher-core')}
					value={controlValue.margin.right}
					isOpen={openPopover === 'margin-right'}
					onValueChange={(newValue) => {
						const value = onChange({
							...controlValue,
							margin: {
								...controlValue.margin,
								right: newValue,
							},
						});

						setControlValue(value);

						onValueChange(value);

						return value;
					}}
				/>
			</div>

			<div
				className={controlInnerClassNames(
					'label-side',
					'side-margin-bottom'
				)}
			>
				<LabelControl
					label={fixLabelText(controlValue.margin.bottom)}
					onClick={() => setOpenPopover('margin-bottom')}
				/>

				<SidePopover
					icon={<MarginBottomIcon />}
					onClose={() => setOpenPopover('')}
					title={__('Margin Bottom', 'publisher-core')}
					value={controlValue.margin.bottom}
					isOpen={openPopover === 'margin-bottom'}
					onValueChange={(newValue) => {
						const value = onChange({
							...controlValue,
							margin: {
								...controlValue.margin,
								bottom: newValue,
							},
						});

						setControlValue(value);

						onValueChange(value);

						return value;
					}}
				/>
			</div>

			<div
				className={controlInnerClassNames(
					'label-side',
					'side-margin-left'
				)}
			>
				<LabelControl
					label={fixLabelText(controlValue.margin.left)}
					onClick={() => setOpenPopover('margin-left')}
				/>

				<SidePopover
					icon={<MarginLeftIcon />}
					onClose={() => setOpenPopover('')}
					title={__('Margin Left', 'publisher-core')}
					value={controlValue.margin.left}
					isOpen={openPopover === 'margin-left'}
					onValueChange={(newValue) => {
						const value = onChange({
							...controlValue,
							margin: {
								...controlValue.margin,
								left: newValue,
							},
						});

						setControlValue(value);

						onValueChange(value);

						return value;
					}}
				/>
			</div>

			<div
				className={controlInnerClassNames(
					'label-side',
					'side-padding-top'
				)}
			>
				<LabelControl
					label={fixLabelText(controlValue.padding.top)}
					onClick={() => setOpenPopover('padding-top')}
				/>

				<SidePopover
					type="padding"
					icon={<PaddingTopIcon />}
					onClose={() => setOpenPopover('')}
					title={__('Padding Top', 'publisher-core')}
					value={controlValue.padding.top}
					isOpen={openPopover === 'padding-top'}
					onValueChange={(newValue) => {
						const value = onChange({
							...controlValue,
							padding: {
								...controlValue.padding,
								top: newValue,
							},
						});

						setControlValue(value);

						onValueChange(value);

						return value;
					}}
				/>
			</div>

			<div
				className={controlInnerClassNames(
					'label-side',
					'side-padding-right'
				)}
			>
				<LabelControl
					label={fixLabelText(controlValue.padding.right)}
					onClick={() => setOpenPopover('padding-right')}
				/>

				<SidePopover
					offset={215}
					type="padding"
					icon={<PaddingRightIcon />}
					onClose={() => setOpenPopover('')}
					title={__('Padding Right', 'publisher-core')}
					value={controlValue.padding.right}
					isOpen={openPopover === 'padding-right'}
					onValueChange={(newValue) => {
						const value = onChange({
							...controlValue,
							padding: {
								...controlValue.padding,
								right: newValue,
							},
						});

						setControlValue(value);

						onValueChange(value);

						return value;
					}}
				/>
			</div>

			<div
				className={controlInnerClassNames(
					'label-side',
					'side-padding-bottom'
				)}
			>
				<LabelControl
					label={fixLabelText(controlValue.padding.bottom)}
					onClick={() => setOpenPopover('padding-bottom')}
				/>

				<SidePopover
					type="padding"
					icon={<PaddingBottomIcon />}
					onClose={() => setOpenPopover('')}
					title={__('Padding Bottom', 'publisher-core')}
					value={controlValue.padding.bottom}
					isOpen={openPopover === 'padding-bottom'}
					onValueChange={(newValue) => {
						const value = onChange({
							...controlValue,
							padding: {
								...controlValue.padding,
								bottom: newValue,
							},
						});

						setControlValue(value);

						onValueChange(value);

						return value;
					}}
				/>
			</div>

			<div
				className={controlInnerClassNames(
					'label-side',
					'side-padding-left'
				)}
			>
				<LabelControl
					label={fixLabelText(controlValue.padding.left)}
					onClick={() => setOpenPopover('padding-left')}
				/>

				<SidePopover
					offset={78}
					type="padding"
					icon={<PaddingLeftIcon />}
					onClose={() => setOpenPopover('')}
					title={__('Padding Left', 'publisher-core')}
					value={controlValue.padding.left}
					isOpen={openPopover === 'padding-left'}
					onValueChange={(newValue) => {
						const value = onChange({
							...controlValue,
							padding: {
								...controlValue.padding,
								left: newValue,
							},
						});

						setControlValue(value);

						onValueChange(value);

						return value;
					}}
				/>
			</div>
		</div>
	);
};

export default BoxSpacingControl;
