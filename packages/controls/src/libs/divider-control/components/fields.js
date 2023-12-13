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
import { Flex, Popover } from '@publisher/components';
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

		const { repeaterId, getControlId } = useContext(RepeaterContext);
		const [isSelectShapeOpen, setIsSelectShapeOpen] = useState(false);

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
						},
						{
							label: __('Bottom', 'publisher-core'),
							value: 'bottom',
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
					>
						<span
							className={`shape-icon ${
								item.position === 'bottom' ? 'bottom' : ''
							}`}
							style={{ fill: item?.color }}
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
										bottom={item.position === 'bottom'}
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

				<BaseControl
					columns="columns-2"
					label={__('Animate', 'publisher-core')}
					className={controlInnerClassNames('toggle-field')}
				>
					<ToggleControl
						id={getControlId(itemId, 'animate')}
						defaultValue={item.animate}
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
