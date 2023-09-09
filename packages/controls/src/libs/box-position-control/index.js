/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import { useState, memo } from '@wordpress/element';
import PropTypes from 'prop-types';

/**
 * Publisher dependencies
 */
import {
	controlClassNames,
	controlInnerClassNames,
} from '@publisher/classnames';
import { Button, Flex, Grid } from '@publisher/components';

/**
 * Internal dependencies
 */
import { LabelControl, SelectControl } from '../index';
import { SidePopover } from './components/side-popover';

// icons
import { default as SideTopIcon } from './icons/side-top';
import { default as SideRightIcon } from './icons/side-right';
import { default as SideBottomIcon } from './icons/side-bottom';
import { default as SideLeftIcon } from './icons/side-left';
import { default as StaticIcon } from './icons/static';
import { default as RelativeIcon } from './icons/relative';
import { default as AbsoluteIcon } from './icons/absolute';
import { default as FixedIcon } from './icons/fixed';
import { default as StickyIcon } from './icons/sticky';
import { default as AbsoluteTopLeftIcon } from './icons/absolute-top-left';
import { default as AbsoluteTopRightIcon } from './icons/absolute-top-right';
import { default as AbsoluteBottomRightIcon } from './icons/absolute-bottom-right';
import { default as AbsoluteBottomLeftIcon } from './icons/absolute-bottom-left';
import { default as AbsoluteTopIcon } from './icons/absolute-top';
import { default as AbsoluteRightIcon } from './icons/absolute-right';
import { default as AbsoluteBottomIcon } from './icons/absolute-bottom';
import { default as AbsoluteLeftIcon } from './icons/absolute-left';
import { default as AbsoluteFullIcon } from './icons/absolute-full';
import { default as AbsoluteCenterIcon } from './icons/absolute-center';
import { useControlContext } from '../../context';
import { hasSameProps } from '@publisher/extensions';

function BoxPositionControl({
	openSide,
	//
	id,
	label,
	defaultValue,
	onChange,
	//
	className,
	...props
}) {
	const { value, setValue, getId } = useControlContext({
		id,
		onChange,
		defaultValue,
		mergeInitialAndDefault: true,
	});

	const [openPopover, setOpenPopover] = useState(openSide);

	function fixLabelText(value) {
		if (value === '') {
			value = '-';
		} else {
			// remove px
			value = value.replace('px', '', value);

			const match = /(\d+)(auto|px|%|em|rem|ch|vw|vh|dvw|dvh)/gi.exec(
				value
			);
			if (match) {
				if (match[2] === 'auto') {
					value = <>Auto</>;
				} else {
					value = (
						<>
							{match[1]}
							<i>{match[2]}</i>
						</>
					);
				}
			}
		}
		return value;
	}

	return (
		<div
			{...props}
			className={controlClassNames('box-position', className)}
		>
			<div className={controlInnerClassNames('position-header')}>
				{label && (
					<div className={controlInnerClassNames('label')}>
						<LabelControl label={label} />
					</div>
				)}

				<SelectControl
					id={getId(id, 'type')}
					options={[
						{
							label: __('Default', 'publisher-core'),
							value: 'static',
							icon: <StaticIcon />,
						},
						{
							label: __('Relative', 'publisher-core'),
							value: 'relative',
							icon: <RelativeIcon />,
						},
						{
							label: __('Absolute', 'publisher-core'),
							value: 'absolute',
							icon: <AbsoluteIcon />,
						},
						{
							label: __('Fixed', 'publisher-core'),
							value: 'fixed',
							icon: <FixedIcon />,
						},
						{
							label: __('Sticky', 'publisher-core'),
							value: 'sticky',
							icon: <StickyIcon />,
						},
					]}
					type="custom"
					aria-label={__('Choose Position', 'publisher-core')}
					//
					defaultValue="static"
					onChange={(newValue) => {
						setValue({
							...value,
							type: newValue,
						});
					}}
				/>
			</div>

			{value.type !== 'static' && value.type !== 'inherit' && (
				<div
					className={controlInnerClassNames(
						'position-body',
						'type-' + value.type
					)}
				>
					<svg
						width="250"
						height="77"
						viewBox="0 0 250 77"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							className={controlInnerClassNames(
								'shape-side',
								'side-horizontal',
								'side-top',
								openPopover === 'top' ? 'selected-side' : ''
							)}
							d="M5.242 0.5H244.757C246.094 0.5 246.763 2.11572 245.818 3.06066L220.697 28.182C219.853 29.0259 218.708 29.5 217.515 29.5H32.4846C31.2912 29.5 30.1466 29.0259 29.3027 28.182L4.18134 3.06066C3.23639 2.11571 3.90564 0.5 5.242 0.5Z"
						/>

						<path
							className={controlInnerClassNames(
								'shape-side',
								'side-vertical',
								'side-right',
								openPopover === 'right' ? 'selected-side' : ''
							)}
							d="M220.5 42.4679V34.4854C220.5 33.2919 220.974 32.1473 221.818 31.3034L246.939 6.18207C247.884 5.23713 249.5 5.90638 249.5 7.24273V69.7106C249.5 71.0469 247.884 71.7162 246.939 70.7712L221.818 45.6499C220.974 44.806 220.5 43.6614 220.5 42.4679Z"
						/>

						<path
							className={controlInnerClassNames(
								'shape-side',
								'side-horizontal',
								'side-bottom',
								openPopover === 'bottom' ? 'selected-side' : ''
							)}
							d="M32.4387 47.5H217.562C218.755 47.5 219.9 47.9741 220.744 48.818L245.865 73.9393C246.81 74.8843 246.141 76.5 244.804 76.5H5.19611C3.85975 76.5 3.1905 74.8843 4.13544 73.9393L29.2568 48.818C30.1007 47.9741 31.2453 47.5 32.4387 47.5Z"
						/>

						<path
							className={controlInnerClassNames(
								'shape-side',
								'side-vertical',
								'side-left',
								openPopover === 'left' ? 'selected-side' : ''
							)}
							d="M0.5 69.7106V7.24322C0.5 5.90687 2.11571 5.23761 3.06066 6.18256L28.182 31.3039C29.0259 32.1478 29.5 33.2924 29.5 34.4859V42.468C29.5 43.6615 29.0259 44.8061 28.182 45.65L3.06066 70.7713C2.11571 71.7163 0.5 71.047 0.5 69.7106Z"
						/>
					</svg>

					<span className={controlInnerClassNames('box-model-label')}>
						<>
							{value.type === 'relative' && (
								<>{__('Relative Position', 'publisher-core')}</>
							)}

							{value.type === 'absolute' && (
								<>{__('Absolute Position', 'publisher-core')}</>
							)}

							{value.type === 'fixed' && (
								<>{__('Fixed Position', 'publisher-core')}</>
							)}

							{value.type === 'sticky' && (
								<>{__('Sticky Position', 'publisher-core')}</>
							)}
						</>
					</span>

					<div
						className={controlInnerClassNames(
							'label-side',
							'side-horizontal',
							'side-top'
						)}
					>
						<LabelControl
							ariaLabel={__('Top Position', 'publisher-core')}
							label={fixLabelText(value.position.top)}
							onClick={() => setOpenPopover('top')}
						/>

						<SidePopover
							id={getId(id, 'position.top')}
							icon={<SideTopIcon />}
							onClose={() => setOpenPopover('')}
							title={__('Top Position', 'publisher-core')}
							isOpen={openPopover === 'top'}
							onChange={(newValue) => {
								setValue({
									...value,
									position: {
										...value.position,
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
							'side-right'
						)}
					>
						<LabelControl
							ariaLabel={__('Right Position', 'publisher-core')}
							label={fixLabelText(value.position.right)}
							onClick={() => setOpenPopover('right')}
						/>

						<SidePopover
							id={getId(id, 'position.right')}
							offset={255}
							icon={<SideRightIcon />}
							onClose={() => setOpenPopover('')}
							title={__('Right Position', 'publisher-core')}
							isOpen={openPopover === 'right'}
							onChange={(newValue) => {
								setValue({
									...value,
									position: {
										...value.position,
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
							'side-bottom'
						)}
					>
						<LabelControl
							ariaLabel={__('Bottom Position', 'publisher-core')}
							label={fixLabelText(value.position.bottom)}
							onClick={() => setOpenPopover('bottom')}
						/>

						<SidePopover
							id={getId(id, 'position.bottom')}
							icon={<SideBottomIcon />}
							onClose={() => setOpenPopover('')}
							title={__('Bottom Position', 'publisher-core')}
							isOpen={openPopover === 'bottom'}
							onChange={(newValue) => {
								setValue({
									...value,
									position: {
										...value.position,
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
							'side-left'
						)}
					>
						<LabelControl
							ariaLabel={__('Left Position', 'publisher-core')}
							label={fixLabelText(value.position.left)}
							onClick={() => setOpenPopover('left')}
						/>

						<SidePopover
							id={getId(id, 'position.left')}
							icon={<SideLeftIcon />}
							onClose={() => setOpenPopover('')}
							title={__('Left Position', 'publisher-core')}
							isOpen={openPopover === 'left'}
							onChange={(newValue) => {
								setValue({
									...value,
									position: {
										...value.position,
										left: newValue,
									},
								});
							}}
						/>
					</div>

					{value.type === 'absolute' && (
						<Flex
							direction="row"
							justifyContent="center"
							alignItems="flex-start"
							gap="20px"
							style={{
								marginTop: '10px',
							}}
						>
							<Grid
								gridTemplateColumns="repeat(2, 1fr)"
								gap="10px"
							>
								<Button
									aria-label={__(
										'Top Left',
										'publisher-core'
									)}
									className="position-quick-btn"
									size="small"
									onClick={() => {
										setValue({
											...value,
											position: {
												...value.position,
												top: '0px',
												right: '',
												bottom: '',
												left: '0px',
											},
										});
									}}
								>
									<AbsoluteTopLeftIcon />
								</Button>
								<Button
									aria-label={__(
										'Top Right',
										'publisher-core'
									)}
									className="position-quick-btn"
									size="small"
									onClick={() => {
										setValue({
											...value,
											position: {
												...value.position,
												top: '0px',
												right: '0px',
												bottom: '',
												left: '',
											},
										});
									}}
								>
									<AbsoluteTopRightIcon />
								</Button>
								<Button
									aria-label={__(
										'Bottom Left',
										'publisher-core'
									)}
									className="position-quick-btn"
									size="small"
									onClick={() => {
										setValue({
											...value,
											position: {
												...value.position,
												top: '',
												right: '',
												bottom: '0px',
												left: '0px',
											},
										});
									}}
								>
									<AbsoluteBottomLeftIcon />
								</Button>

								<Button
									aria-label={__(
										'Bottom Right',
										'publisher-core'
									)}
									className="position-quick-btn"
									size="small"
									onClick={() => {
										setValue({
											...value,
											position: {
												...value.position,
												top: '',
												right: '0px',
												bottom: '0px',
												left: '',
											},
										});
									}}
								>
									<AbsoluteBottomRightIcon />
								</Button>
							</Grid>

							<Grid
								gridTemplateColumns="repeat(2, 1fr)"
								gap="10px"
							>
								<Button
									aria-label={__('Top', 'publisher-core')}
									className="position-quick-btn"
									size="small"
									onClick={() => {
										setValue({
											...value,
											position: {
												...value.position,
												top: '0px',
												right: '0px',
												bottom: '',
												left: '0px',
											},
										});
									}}
								>
									<AbsoluteTopIcon />
								</Button>
								<Button
									aria-label={__('Right', 'publisher-core')}
									className="position-quick-btn"
									size="small"
									onClick={() => {
										setValue({
											...value,
											position: {
												...value.position,
												top: '0px',
												right: '0px',
												bottom: '0px',
												left: '',
											},
										});
									}}
								>
									<AbsoluteRightIcon />
								</Button>
								<Button
									aria-label={__('Bottom', 'publisher-core')}
									className="position-quick-btn"
									size="small"
									onClick={() => {
										setValue({
											...value,
											position: {
												...value.position,
												top: '',
												right: '0px',
												bottom: '0px',
												left: '0px',
											},
										});
									}}
								>
									<AbsoluteBottomIcon />
								</Button>
								<Button
									aria-label={__('Left', 'publisher-core')}
									className="position-quick-btn"
									size="small"
									onClick={() => {
										setValue({
											...value,
											position: {
												...value.position,
												top: '0px',
												right: '',
												bottom: '0px',
												left: '0px',
											},
										});
									}}
								>
									<AbsoluteLeftIcon />
								</Button>
							</Grid>

							<Grid gridTemplateColumns="1fr" gap="10px">
								<Button
									aria-label={__('Full', 'publisher-core')}
									className="position-quick-btn"
									size="small"
									onClick={() => {
										setValue({
											...value,
											position: {
												...value.position,
												top: '0px',
												right: '0px',
												bottom: '0px',
												left: '0px',
											},
										});
									}}
								>
									<AbsoluteFullIcon />
								</Button>
								<Button
									aria-label={__('Center', 'publisher-core')}
									className="position-quick-btn"
									size="small"
									onClick={() => {
										setValue({
											...value,
											position: {
												...value.position,
												top: '20%',
												right: '20%',
												bottom: '20%',
												left: '20%',
											},
										});
									}}
								>
									<AbsoluteCenterIcon />
								</Button>
							</Grid>
						</Flex>
					)}
				</div>
			)}
		</div>
	);
}

BoxPositionControl.propTypes = {
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
	defaultValue: PropTypes.shape({
		type: PropTypes.oneOf([
			'static',
			'relative',
			'absolute',
			'sticky',
			'fixed',
		]),
		position: PropTypes.shape({
			top: PropTypes.string,
			right: PropTypes.string,
			bottom: PropTypes.string,
			left: PropTypes.string,
		}),
	}),
	/**
	 * Function that will be fired while the control value state changes.
	 */
	onChange: PropTypes.func,
	/**
	 * The current value.
	 */
	value: PropTypes.shape({
		type: PropTypes.oneOf([
			'static',
			'relative',
			'absolute',
			'sticky',
			'fixed',
		]),
		position: {
			top: PropTypes.string,
			right: PropTypes.string,
			bottom: PropTypes.string,
			left: PropTypes.string,
		},
	}),
	/**
	 * Specifies which side is open by default.
	 *
	 * @default ``
	 */
	openSide: PropTypes.oneOf(['top', 'right', 'bottom', 'left', '']),
};

BoxPositionControl.defaultProps = {
	defaultValue: {
		type: 'static',
		position: {
			top: '',
			right: '',
			bottom: '',
			left: '',
		},
	},
	openSide: '',
	label: __('Position', 'publisher-core'),
};

export default memo(BoxPositionControl, hasSameProps);
