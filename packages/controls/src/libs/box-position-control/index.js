// @flow
/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import { useState, memo } from '@wordpress/element';
import type { MixedElement } from 'react';

/**
 * Publisher dependencies
 */
import {
	controlClassNames,
	controlInnerClassNames,
} from '@publisher/classnames';
import { hasSameProps } from '@publisher/extensions';
import { Button, Flex, Grid } from '@publisher/components';

/**
 * Internal dependencies
 */
import { LabelControl, NoticeControl, SelectControl } from '../index';
import { useControlContext } from '../../context';
import type { BoxPositionControlProps } from './types';
import { LabelControlContainer } from '../label-control';
import { SideItem } from './components/side-item';
// icons
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

const Component = ({
	openSide = '',
	//
	id,
	label = __('Position', 'publisher-core'),
	labelPopoverTitle,
	labelDescription,
	repeaterItem,
	singularId,
	defaultValue = {
		type: 'static',
		position: {
			top: '',
			right: '',
			bottom: '',
			left: '',
		},
	},
	onChange,
	//
	className,
	...props
}: BoxPositionControlProps): MixedElement => {
	const {
		value,
		setValue,
		getId,
		attribute,
		blockName,
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

	const labelProps = {
		value,
		singularId,
		attribute,
		blockName,
		label,
		labelPopoverTitle,
		repeaterItem,
		defaultValue,
		resetToDefault,
		mode: 'advanced',
		path: getControlPath(attribute, id),
		labelDescription: labelDescription ? (
			labelDescription
		) : (
			<>
				<p>
					{__(
						'Easily manipulate the placement of block with using CSS positioning.',
						'publisher-core'
					)}
				</p>
				<h3>
					<RelativeIcon />
					{__('Relative', 'publisher-core')}
				</h3>
				<p>
					{__(
						'Positions the block relative to its normal position, allowing adjustments.',
						'publisher-core'
					)}
				</p>
				<h3>
					<AbsoluteIcon />
					{__('Absolute', 'publisher-core')}
				</h3>
				<p>
					{__(
						'Removes the block from the document flow. Positioned relative to its nearest positioned ancestor.',
						'publisher-core'
					)}
				</p>
				<h3>
					<FixedIcon />
					{__('Fixed', 'publisher-core')}
				</h3>
				<p>
					{__(
						'Positions the block relative to the browser window, remaining fixed during scrolling.',
						'publisher-core'
					)}
				</p>
				<h3>
					<StickyIcon />
					{__('Sticky', 'publisher-core')}
				</h3>
				<p>
					{__(
						'A hybrid of relative and fixed. The block is treated as relative until it crosses a specified threshold, then it becomes fixed.',
						'publisher-core'
					)}
				</p>
			</>
		),
	};

	const sideProps = {
		id,
		getId,
		//
		value,
		setValue,
		attribute,
		blockName,
		defaultValue,
		resetToDefault,
		getControlPath,
		//
		focusSide,
		setFocusSide,
		openPopover,
		setOpenPopover,
	};

	const SideTop = SideItem({ ...sideProps, side: 'top' });
	const SideRight = SideItem({ ...sideProps, side: 'right' });
	const SideBottom = SideItem({ ...sideProps, side: 'bottom' });
	const SideLeft = SideItem({ ...sideProps, side: 'left' });

	let labelText = '';

	switch (value.type) {
		case 'absolute':
			labelText = __('Absolute', 'publisher-core');
			break;
		case 'fixed':
			labelText = __('Fixed', 'publisher-core');
			break;
		case 'sticky':
			labelText = __('Sticky', 'publisher-core');
			break;
		default:
			labelText = __('Relative', 'publisher-core');
			break;
	}

	return (
		<div
			className={controlClassNames('box-position', className)}
			data-cy="box-position-control"
			{...props}
		>
			<div className={controlInnerClassNames('position-header')}>
				{label && (
					<LabelControlContainer>
						<LabelControl
							{...labelProps}
							path={getControlPath(attribute, 'type')}
						/>
					</LabelControlContainer>
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
						height="84"
						viewBox="0 0 250 84"
						xmlns="http://www.w3.org/2000/svg"
					>
						{SideTop.shape}
						{SideRight.shape}
						{SideBottom.shape}
						{SideLeft.shape}
					</svg>

					{SideTop.label}
					{SideRight.label}
					{SideBottom.label}
					{SideLeft.label}

					<span className={controlInnerClassNames('box-model-label')}>
						<LabelControl
							{...labelProps}
							singularId={'position'}
							defaultValue={defaultValue.position}
							value={value.position}
							label={labelText}
							path={getControlPath(attribute, 'position')}
							labelDescription={
								<>
									{value.type === 'relative' && (
										<>
											<p>
												{__(
													"Position Relative sets a block's position in relation to its normal position, allowing for fine-tuning without affecting the document flow.",
													'publisher-core'
												)}
											</p>
											<p>
												{__(
													'This feature is crucial for subtle adjustments or for setting a positioning context for absolutely positioned child blocks.',
													'publisher-core'
												)}
											</p>
										</>
									)}
									{value.type === 'absolute' && (
										<>
											<p>
												{__(
													'Position Absolute allows for precise block placement relative to the nearest positioned ancestor, enabling pixel-perfect layout control.',
													'publisher-core'
												)}
											</p>
											<p>
												{__(
													'Ideal for creating fixed blocks in dynamic layouts, this feature offers unparalleled control for overlaying and aligning content accurately.',
													'publisher-core'
												)}
											</p>
										</>
									)}
									{value.type === 'fixed' && (
										<>
											<p>
												{__(
													'Position Fixed anchors block to a specific spot on the page, regardless of scrolling, ensuring constant visibility and placement.',
													'publisher-core'
												)}
											</p>
											<p>
												{__(
													'Ideal for persistent navigation menus, back to top buttons or call-to-action buttons, it enhances user experience by keeping important blocks accessible.',
													'publisher-core'
												)}
											</p>
										</>
									)}
									{value.type === 'sticky' && (
										<>
											<p>
												{__(
													'Position Sticky offers a hybrid approach, keeping blocks static until a specified point, then fixing them as the page scrolls.',
													'publisher-core'
												)}
											</p>
											<p>
												{__(
													'This feature is great for headers or important information, as it ensures visibility without disrupting the natural flow of the page.',
													'publisher-core'
												)}
											</p>
										</>
									)}
								</>
							}
						/>
					</span>

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
									label={__(
										'Fix At Top Left Corner',
										'publisher-core'
									)}
									showTooltip={true}
									className="position-quick-btn"
									size="small"
									data-cy="absolute-top-left"
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
									label={__(
										'Fix At Top Right Corner',
										'publisher-core'
									)}
									showTooltip={true}
									className="position-quick-btn"
									size="small"
									data-cy="absolute-top-right"
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
									label={__(
										'Fix At Bottom Left Corner',
										'publisher-core'
									)}
									showTooltip={true}
									className="position-quick-btn"
									size="small"
									data-cy="absolute-bottom-left"
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
									label={__(
										'Fix At Bottom Right Corner',
										'publisher-core'
									)}
									showTooltip={true}
									className="position-quick-btn"
									size="small"
									data-cy="absolute-bottom-right"
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
									label={__(
										'Position As Full-Width At Top Side',
										'publisher-core'
									)}
									showTooltip={true}
									className="position-quick-btn"
									size="small"
									data-cy="absolute-top"
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
									label={__(
										'Position As Full-Height At Right Side',
										'publisher-core'
									)}
									showTooltip={true}
									className="position-quick-btn"
									size="small"
									data-cy="absolute-right"
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
									label={__(
										'Position As Full-Width At Bottom Side',
										'publisher-core'
									)}
									showTooltip={true}
									className="position-quick-btn"
									size="small"
									data-cy="absolute-bottom"
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
									label={__(
										'Position As Full-Height At Left Side',
										'publisher-core'
									)}
									showTooltip={true}
									className="position-quick-btn"
									size="small"
									data-cy="absolute-left"
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
									label={__(
										'Position As Full-Width and Full-Height',
										'publisher-core'
									)}
									showTooltip={true}
									className="position-quick-btn"
									size="small"
									data-cy="absolute-full"
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
									label={__(
										'Position Centrally With Equal Margins (20%) From All Edges',
										'publisher-core'
									)}
									showTooltip={true}
									className="position-quick-btn"
									size="small"
									data-cy="absolute-center"
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

					{value.type === 'sticky' && (
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
									label={__('Stick To Top', 'publisher-core')}
									showTooltip={true}
									className="position-quick-btn"
									size="small"
									data-cy="stick-to-top"
									onClick={() => {
										setValue({
											...value,
											position: {
												...value.position,
												top: '0px',
												right: '',
												bottom: '',
												left: '',
											},
										});
									}}
								>
									<AbsoluteTopIcon />
								</Button>
								<Button
									label={__(
										'Stick To Bottom',
										'publisher-core'
									)}
									showTooltip={true}
									className="position-quick-btn"
									size="small"
									data-cy="stick-to-bottom"
									onClick={() => {
										setValue({
											...value,
											position: {
												...value.position,
												top: '',
												right: '',
												bottom: '0px',
												left: '',
											},
										});
									}}
								>
									<AbsoluteBottomIcon />
								</Button>
							</Grid>
						</Flex>
					)}
				</div>
			)}

			{value?.type === 'sticky' &&
				value?.position?.top &&
				value?.position?.bottom && (
					<NoticeControl type="error">
						<p>
							{__(
								'Selecting both "Top" and "Bottom" for sticky positioning can lead to issues. Set value only for "Top" or "Bottom" to ensure smooth functionality.',
								'publisher-core'
							)}
						</p>

						<Flex
							direction="column"
							gap="10px"
							alignItems="flex-start"
						>
							<Button
								label={__('Stick To Top', 'publisher-core')}
								showTooltip={true}
								className="position-quick-btn"
								size="small"
								data-cy="stick-to-top"
								onClick={() => {
									setValue({
										...value,
										position: {
											...value.position,
											top: '0px',
											right: '',
											bottom: '',
											left: '',
										},
									});
								}}
							>
								<AbsoluteTopIcon />
								{__('Stick To Top', 'publisher-core')}
							</Button>
							<Button
								label={__('Stick To Bottom', 'publisher-core')}
								showTooltip={true}
								className="position-quick-btn"
								size="small"
								data-cy="stick-to-bottom"
								onClick={() => {
									setValue({
										...value,
										position: {
											...value.position,
											top: '',
											right: '',
											bottom: '0px',
											left: '',
										},
									});
								}}
							>
								<AbsoluteBottomIcon />
								{__('Stick To Bottom', 'publisher-core')}
							</Button>
						</Flex>
					</NoticeControl>
				)}
		</div>
	);
};

const BoxPositionControl: BoxPositionControlProps =
	memo<BoxPositionControlProps>(Component, hasSameProps);

export default BoxPositionControl;
