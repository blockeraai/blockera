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

const BoxPositionControl = ({
	label = __('Position', 'publisher-core'),
	defaultValue = {
		type: 'static',
		position: {
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
					//
					defaultValue="static"
					value={controlValue.type}
					onChange={(newValue) => {
						const value = {
							...controlValue,
							type: newValue,
						};

						setControlValue(value);

						onValueChange(value);
					}}
				/>
			</div>

			{controlValue.type !== 'static' &&
				controlValue.type !== 'inherit' && (
					<div
						className={controlInnerClassNames(
							'position-body',
							'type-' + controlValue.type
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
									'side-top',
									openPopover === 'top' ? 'selected-side' : ''
								)}
								d="M5.242 0.5H244.757C246.094 0.5 246.763 2.11572 245.818 3.06066L220.697 28.182C219.853 29.0259 218.708 29.5 217.515 29.5H32.4846C31.2912 29.5 30.1466 29.0259 29.3027 28.182L4.18134 3.06066C3.23639 2.11571 3.90564 0.5 5.242 0.5Z"
							/>

							<path
								className={controlInnerClassNames(
									'shape-side',
									'side-right',
									openPopover === 'right'
										? 'selected-side'
										: ''
								)}
								d="M220.5 42.4679V34.4854C220.5 33.2919 220.974 32.1473 221.818 31.3034L246.939 6.18207C247.884 5.23713 249.5 5.90638 249.5 7.24273V69.7106C249.5 71.0469 247.884 71.7162 246.939 70.7712L221.818 45.6499C220.974 44.806 220.5 43.6614 220.5 42.4679Z"
							/>

							<path
								className={controlInnerClassNames(
									'shape-side',
									'side-bottom',
									openPopover === 'bottom'
										? 'selected-side'
										: ''
								)}
								d="M32.4387 47.5H217.562C218.755 47.5 219.9 47.9741 220.744 48.818L245.865 73.9393C246.81 74.8843 246.141 76.5 244.804 76.5H5.19611C3.85975 76.5 3.1905 74.8843 4.13544 73.9393L29.2568 48.818C30.1007 47.9741 31.2453 47.5 32.4387 47.5Z"
							/>

							<path
								className={controlInnerClassNames(
									'shape-side',
									'side-left',
									openPopover === 'left'
										? 'selected-side'
										: ''
								)}
								d="M0.5 69.7106V7.24322C0.5 5.90687 2.11571 5.23761 3.06066 6.18256L28.182 31.3039C29.0259 32.1478 29.5 33.2924 29.5 34.4859V42.468C29.5 43.6615 29.0259 44.8061 28.182 45.65L3.06066 70.7713C2.11571 71.7163 0.5 71.047 0.5 69.7106Z"
							/>
						</svg>

						<span
							className={controlInnerClassNames(
								'box-model-label'
							)}
						>
							<>
								{controlValue.type === 'relative' && (
									<>
										{__(
											'Relative Position',
											'publisher-core'
										)}
									</>
								)}

								{controlValue.type === 'absolute' && (
									<>
										{__(
											'Absolute Position',
											'publisher-core'
										)}
									</>
								)}

								{controlValue.type === 'fixed' && (
									<>
										{__('Fixed Position', 'publisher-core')}
									</>
								)}

								{controlValue.type === 'sticky' && (
									<>
										{__(
											'Sticky Position',
											'publisher-core'
										)}
									</>
								)}
							</>
						</span>

						<div
							className={controlInnerClassNames(
								'label-side',
								'side-top'
							)}
						>
							<LabelControl
								label={fixLabelText(controlValue.position.top)}
								onClick={() => setOpenPopover('top')}
							/>

							<SidePopover
								icon={<SideTopIcon />}
								onClose={() => setOpenPopover('')}
								title={__('Top Position', 'publisher-core')}
								value={controlValue.position.top}
								isOpen={openPopover === 'top'}
								onValueChange={(newValue) => {
									const value = onChange({
										...controlValue,
										position: {
											...controlValue.position,
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
								'side-right'
							)}
						>
							<LabelControl
								label={fixLabelText(
									controlValue.position.right
								)}
								onClick={() => setOpenPopover('right')}
							/>

							<SidePopover
								offset={255}
								icon={<SideRightIcon />}
								onClose={() => setOpenPopover('')}
								title={__('Right Position', 'publisher-core')}
								value={controlValue.position.right}
								isOpen={openPopover === 'right'}
								onValueChange={(newValue) => {
									const value = onChange({
										...controlValue,
										position: {
											...controlValue.position,
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
								'side-bottom'
							)}
						>
							<LabelControl
								label={fixLabelText(
									controlValue.position.bottom
								)}
								onClick={() => setOpenPopover('bottom')}
							/>

							<SidePopover
								icon={<SideBottomIcon />}
								onClose={() => setOpenPopover('')}
								title={__('Bottom Position', 'publisher-core')}
								value={controlValue.position.bottom}
								isOpen={openPopover === 'bottom'}
								onValueChange={(newValue) => {
									const value = onChange({
										...controlValue,
										position: {
											...controlValue.position,
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
								'side-left'
							)}
						>
							<LabelControl
								label={fixLabelText(controlValue.position.left)}
								onClick={() => setOpenPopover('left')}
							/>

							<SidePopover
								icon={<SideLeftIcon />}
								onClose={() => setOpenPopover('')}
								title={__('Left Position', 'publisher-core')}
								value={controlValue.position.left}
								isOpen={openPopover === 'left'}
								onValueChange={(newValue) => {
									const value = onChange({
										...controlValue,
										position: {
											...controlValue.position,
											left: newValue,
										},
									});

									setControlValue(value);

									onValueChange(value);

									return value;
								}}
							/>
						</div>

						{controlValue.type === 'absolute' && (
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
										className="position-quick-btn"
										size="small"
										onClick={() => {
											const value = {
												...controlValue,
												position: {
													...controlValue.position,
													top: '0px',
													right: '',
													bottom: '',
													left: '0px',
												},
											};

											setControlValue(value);

											onValueChange(value);
										}}
									>
										<AbsoluteTopLeftIcon />
									</Button>
									<Button
										className="position-quick-btn"
										size="small"
										onClick={() => {
											const value = {
												...controlValue,
												position: {
													...controlValue.position,
													top: '0px',
													right: '0px',
													bottom: '',
													left: '',
												},
											};

											setControlValue(value);

											onValueChange(value);
										}}
									>
										<AbsoluteTopRightIcon />
									</Button>
									<Button
										className="position-quick-btn"
										size="small"
										onClick={() => {
											const value = {
												...controlValue,
												position: {
													...controlValue.position,
													top: '',
													right: '',
													bottom: '0px',
													left: '0px',
												},
											};

											setControlValue(value);

											onValueChange(value);
										}}
									>
										<AbsoluteBottomLeftIcon />
									</Button>

									<Button
										className="position-quick-btn"
										size="small"
										onClick={() => {
											const value = {
												...controlValue,
												position: {
													...controlValue.position,
													top: '',
													right: '0px',
													bottom: '0px',
													left: '',
												},
											};

											setControlValue(value);

											onValueChange(value);
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
										className="position-quick-btn"
										size="small"
										onClick={() => {
											const value = {
												...controlValue,
												position: {
													...controlValue.position,
													top: '0px',
													right: '0px',
													bottom: '',
													left: '0px',
												},
											};

											setControlValue(value);

											onValueChange(value);
										}}
									>
										<AbsoluteTopIcon />
									</Button>
									<Button
										className="position-quick-btn"
										size="small"
										onClick={() => {
											const value = {
												...controlValue,
												position: {
													...controlValue.position,
													top: '0px',
													right: '0px',
													bottom: '0px',
													left: '',
												},
											};

											setControlValue(value);

											onValueChange(value);
										}}
									>
										<AbsoluteRightIcon />
									</Button>
									<Button
										className="position-quick-btn"
										size="small"
										onClick={() => {
											const value = {
												...controlValue,
												position: {
													...controlValue.position,
													top: '',
													right: '0px',
													bottom: '0px',
													left: '0px',
												},
											};

											setControlValue(value);

											onValueChange(value);
										}}
									>
										<AbsoluteBottomIcon />
									</Button>
									<Button
										className="position-quick-btn"
										size="small"
										onClick={() => {
											const value = {
												...controlValue,
												position: {
													...controlValue.position,
													top: '0px',
													right: '',
													bottom: '0px',
													left: '0px',
												},
											};

											setControlValue(value);

											onValueChange(value);
										}}
									>
										<AbsoluteLeftIcon />
									</Button>
								</Grid>

								<Grid gridTemplateColumns="1fr" gap="10px">
									<Button
										className="position-quick-btn"
										size="small"
										onClick={() => {
											const value = {
												...controlValue,
												position: {
													...controlValue.position,
													top: '0px',
													right: '0px',
													bottom: '0px',
													left: '0px',
												},
											};

											setControlValue(value);

											onValueChange(value);
										}}
									>
										<AbsoluteFullIcon />
									</Button>
									<Button
										className="position-quick-btn"
										size="small"
										onClick={() => {
											const value = {
												...controlValue,
												position: {
													...controlValue.position,
													top: '20%',
													right: '20%',
													bottom: '20%',
													left: '20%',
												},
											};

											setControlValue(value);

											onValueChange(value);
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
};

export default BoxPositionControl;
