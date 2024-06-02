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
 * Blockera dependencies
 */
import { Flex, Popover, Button } from '@blockera/components';
import { controlInnerClassNames } from '@blockera/classnames';

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
			controlInfo: { name: controlId, attribute },
			dispatch: { changeRepeaterItem },
			blockName,
			getControlPath,
		} = useControlContext();

		const {
			onChange,
			valueCleanup,
			repeaterId,
			getControlId,
			repeaterItems: items,
			defaultRepeaterItemValue,
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
					repeaterItem={itemId}
					id={getControlId(itemId, 'position')}
					singularId={'position'}
					label={__('Position', 'blockera')}
					labelPopoverTitle={__('Divider Position', 'blockera')}
					labelDescription={
						<>
							<p>
								{__(
									'Block Divider Positions refer to placing decorative dividers at the top or bottom of content sections on a webpage.',
									'blockera'
								)}
							</p>
						</>
					}
					columns="columns-2"
					options={[
						{
							label: __('Top', 'blockera'),
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
										'blockera'
								  )
								: __('Top', 'blockera'),
						},
						{
							label: __('Bottom', 'blockera'),
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
										'blockera'
								  )
								: __('Bottom', 'blockera'),
						},
					]}
					onChange={(position, ref) =>
						changeRepeaterItem({
							ref,
							controlId,
							repeaterId,
							itemId,
							onChange,
							valueCleanup,
							value: { ...item, position },
						})
					}
					defaultValue={defaultRepeaterItemValue.position}
				/>

				<BaseControl
					repeaterItem={itemId}
					id={getControlId(itemId, 'shape')}
					singularId={'shape'}
					columns="columns-2"
					label={__('Shape', 'blockera')}
					labelPopoverTitle={__('Divider Shape', 'blockera')}
					labelDescription={
						<>
							<p>
								{__(
									"It's collection of pre-designed divider shapes that can be easily inserted into web pages.",
									'blockera'
								)}
							</p>
							<p>
								{__(
									'Additionally, an option to upload custom divider shapes allows for personalized and brand-specific designs.',
									'blockera'
								)}
							</p>
						</>
					}
					mode="advanced"
					path={getControlPath(
						attribute + '[' + itemId + ']',
						'shape'
					)}
					attribute={attribute}
					blockName={blockName}
					value={item.shape}
					defaultValue={defaultRepeaterItemValue.shape}
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
							<BaseControl
								columns={'columns-1'}
								label={__('Shapes', 'blockera')}
								className="shapes"
							>
								<Flex direction={'column'} gap={'12px'}>
									{shapeIcons.map((shape) => (
										<Shape
											id={shape.id}
											key={shape.id}
											icon={shape.icon}
											isBottom={
												item.position === 'bottom'
											}
											selected={
												shape.id === item.shape.id
											}
											onClick={(id) => {
												changeRepeaterItem({
													controlId,
													repeaterId,
													itemId,
													onChange,
													valueCleanup,
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
								</Flex>
							</BaseControl>
						</Popover>
					)}
				</BaseControl>

				<ColorControl
					repeaterItem={itemId}
					id={getControlId(itemId, 'color')}
					singularId={'color'}
					columns="columns-2"
					label={__('Color', 'blockera')}
					labelPopoverTitle={__('Divider Color', 'blockera')}
					labelDescription={
						<>
							<p>
								{__(
									'It the color of shape used as divider between content blocks.',
									'blockera'
								)}
							</p>
						</>
					}
					onChange={(color, ref) =>
						changeRepeaterItem({
							ref,
							controlId,
							repeaterId,
							itemId,
							onChange,
							valueCleanup,
							value: { ...item, color },
						})
					}
					defaultValue={defaultRepeaterItemValue.color}
				/>

				<BaseControl columns="columns-1">
					<BaseControl
						columns="columns-2"
						label={__('Size', 'blockera')}
					>
						<Flex alignItems="flex-start">
							<InputControl
								repeaterItem={itemId}
								id={getControlId(itemId, 'size.width')}
								singularId={'size.width'}
								columns="columns-1"
								label={__('Width', 'blockera')}
								labelPopoverTitle={__(
									'Divider Width',
									'blockera'
								)}
								labelDescription={
									<>
										<p>
											{__(
												'It refers to the horizontal thickness of divider used to separate content sections.',
												'blockera'
											)}
										</p>
										<p>
											{__(
												'Typically, a full-width (100%) divider is recommended for clear and consistent separation.',
												'blockera'
											)}
										</p>
									</>
								}
								className="control-first label-center small-gap"
								style={{ margin: '0px' }}
								placeholder="0"
								type="number"
								min={0}
								unitType="width"
								size={'small'}
								data-test="divider-width-input"
								onChange={(width, ref) =>
									changeRepeaterItem({
										ref,
										controlId,
										repeaterId,
										itemId,
										onChange,
										valueCleanup,
										value: {
											...item,
											size: { ...item.size, width },
										},
									})
								}
								defaultValue={
									defaultRepeaterItemValue.size.width
								}
							/>

							<InputControl
								repeaterItem={itemId}
								id={getControlId(itemId, 'size.height')}
								singularId={'size.height'}
								columns="columns-1"
								label={__('Height', 'blockera')}
								labelPopoverTitle={__(
									'Divider Height',
									'blockera'
								)}
								labelDescription={
									<>
										<p>
											{__(
												'It refers to the vertical thickness of divider used to separate content sections.',
												'blockera'
											)}
										</p>
										<p>
											{__(
												'A thinner height is often used for a minimalistic look, while a greater height can serve as a bold statement piece or even a functional space for additional content or design elements.',
												'blockera'
											)}
										</p>
									</>
								}
								className="control-first label-center small-gap"
								style={{ margin: '0px' }}
								placeholder="0"
								type="number"
								min={0}
								unitType="height"
								size={'small'}
								data-test="divider-height-input"
								onChange={(height, ref) =>
									changeRepeaterItem({
										ref,
										controlId,
										repeaterId,
										itemId,
										onChange,
										valueCleanup,
										value: {
											...item,
											size: { ...item.size, height },
										},
									})
								}
								defaultValue={
									defaultRepeaterItemValue.size.height
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
									'blockera'
								)}
							{item.size.width &&
								!item.size.height &&
								__(
									'Width is required; please provide a value.',
									'blockera'
								)}
							{!item.size.width &&
								!item.size.height &&
								__(
									'Width and height are required; please provide values.',
									'blockera'
								)}
						</NoticeControl>
					)}
				</BaseControl>

				<ToggleControl
					repeaterItem={itemId}
					id={getControlId(itemId, 'animate')}
					singularId={'animate'}
					columns="columns-2"
					label={__('Animation', 'blockera')}
					labelPopoverTitle={__('Divider Animation', 'blockera')}
					labelDescription={
						<>
							<p>
								{__(
									'It adds dynamic visual effects to divider to draw attention to specific sections.',
									'blockera'
								)}
							</p>
						</>
					}
					className={controlInnerClassNames('toggle-field')}
					onChange={(animate, ref) =>
						changeRepeaterItem({
							ref,
							controlId,
							repeaterId,
							itemId,
							onChange,
							valueCleanup,
							value: {
								...item,
								animate,
							},
						})
					}
					defaultValue={defaultRepeaterItemValue.animate}
				>
					{item.animate && (
						<InputControl
							repeaterItem={itemId}
							id={getControlId(itemId, 'duration')}
							singularId={'duration'}
							label={__('Duration', 'blockera')}
							labelPopoverTitle={__(
								'Divider Animation Duration',
								'blockera'
							)}
							labelDescription={
								<>
									<p>
										{__(
											'It sets the length of time it takes for an animation to complete on a divider.',
											'blockera'
										)}
									</p>
									<p>
										{__(
											'A faster animation can create a snappy, responsive feel, while a slower animation can impart a sense of elegance and smoothness.',
											'blockera'
										)}
									</p>
								</>
							}
							columns="1fr 1.4fr"
							placeholder={__('Auto', 'blockera')}
							type="number"
							min={0}
							unitType="duration"
							size="small"
							data-test="divider-duration-input"
							onChange={(duration, ref) =>
								changeRepeaterItem({
									ref,
									controlId,
									repeaterId,
									itemId,
									onChange,
									valueCleanup,
									value: {
										...item,
										duration,
									},
								})
							}
							defaultValue={defaultRepeaterItemValue.duration}
						/>
					)}
				</ToggleControl>

				<ToggleControl
					repeaterItem={itemId}
					id={getControlId(itemId, 'flip')}
					singularId={'flip'}
					columns="columns-2"
					label={__('Flip', 'blockera')}
					labelPopoverTitle={__('Horizontal Flip', 'blockera')}
					labelDescription={
						<>
							<p>
								{__(
									'It allows a horizontal inversion or mirroring of divider.',
									'blockera'
								)}
							</p>
							<p>
								{__(
									'A faster animation can create a snappy, responsive feel, while a slower animation can impart a sense of elegance and smoothness.',
									'blockera'
								)}
							</p>
						</>
					}
					className={controlInnerClassNames('toggle-field')}
					onChange={(flip, ref) =>
						changeRepeaterItem({
							ref,
							controlId,
							repeaterId,
							itemId,
							onChange,
							valueCleanup,
							value: {
								...item,
								flip,
							},
						})
					}
					defaultValue={defaultRepeaterItemValue.flip}
				/>

				<ToggleControl
					repeaterItem={itemId}
					id={getControlId(itemId, 'onFront')}
					singularId={'onFront'}
					columns="columns-2"
					label={__('On Front', 'blockera')}
					labelPopoverTitle={__('Bring On Front', 'blockera')}
					labelDescription={
						<>
							<p>
								{__(
									'It sets a high z-index value on the block divider, which brings it to the forefront, layered above all other block contents.',
									'blockera'
								)}
							</p>
						</>
					}
					className={controlInnerClassNames('toggle-field')}
					defaultValue={defaultRepeaterItemValue.onFront}
					onChange={(onFront, ref) =>
						changeRepeaterItem({
							ref,
							controlId,
							repeaterId,
							itemId,
							onChange,
							valueCleanup,
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
