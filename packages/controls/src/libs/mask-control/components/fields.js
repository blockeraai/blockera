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
 * Blockera dependencies
 */
import { Popover, Flex, Button } from '@blockera/components';
import { controlInnerClassNames } from '@blockera/classnames';

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
			controlInfo: { name: controlId, blockName, attribute },
			dispatch: { changeRepeaterItem },
			getControlPath,
		} = useControlContext();

		const { repeaterId, getControlId, defaultRepeaterItemValue } =
			useContext(RepeaterContext);

		const [isSelectShapeOpen, setIsSelectShapeOpen] = useState(false);

		return (
			<div
				id={`repeater-item-${itemId}`}
				className={controlInnerClassNames('mask-popover')}
			>
				<BaseControl
					columns="columns-2"
					label={__('Shape', 'blockera-core')}
					labelPopoverTitle={__('Mask Shape', 'blockera-core')}
					labelDescription={
						<>
							<p>
								{__(
									'It allows you to apply a mask over the block content using an image.',
									'blockera-core'
								)}
							</p>
							<p>
								{__(
									'The mask can be chosen from a pre-existing library or uploaded as a custom image.',
									'blockera-core'
								)}
							</p>
						</>
					}
					repeaterItem={itemId}
					id={getControlId(itemId, 'shape')}
					singularId={'shape'}
					path={getControlPath(
						attribute + '[' + itemId + ']',
						'shape'
					)}
					attribute={attribute}
					mode="advanced"
					blockName={blockName}
					value={item.shape}
					defaultValue={item.shape}
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
							{item.shape.type === 'shape' && (
								<BaseControl
									columns={'columns-1'}
									label={__('Shapes', 'blockera-core')}
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
					repeaterItem={itemId}
					id={getControlId(itemId, 'size')}
					singularId={'size'}
					label={__('Size', 'blockera-core')}
					labelPopoverTitle={__('Mask Size', 'blockera-core')}
					labelDescription={
						<>
							<p>
								{__(
									'It specifies the size of a mask image applied to block.',
									'blockera-core'
								)}
							</p>
							<p>
								{__(
									'Ensure that the mask size works well on different screen sizes and does not distort the mask image or the content.',
									'blockera-core'
								)}
							</p>
						</>
					}
					columns="columns-2"
					options={[
						{
							label: __('Custom', 'blockera-core'),
							value: 'custom',
							icon: <FitNormalIcon />,
						},
						{
							label: __('Cover', 'blockera-core'),
							value: 'cover',
							icon: <FitCoverIcon />,
						},
						{
							label: __('Contain', 'blockera-core'),
							value: 'contain',
							icon: <FitContainIcon />,
						},
					]}
					defaultValue={defaultRepeaterItemValue.size}
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
							justifyContent="space-between"
						>
							<InputControl
								repeaterItem={itemId}
								id={getControlId(itemId, 'size-width')}
								singularId={'size-width'}
								label={__('Width', 'blockera-core')}
								labelPopoverTitle={__(
									'Mask Width',
									'blockera-core'
								)}
								labelDescription={
									<>
										<p>
											{__(
												'It specifies the horizontal size of a mask image applied to block.',
												'blockera-core'
											)}
										</p>
									</>
								}
								columns="columns-1"
								className="control-first label-center small-gap"
								unitType="width"
								placeholder={__('Auto', 'blockera-core')}
								defaultValue={
									defaultRepeaterItemValue['size-width']
								}
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
								repeaterItem={itemId}
								id={getControlId(itemId, 'size-height')}
								singularId={'size-height'}
								label={__('Height', 'blockera-core')}
								labelPopoverTitle={__(
									'Mask Height',
									'blockera-core'
								)}
								labelDescription={
									<>
										<p>
											{__(
												'It specifies the vertical size of a mask image applied to block.',
												'blockera-core'
											)}
										</p>
									</>
								}
								columns="columns-1"
								className="control-first label-center small-gap"
								unitType="height"
								placeholder={__('Auto', 'blockera-core')}
								defaultValue={
									defaultRepeaterItemValue['size-height']
								}
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
					repeaterItem={itemId}
					id={getControlId(itemId, 'repeat')}
					singularId={'repeat'}
					label={__('Repeat', 'blockera-core')}
					labelPopoverTitle={__('Mask Repeat', 'blockera-core')}
					labelDescription={
						<>
							<p>
								{__(
									'It specifies how a mask image is repeated over block.',
									'blockera-core'
								)}
							</p>
						</>
					}
					columns="columns-2"
					options={[
						{
							label: __(
								'Horizontally and Vertically',
								'blockera-core'
							),
							value: 'repeat',
							icon: <RepeatIcon />,
						},
						{
							label: __('Horizontally', 'blockera-core'),
							value: 'repeat-x',
							icon: <RepeatXIcon />,
						},
						{
							label: __('Vertically', 'blockera-core'),
							value: 'repeat-y',
							icon: <RepeatYIcon />,
						},
						{
							label: __("Don't Tile", 'blockera-core'),
							value: 'no-repeat',
							icon: <RepeatNoIcon />,
						},
					]}
					defaultValue={defaultRepeaterItemValue.repeat}
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
					repeaterItem={itemId}
					id={getControlId(itemId, 'position')}
					singularId={'position'}
					label={__('Position', 'blockera-core')}
					alignmentMatrixLabel={__('Mask Position', 'blockera-core')}
					labelPopoverTitle={__(
						'Mask Repeat Position',
						'blockera-core'
					)}
					labelDescription={
						<>
							<p>
								{__(
									'It sets where the mask image is placed, allowing for precise alignment of the mask in relation to the content it overlays.',
									'blockera-core'
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
					defaultValue={defaultRepeaterItemValue.position}
				/>

				<BaseControl
					label={__('Flip', 'blockera-core')}
					columns="columns-2"
					className="mask-control-flip"
				>
					<ToggleControl
						repeaterItem={itemId}
						id={getControlId(itemId, 'horizontally-flip')}
						singularId={'horizontally-flip'}
						className="flip-toggle"
						columns="columns-2"
						label={__('Horizontally', 'blockera-core')}
						labelPopoverTitle={__(
							'Flip Horizontally',
							'blockera-core'
						)}
						labelDescription={
							<>
								<p>
									{__(
										'It allows the horizontal mirroring of the mask image.',
										'blockera-core'
									)}
								</p>
							</>
						}
						defaultValue={
							defaultRepeaterItemValue['horizontally-flip']
						}
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
						repeaterItem={itemId}
						id={getControlId(itemId, 'vertically-flip')}
						singularId={'vertically-flip'}
						className="flip-toggle"
						label={__('Vertically', 'blockera-core')}
						labelPopoverTitle={__(
							'Flip Vertically',
							'blockera-core'
						)}
						labelDescription={
							<>
								<p>
									{__(
										'It allows the vertical mirroring of the mask image.',
										'blockera-core'
									)}
								</p>
							</>
						}
						columns="columns-2"
						defaultValue={
							defaultRepeaterItemValue['vertically-flip']
						}
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
