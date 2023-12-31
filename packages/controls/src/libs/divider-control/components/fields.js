// @flow
/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { memo, useContext, useState } from '@wordpress/element';

/**
 * External dependencies
 */
import type { Element } from 'react';

/**
 * Publisher dependencies
 */
import { Flex, Popover, Button } from '@publisher/components';
import { controlInnerClassNames } from '@publisher/classnames';

/**
 * Internal dependencies
 */
import { RepeaterContext } from '../../repeater-control/context';
import SearchIcon from '../icons/search';
import {
	ColorControl,
	InputControl,
	ToggleSelectControl,
	BaseControl,
	ToggleControl,
	NoticeControl,
} from '../../index';
import { shapeIcons, selectedShape } from '../utils';
import { Shape } from './shape';

import { useControlContext } from '../../../context';
import type { TFieldItem } from '../types';

const Fields: TFieldItem = memo<TFieldItem>(
	({ itemId, item }: TFieldItem): Element<any> => {
		const {
			controlInfo: { name: controlId },
			dispatch: { changeRepeaterItem },
			blockName,
		} = useControlContext();

		const {
			repeaterId,
			getControlId,
			repeaterItems: items,
		} = useContext(RepeaterContext);

		const [isSelectShapeOpen, setIsSelectShapeOpen] = useState(false);

		const isPositionDisabled = (
			id: number,
			items: Array<Object>,
			value: string
		) => {
			if (items.length < 2) return false;
			if (id === 0 && items[1]?.position === value) return true;
			if (id === 1 && items[0]?.position === value) return true;
			return false;
		};

		return (
			<div
				id={`repeater-item-${itemId}`}
				className={controlInnerClassNames('divider-popover')}
			>
				<ToggleSelectControl
					id={getControlId(itemId, 'position')}
					label={__('Position', 'publisher-core')}
					labelPopoverTitle={__('Divider Position', 'publisher-core')}
					labelDescription={
						<>
							<p>
								{__(
									'Block Divider Positions refer to placing decorative dividers at the top or bottom of content sections on a webpage.',
									'publisher-core'
								)}
							</p>
						</>
					}
					columns="columns-2"
					defaultValue={item.position}
					options={[
						{
							label: __('Top', 'publisher-core'),
							value: 'top',
							disabled: isPositionDisabled(itemId, items, 'top'),
							showTooltip: true,
							'aria-label': isPositionDisabled(
								itemId,
								items,
								'top'
							)
								? __(
										'You can only add one top divider',
										'publisher-core'
								  )
								: __('Top', 'publisher-core'),
						},
						{
							label: __('Bottom', 'publisher-core'),
							value: 'bottom',
							disabled: isPositionDisabled(
								itemId,
								items,
								'bottom'
							),
							showTooltip: true,
							'aria-label': isPositionDisabled(
								itemId,
								items,
								'bottom'
							)
								? __(
										'You can only add one bottom divider',
										'publisher-core'
								  )
								: __('Bottom', 'publisher-core'),
						},
					]}
					onChange={(position) =>
						changeRepeaterItem({
							controlId,
							repeaterId,
							itemId,
							value: { ...item, position },
						})
					}
				/>

				<BaseControl
					columns="columns-2"
					label={__('Shape', 'publisher-core')}
					labelPopoverTitle={__('Divider Shape', 'publisher-core')}
					labelDescription={
						<>
							<p>
								{__(
									"It's collection of pre-designed divider shapes that can be easily inserted into web pages.",
									'publisher-core'
								)}
							</p>
							<p>
								{__(
									'Additionally, an option to upload custom divider shapes allows for personalized and brand-specific designs.',
									'publisher-core'
								)}
							</p>
						</>
					}
					id={getControlId(itemId, 'shape')}
					attribute={'shape'}
					singularId={'shape'}
					mode="advanced"
					path={'shape'}
					blockName={blockName}
					value={item.shape}
					defaultValue={item.shape}
					repeaterItem={itemId}
				>
					<Button
						size="input"
						className={controlInnerClassNames(
							'shape-button',
							isSelectShapeOpen && 'is-focus'
						)}
						onClick={() => setIsSelectShapeOpen(true)}
						data-test="divider-shape-button"
					>
						<span
							className={`shape-icon ${
								item.position === 'bottom' ? 'bottom' : ''
							}`}
							style={{
								fill: item.color !== '#ffffff' && item?.color,
							}}
						>
							{selectedShape(item.shape.id).icon}
						</span>

						<span className="search-icon">
							<SearchIcon />
						</span>
					</Button>

					{isSelectShapeOpen && (
						<Popover
							title="Choose Divider Shape"
							className={controlInnerClassNames(
								'divider-shape-popover'
							)}
							onClose={() => setIsSelectShapeOpen(false)}
							data-test="divider-shape-popover"
						>
							<ToggleSelectControl
								id={getControlId(itemId, 'shape.type')}
								label={__('Type', 'publisher-core')}
								labelPopoverTitle={__(
									'Divider Shape Type',
									'publisher-core'
								)}
								labelDescription={
									<>
										<p>
											{__(
												"It's collection of pre-designed divider shapes that can be easily inserted into web pages.",
												'publisher-core'
											)}
										</p>
										<p>
											{__(
												'Additionally, an option to upload custom divider shapes allows for personalized and brand-specific designs.',
												'publisher-core'
											)}
										</p>
									</>
								}
								columns="columns-2"
								defaultValue={item.position}
								options={[
									{
										label: __('Library', 'publisher-core'),
										value: 'shape',
									},
									{
										label: __('Custom', 'publisher-core'),
										value: 'custom',
										disabled: true,
										showTooltip: true,
										'aria-label': __(
											'Coming soon …',
											'publisher-core'
										),
									},
								]}
								onChange={(type) =>
									changeRepeaterItem({
										controlId,
										repeaterId,
										itemId,
										value: {
											...item,
											shape: { ...item.shape, type },
										},
									})
								}
							/>

							<BaseControl
								columns={'columns-1'}
								label={__('Shapes', 'publisher-core')}
								className="shapes"
							>
								{shapeIcons.map((shape) => (
									<Shape
										id={shape.id}
										key={shape.id}
										icon={shape.icon}
										isBottom={item.position === 'bottom'}
										selected={shape.id === item.shape.id}
										onClick={(id) => {
											changeRepeaterItem({
												controlId,
												repeaterId,
												itemId,
												value: {
													...item,
													shape: {
														...item.shape,
														id,
													},
												},
											});
											setIsSelectShapeOpen(false);
										}}
									/>
								))}
							</BaseControl>
						</Popover>
					)}
				</BaseControl>

				<ColorControl
					id={getControlId(itemId, 'color')}
					columns="columns-2"
					label={__('Color', 'publisher-core')}
					labelPopoverTitle={__('Divider Color', 'publisher-core')}
					labelDescription={
						<>
							<p>
								{__(
									'It the color of shape used as divider between content blocks.',
									'publisher-core'
								)}
							</p>
						</>
					}
					defaultValue={item.color}
					onChange={(color) =>
						changeRepeaterItem({
							controlId,
							repeaterId,
							itemId,
							value: { ...item, color },
						})
					}
				/>

				<BaseControl columns="columns-1">
					<BaseControl
						columns="columns-2"
						label={__('Size', 'publisher-core')}
					>
						<Flex alignItems="flex-start">
							<InputControl
								id={getControlId(itemId, 'size.width')}
								columns="columns-1"
								label={__('Width', 'publisher-core')}
								labelPopoverTitle={__(
									'Divider Width',
									'publisher-core'
								)}
								labelDescription={
									<>
										<p>
											{__(
												'It refers to the horizontal thickness of divider used to separate content sections.',
												'publisher-core'
											)}
										</p>
										<p>
											{__(
												'Typically, a full-width (100%) divider is recommended for clear and consistent separation.',
												'publisher-core'
											)}
										</p>
									</>
								}
								className="control-first label-center small-gap"
								style={{ margin: '0px' }}
								placeholder="0"
								type="number"
								min={0}
								defaultValue={item.size.width}
								unitType="width"
								size={'small'}
								data-test="divider-width-input"
								onChange={(width) =>
									changeRepeaterItem({
										controlId,
										repeaterId,
										itemId,
										value: {
											...item,
											size: { ...item.size, width },
										},
									})
								}
							/>

							<InputControl
								id={getControlId(itemId, 'size.height')}
								columns="columns-1"
								label={__('Height', 'publisher-core')}
								labelPopoverTitle={__(
									'Divider Height',
									'publisher-core'
								)}
								labelDescription={
									<>
										<p>
											{__(
												'It refers to the vertical thickness of divider used to separate content sections.',
												'publisher-core'
											)}
										</p>
										<p>
											{__(
												'A thinner height is often used for a minimalistic look, while a greater height can serve as a bold statement piece or even a functional space for additional content or design elements.',
												'publisher-core'
											)}
										</p>
									</>
								}
								className="control-first label-center small-gap"
								style={{ margin: '0px' }}
								placeholder="0"
								type="number"
								min={0}
								defaultValue={item.size.height}
								unitType="height"
								size={'small'}
								data-test="divider-height-input"
								onChange={(height) =>
									changeRepeaterItem({
										controlId,
										repeaterId,
										itemId,
										value: {
											...item,
											size: { ...item.size, height },
										},
									})
								}
							/>
						</Flex>
					</BaseControl>
					{(!item.size.width || !item.size.height) && (
						<NoticeControl type="error">
							{item.size.height &&
								!item.size.width &&
								__(
									'Width is required; please provide a value. 100% is recommended.',
									'publisher-core'
								)}
							{item.size.width &&
								!item.size.height &&
								__(
									'Width is required; please provide a value.',
									'publisher-core'
								)}
							{!item.size.width &&
								!item.size.height &&
								__(
									'Width and height are required; please provide values.',
									'publisher-core'
								)}
						</NoticeControl>
					)}
				</BaseControl>

				<ToggleControl
					id={getControlId(itemId, 'animate')}
					defaultValue={item.animate}
					columns="columns-2"
					label={__('Animation', 'publisher-core')}
					labelPopoverTitle={__(
						'Divider Animation',
						'publisher-core'
					)}
					labelDescription={
						<>
							<p>
								{__(
									'It adds dynamic visual effects to divider to draw attention to specific sections.',
									'publisher-core'
								)}
							</p>
						</>
					}
					className={controlInnerClassNames('toggle-field')}
					onChange={(animate) =>
						changeRepeaterItem({
							controlId,
							repeaterId,
							itemId,
							value: {
								...item,
								animate,
							},
						})
					}
				>
					{item.animate && (
						<InputControl
							id={getControlId(itemId, 'duration')}
							label={__('Duration', 'publisher-core')}
							labelPopoverTitle={__(
								'Divider Animation Duration',
								'publisher-core'
							)}
							labelDescription={
								<>
									<p>
										{__(
											'It sets the length of time it takes for an animation to complete on a divider.',
											'publisher-core'
										)}
									</p>
									<p>
										{__(
											'A faster animation can create a snappy, responsive feel, while a slower animation can impart a sense of elegance and smoothness.',
											'publisher-core'
										)}
									</p>
								</>
							}
							columns="1fr 1.4fr"
							placeholder="0"
							type="number"
							min={0}
							defaultValue={item.duration}
							unitType="duration"
							size="small"
							data-test="divider-duration-input"
							onChange={(duration) =>
								changeRepeaterItem({
									controlId,
									repeaterId,
									itemId,
									value: {
										...item,
										duration,
									},
								})
							}
						/>
					)}
				</ToggleControl>

				<ToggleControl
					columns="columns-2"
					label={__('Flip', 'publisher-core')}
					labelPopoverTitle={__('Horizontal Flip', 'publisher-core')}
					labelDescription={
						<>
							<p>
								{__(
									'It allows a horizontal inversion or mirroring of divider.',
									'publisher-core'
								)}
							</p>
							<p>
								{__(
									'A faster animation can create a snappy, responsive feel, while a slower animation can impart a sense of elegance and smoothness.',
									'publisher-core'
								)}
							</p>
						</>
					}
					className={controlInnerClassNames('toggle-field')}
					id={getControlId(itemId, 'flip')}
					defaultValue={item.flip}
					onChange={(flip) =>
						changeRepeaterItem({
							controlId,
							repeaterId,
							itemId,
							value: {
								...item,
								flip,
							},
						})
					}
				/>

				<ToggleControl
					id={getControlId(itemId, 'onFront')}
					columns="columns-2"
					label={__('On Front', 'publisher-core')}
					labelPopoverTitle={__('Bring On Front', 'publisher-core')}
					labelDescription={
						<>
							<p>
								{__(
									'It sets a high z-index value on the block divider, which brings it to the forefront, layered above all other block contents.',
									'publisher-core'
								)}
							</p>
						</>
					}
					className={controlInnerClassNames('toggle-field')}
					defaultValue={item.onFront}
					onChange={(onFront) =>
						changeRepeaterItem({
							controlId,
							repeaterId,
							itemId,
							value: {
								...item,
								onFront,
							},
						})
					}
				/>
			</div>
		);
	}
);
export default Fields;
