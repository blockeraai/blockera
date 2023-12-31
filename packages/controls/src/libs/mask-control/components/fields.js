// @flow
/**
 * WordPress dependencies
 */

/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import { memo, useContext, useState } from '@wordpress/element';
import type { Element } from 'react';

/**
 * Publisher dependencies
 */
import { Popover, Flex, Button } from '@publisher/components';
import { controlInnerClassNames } from '@publisher/classnames';

/**
 * Internal dependencies
 */
import { RepeaterContext } from '../../repeater-control/context';
import { useControlContext } from '../../../context';
import {
	ToggleSelectControl,
	BaseControl,
	ToggleControl,
	InputControl,
} from '../../index';
import type { TFieldItem } from '../types';
import SearchIcon from '../icons/search';
import { maskShapeIcons, selectedShape } from '../utils';
import { Shape } from './shape';
import RepeatIcon from '../../background-control/icons/repeat';
import RepeatXIcon from '../../background-control/icons/repeat-x';
import RepeatYIcon from '../../background-control/icons/repeat-y';
import RepeatNoIcon from '../../background-control/icons/repeat-no';
import FitCoverIcon from '../icons/fit-cover';
import FitContainIcon from '../icons/fit-contain';
import FitNormalIcon from '../icons/fit-normal';
import PositionButtonControl from '../../position-button';

const Fields: TFieldItem = memo<TFieldItem>(
	({ itemId, item }: TFieldItem): Element<any> => {
		const {
			controlInfo: { name: controlId, blockName },
			dispatch: { changeRepeaterItem },
		} = useControlContext();

		const { repeaterId, getControlId } = useContext(RepeaterContext);
		const [isSelectShapeOpen, setIsSelectShapeOpen] = useState(false);

		return (
			<div
				id={`repeater-item-${itemId}`}
				className={controlInnerClassNames('mask-popover')}
			>
				<BaseControl
					columns="columns-2"
					label={__('Shape', 'publisher-core')}
					labelPopoverTitle={__('Mask Shape', 'publisher-core')}
					labelDescription={
						<>
							<p>
								{__(
									'It allows you to apply a mask over the block content using an image.',
									'publisher-core'
								)}
							</p>
							<p>
								{__(
									'The mask can be chosen from a pre-existing library or uploaded as a custom image.',
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
							isSelectShapeOpen ? 'is-focus' : ''
						)}
						onClick={() => setIsSelectShapeOpen(true)}
						data-test="mask-shape-button"
					>
						<span
							className={controlInnerClassNames(
								'shape-icon',
								item['horizontally-flip'] ? 'h-flip' : '',
								item['vertically-flip'] ? 'v-flip' : ''
							)}
						>
							{selectedShape(item.shape.id)?.icon}
						</span>
						<span className={controlInnerClassNames('shape-title')}>
							{selectedShape(item.shape.id)?.id}
						</span>

						<span className={controlInnerClassNames('search-icon')}>
							<SearchIcon />
						</span>
					</Button>

					{isSelectShapeOpen && (
						<Popover
							title="Choose Mask Shape"
							className={controlInnerClassNames(
								'mask-shape-popover'
							)}
							onClose={() => setIsSelectShapeOpen(false)}
							data-test="mask-shape-popover"
						>
							<ToggleSelectControl
								id={getControlId(itemId, 'shape.type')}
								label={__('Type', 'publisher-core')}
								columns="columns-2"
								defaultValue={item.shape.type || 'shape'}
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

							{item.shape.type === 'shape' && (
								<BaseControl
									columns={'columns-1'}
									label={__('Shapes', 'publisher-core')}
									className="shapes"
								>
									<div className="shapes-field">
										{maskShapeIcons.map((shape) => (
											<Shape
												key={shape.id}
												id={shape.id}
												icon={shape.icon}
												selected={
													item.shape.id === shape.id
												}
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
									</div>
								</BaseControl>
							)}
						</Popover>
					)}
				</BaseControl>

				<ToggleSelectControl
					id={getControlId(itemId, 'size')}
					label={__('Size', 'publisher-core')}
					labelPopoverTitle={__('Mask Size', 'publisher-core')}
					labelDescription={
						<>
							<p>
								{__(
									'It specifies the size of a mask image applied to block.',
									'publisher-core'
								)}
							</p>
							<p>
								{__(
									'Ensure that the mask size works well on different screen sizes and does not distort the mask image or the content.',
									'publisher-core'
								)}
							</p>
						</>
					}
					columns="columns-2"
					options={[
						{
							label: __('Custom', 'publisher-core'),
							value: 'custom',
							icon: <FitNormalIcon />,
						},
						{
							label: __('Cover', 'publisher-core'),
							value: 'cover',
							icon: <FitCoverIcon />,
						},
						{
							label: __('Contain', 'publisher-core'),
							value: 'contain',
							icon: <FitContainIcon />,
						},
					]}
					defaultValue={item.size}
					onChange={(size) =>
						changeRepeaterItem({
							controlId,
							repeaterId,
							itemId,
							value: {
								...item,
								size,
							},
						})
					}
				>
					{item.size === 'custom' && (
						<Flex
							direction="row"
							gap="8px"
							justifyContent="space-around"
						>
							<InputControl
								label={__('Width', 'publisher-core')}
								labelPopoverTitle={__(
									'Mask Width',
									'publisher-core'
								)}
								labelDescription={
									<>
										<p>
											{__(
												'It specifies the horizontal size of a mask image applied to block.',
												'publisher-core'
											)}
										</p>
									</>
								}
								columns="columns-1"
								className="control-first label-center small-gap"
								unitType="width"
								placeholder="Auto"
								defaultValue={item['size-width']}
								id={getControlId(itemId, 'size-width')}
								onChange={(width) =>
									changeRepeaterItem({
										controlId,
										repeaterId,
										itemId,
										value: {
											...item,
											'size-width': width,
										},
									})
								}
								size="small"
								controlAddonTypes={['variable']}
								variableTypes={['width-size']}
							/>

							<InputControl
								label={__('Height', 'publisher-core')}
								labelPopoverTitle={__(
									'Mask Height',
									'publisher-core'
								)}
								labelDescription={
									<>
										<p>
											{__(
												'It specifies the vertical size of a mask image applied to block.',
												'publisher-core'
											)}
										</p>
									</>
								}
								columns="columns-1"
								className="control-first label-center small-gap"
								unitType="height"
								placeholder="Auto"
								defaultValue={item['size-height']}
								id={getControlId(itemId, 'size-height')}
								onChange={(height) =>
									changeRepeaterItem({
										controlId,
										repeaterId,
										itemId,
										value: {
											...item,
											'size-height': height,
										},
									})
								}
								size="small"
								controlAddonTypes={['variable']}
								variableTypes={['width-size']}
							/>
						</Flex>
					)}
				</ToggleSelectControl>

				<ToggleSelectControl
					id={getControlId(itemId, 'repeat')}
					label={__('Repeat', 'publisher-core')}
					labelPopoverTitle={__('Mask Repeat', 'publisher-core')}
					labelDescription={
						<>
							<p>
								{__(
									'It specifies how a mask image is repeated over block.',
									'publisher-core'
								)}
							</p>
						</>
					}
					columns="columns-2"
					options={[
						{
							label: __(
								'Horizontally and Vertically',
								'publisher-core'
							),
							value: 'repeat',
							icon: <RepeatIcon />,
						},
						{
							label: __('Horizontally', 'publisher-core'),
							value: 'repeat-x',
							icon: <RepeatXIcon />,
						},
						{
							label: __('Vertically', 'publisher-core'),
							value: 'repeat-y',
							icon: <RepeatYIcon />,
						},
						{
							label: __("Don't Tile", 'publisher-core'),
							value: 'no-repeat',
							icon: <RepeatNoIcon />,
						},
					]}
					defaultValue={item.repeat || 'no-repeat'}
					onChange={(repeat) =>
						changeRepeaterItem({
							controlId,
							repeaterId,
							itemId,
							value: { ...item, repeat },
						})
					}
				/>

				<PositionButtonControl
					id={getControlId(itemId, 'position')}
					label={__('Position', 'publisher-core')}
					labelPopoverTitle={__(
						'Mask Repeat Position',
						'publisher-core'
					)}
					labelDescription={
						<>
							<p>
								{__(
									'It sets where the mask image is placed, allowing for precise alignment of the mask in relation to the content it overlays.',
									'publisher-core'
								)}
							</p>
						</>
					}
					columns="columns-2"
					onChange={(position) => {
						changeRepeaterItem({
							controlId,
							repeaterId,
							itemId,
							value: { ...item, position },
						});
					}}
					defaultValue={item.position}
				/>

				<BaseControl
					label={__('Flip', 'publisher-core')}
					columns="columns-2"
					className="mask-control-flip"
				>
					<ToggleControl
						id={getControlId(itemId, 'horizontally-flip')}
						className="flip-toggle"
						columns="columns-2"
						label={__('Horizontally', 'publisher-core')}
						labelPopoverTitle={__(
							'Flip Horizontally',
							'publisher-core'
						)}
						labelDescription={
							<>
								<p>
									{__(
										'It allows the horizontal mirroring of the mask image.',
										'publisher-core'
									)}
								</p>
							</>
						}
						defaultValue={item['horizontally-flip']}
						onChange={(hFlip) =>
							changeRepeaterItem({
								controlId,
								repeaterId,
								itemId,
								value: {
									...item,
									'horizontally-flip': hFlip,
								},
							})
						}
					/>

					<ToggleControl
						id={getControlId(itemId, 'vertically-flip')}
						className="flip-toggle"
						label={__('Vertically', 'publisher-core')}
						labelPopoverTitle={__(
							'Flip Vertically',
							'publisher-core'
						)}
						labelDescription={
							<>
								<p>
									{__(
										'It allows the vertical mirroring of the mask image.',
										'publisher-core'
									)}
								</p>
							</>
						}
						columns="columns-2"
						defaultValue={item['vertically-flip']}
						onChange={(vFlip) =>
							changeRepeaterItem({
								controlId,
								repeaterId,
								itemId,
								value: {
									...item,
									'vertically-flip': vFlip,
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
