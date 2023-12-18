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
import { Flex, Popover, ConditionalWrapper } from '@publisher/components';
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
		} = useControlContext();

		const {
			repeaterId,
			getControlId,
			repeaterItems: items,
		} = useContext(RepeaterContext);

		const [isSelectShapeOpen, setIsSelectShapeOpen] = useState(false);

		const isPositionDisabled = (
			id: string,
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
				>
					<div
						className={controlInnerClassNames('shape-button')}
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
					</div>

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
								columns="columns-2"
								defaultValue={item.position}
								options={[
									{
										label: __('Shape', 'publisher-core'),
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
										onClick={(id) =>
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
											})
										}
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
					defaultValue={item.color}
					onChange={(color) =>
						changeRepeaterItem({
							controlId,
							repeaterId,
							itemId,
							value: { ...item, color },
						})
					}
				></ColorControl>

				<ConditionalWrapper
					condition={!item.size.width || !item.size.height}
					wrapper={(children) => (
						<BaseControl columns="columns-1">
							{children}
						</BaseControl>
					)}
				>
					<BaseControl
						columns="columns-2"
						label={__('Size', 'publisher-core')}
					>
						<Flex alignItems="flex-start">
							<InputControl
								id={getControlId(itemId, 'size.width')}
								columns="columns-1"
								label={__('Width', 'publisher-core')}
								className="control-first label-center small-gap"
								style={{ margin: '0px' }}
								placeholder="0"
								type="number"
								min={0}
								defaultValue={item.size.width}
								unitType="width"
								smallWidth={true}
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
								className="control-first label-center small-gap"
								style={{ margin: '0px' }}
								placeholder="0"
								type="number"
								min={0}
								defaultValue={item.size.height}
								unitType="height"
								smallWidth={true}
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
								__('You must add width', 'publisher-core')}
							{item.size.width &&
								!item.size.height &&
								__('You must add height', 'publisher-core')}
							{!item.size.width &&
								!item.size.height &&
								__(
									'You must add width and height',
									'publisher-core'
								)}
						</NoticeControl>
					)}
				</ConditionalWrapper>

				<BaseControl
					columns="columns-2"
					label={__('Animate', 'publisher-core')}
					className={controlInnerClassNames('toggle-field')}
				>
					<ToggleControl
						id={getControlId(itemId, 'animate')}
						defaultValue={item.animate}
						value={item.animate}
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
					/>
					{item.animate && (
						<InputControl
							id={getControlId(itemId, 'duration')}
							label={__('Duration', 'publisher-core')}
							columns="1fr 1.4fr"
							placeholder="0"
							type="number"
							min={0}
							defaultValue={item.duration}
							unitType="duration"
							smallWidth={true}
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
				</BaseControl>

				<BaseControl
					columns="columns-2"
					label={__('Flip', 'publisher-core')}
					className={controlInnerClassNames('toggle-field')}
				>
					<ToggleControl
						id={getControlId(itemId, 'flip')}
						defaultValue={item.flip}
						value={item.flip}
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
				</BaseControl>

				<BaseControl
					columns="columns-2"
					label={__('On Front', 'publisher-core')}
					className={controlInnerClassNames('toggle-field')}
				>
					<ToggleControl
						id={getControlId(itemId, 'onFront')}
						defaultValue={item.onFront}
						value={item.onFront}
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
				</BaseControl>
			</div>
		);
	}
);
export default Fields;
