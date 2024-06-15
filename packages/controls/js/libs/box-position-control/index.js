// @flow
/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import { useState, memo } from '@wordpress/element';
import type { MixedElement } from 'react';

/**
 * Blockera dependencies
 */
import {
	controlClassNames,
	controlInnerClassNames,
} from '@blockera/classnames';
import { hasSameProps } from '@blockera/utils';
import { Icon } from '@blockera/icons';

/**
 * Internal dependencies
 */
import {
	Flex,
	Grid,
	Button,
	LabelControl,
	NoticeControl,
	SelectControl,
} from '../index';
import { useControlContext } from '../../context';
import type { BoxPositionControlProps } from './types';
import { LabelControlContainer } from '../label-control';
import { SideItem } from './components/side-item';

const Component = ({
	openSide = '',
	//
	id,
	label = __('Position', 'blockera'),
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
						'blockera'
					)}
				</p>
				<h3>
					<Icon icon="position-relative" />
					{__('Relative', 'blockera')}
				</h3>
				<p>
					{__(
						'Positions the block relative to its normal position, allowing adjustments.',
						'blockera'
					)}
				</p>
				<h3>
					<Icon icon="position-absolute" />
					{__('Absolute', 'blockera')}
				</h3>
				<p>
					{__(
						'Removes the block from the document flow. Positioned relative to its nearest positioned ancestor.',
						'blockera'
					)}
				</p>
				<h3>
					<Icon icon="position-fixed" />
					{__('Fixed', 'blockera')}
				</h3>
				<p>
					{__(
						'Positions the block relative to the browser window, remaining fixed during scrolling.',
						'blockera'
					)}
				</p>
				<h3>
					<Icon icon="position-sticky" />
					{__('Sticky', 'blockera')}
				</h3>
				<p>
					{__(
						'A hybrid of relative and fixed. The block is treated as relative until it crosses a specified threshold, then it becomes fixed.',
						'blockera'
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
			labelText = __('Absolute', 'blockera');
			break;
		case 'fixed':
			labelText = __('Fixed', 'blockera');
			break;
		case 'sticky':
			labelText = __('Sticky', 'blockera');
			break;
		default:
			labelText = __('Relative', 'blockera');
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
							label: __('Default', 'blockera'),
							value: 'static',
							icon: (
								<Icon
									icon="none-circle"
									className="icon-soft-color"
								/>
							),
						},
						{
							label: __('Relative', 'blockera'),
							value: 'relative',
							icon: <Icon icon="position-relative" />,
						},
						{
							label: __('Absolute', 'blockera'),
							value: 'absolute',
							icon: <Icon icon="position-absolute" />,
						},
						{
							label: __('Fixed', 'blockera'),
							value: 'fixed',
							icon: <Icon icon="position-fixed" />,
						},
						{
							label: __('Sticky', 'blockera'),
							value: 'sticky',
							icon: <Icon icon="position-sticky" />,
						},
					]}
					type="custom"
					aria-label={__('Choose Position', 'blockera')}
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
													'blockera'
												)}
											</p>
											<p>
												{__(
													'This feature is crucial for subtle adjustments or for setting a positioning context for absolutely positioned child blocks.',
													'blockera'
												)}
											</p>
										</>
									)}
									{value.type === 'absolute' && (
										<>
											<p>
												{__(
													'Position Absolute allows for precise block placement relative to the nearest positioned ancestor, enabling pixel-perfect layout control.',
													'blockera'
												)}
											</p>
											<p>
												{__(
													'Ideal for creating fixed blocks in dynamic layouts, this feature offers unparalleled control for overlaying and aligning content accurately.',
													'blockera'
												)}
											</p>
										</>
									)}
									{value.type === 'fixed' && (
										<>
											<p>
												{__(
													'Position Fixed anchors block to a specific spot on the page, regardless of scrolling, ensuring constant visibility and placement.',
													'blockera'
												)}
											</p>
											<p>
												{__(
													'Ideal for persistent navigation menus, back to top buttons or call-to-action buttons, it enhances user experience by keeping important blocks accessible.',
													'blockera'
												)}
											</p>
										</>
									)}
									{value.type === 'sticky' && (
										<>
											<p>
												{__(
													'Position Sticky offers a hybrid approach, keeping blocks static until a specified point, then fixing them as the page scrolls.',
													'blockera'
												)}
											</p>
											<p>
												{__(
													'This feature is great for headers or important information, as it ensures visibility without disrupting the natural flow of the page.',
													'blockera'
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
										'blockera'
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
									<Icon icon="position-absolute-top-left" />
								</Button>
								<Button
									label={__(
										'Fix At Top Right Corner',
										'blockera'
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
									<Icon icon="position-absolute-top-right" />
								</Button>
								<Button
									label={__(
										'Fix At Bottom Left Corner',
										'blockera'
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
									<Icon icon="position-absolute-bottom-left" />
								</Button>

								<Button
									label={__(
										'Fix At Bottom Right Corner',
										'blockera'
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
									<Icon icon="position-absolute-bottom-right" />
								</Button>
							</Grid>

							<Grid
								gridTemplateColumns="repeat(2, 1fr)"
								gap="10px"
							>
								<Button
									label={__(
										'Position As Full-Width At Top Side',
										'blockera'
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
									<Icon icon="position-absolute-top" />
								</Button>
								<Button
									label={__(
										'Position As Full-Height At Right Side',
										'blockera'
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
									<Icon icon="position-absolute-right" />
								</Button>
								<Button
									label={__(
										'Position As Full-Width At Bottom Side',
										'blockera'
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
									<Icon icon="position-absolute-bottom" />
								</Button>
								<Button
									label={__(
										'Position As Full-Height At Left Side',
										'blockera'
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
									<Icon icon="position-absolute-left" />
								</Button>
							</Grid>

							<Grid gridTemplateColumns="1fr" gap="10px">
								<Button
									label={__(
										'Position As Full-Width and Full-Height',
										'blockera'
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
									<Icon icon="position-absolute-full" />
								</Button>
								<Button
									label={__(
										'Position Centrally With Equal Margins (20%) From All Edges',
										'blockera'
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
									<Icon icon="position-absolute-center" />
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
									label={__('Stick To Top', 'blockera')}
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
									<Icon icon="position-absolute-top" />
								</Button>
								<Button
									label={__('Stick To Bottom', 'blockera')}
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
									<Icon icon="position-absolute-bottom" />
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
								'blockera'
							)}
						</p>

						<Flex
							direction="column"
							gap="10px"
							alignItems="flex-start"
						>
							<Button
								label={__('Stick To Top', 'blockera')}
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
								<Icon icon="position-absolute-top" />
								{__('Stick To Top', 'blockera')}
							</Button>

							<Button
								label={__('Stick To Bottom', 'blockera')}
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
								<Icon icon="position-absolute-bottom" />
								{__('Stick To Bottom', 'blockera')}
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
