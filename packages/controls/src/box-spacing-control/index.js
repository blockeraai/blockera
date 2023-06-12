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
import './style.scss';
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
	initValue = {
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
		...initValue,
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
					d="M32.6207 30.5L2.62068 0.5H247.379L217.379 30.5H32.6207Z"
				/>

				<path
					className={controlInnerClassNames(
						'shape-side',
						'side-margin-right',
						openPopover === 'margin-right' ? 'selected-side' : ''
					)}
					d="M249.5 156.332L219.5 126.332V32.6214L249.5 2.62141V156.332Z"
				/>

				<path
					className={controlInnerClassNames(
						'shape-side',
						'side-margin-bottom',
						openPopover === 'margin-bottom' ? 'selected-side' : ''
					)}
					d="M32.5748 128.5H217.426L247.426 158.5H2.57478L32.5748 128.5Z"
				/>

				<path
					className={controlInnerClassNames(
						'shape-side',
						'side-margin-left',
						openPopover === 'margin-left' ? 'selected-side' : ''
					)}
					d="M0.5 156.332V2.6219L30.5 32.6219V126.332L0.5 156.332Z"
				/>

				<path
					className={controlInnerClassNames(
						'shape-side',
						'side-padding-top',
						openPopover === 'padding-top' ? 'selected-side' : ''
					)}
					d="M72.6207 70.5L43.6207 41.5H206.379L177.379 70.5H72.6207Z"
				/>

				<path
					className={controlInnerClassNames(
						'shape-side',
						'side-padding-right',
						openPopover === 'padding-right' ? 'selected-side' : ''
					)}
					d="M207.5 114.332L178.5 85.3319V73.6214L207.5 44.6214V114.332Z"
				/>

				<path
					className={controlInnerClassNames(
						'shape-side',
						'side-padding-bottom',
						openPopover === 'padding-bottom' ? 'selected-side' : ''
					)}
					d="M43.5748 117.5L72.5748 88.5H177.426L206.426 117.5H43.5748Z"
				/>

				<path
					className={controlInnerClassNames(
						'shape-side',
						'side-padding-left',
						openPopover === 'padding-left' ? 'selected-side' : ''
					)}
					d="M42.5 114.332V44.6219L71.5 73.6219V85.332L42.5 114.332Z"
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
					label={__('Margin Top', 'publisher-core')}
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
					label={__('Margin Right', 'publisher-core')}
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
					label={__('Margin Bottom', 'publisher-core')}
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
					label={__('Margin Left', 'publisher-core')}
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
					label={__('Padding Top', 'publisher-core')}
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
					label={__('Padding Right', 'publisher-core')}
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
					label={__('Padding Bottom', 'publisher-core')}
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
					label={__('Padding Left', 'publisher-core')}
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
