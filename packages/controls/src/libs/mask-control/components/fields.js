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
import { Popover } from '@publisher/components';
import { controlInnerClassNames } from '@publisher/classnames';

/**
 * Internal dependencies
 */
import { RepeaterContext } from '../../repeater-control/context';
import { useControlContext } from '../../../context';
import {
	SelectControl,
	ToggleSelectControl,
	AlignmentMatrixControl,
	BaseControl,
	ToggleControl,
} from '../../index';
import type { TFieldItem } from '../types';
import SearchIcon from '../icons/search';
import { maskShapeIcons, selectedShape } from '../utils';
import { Shape } from './shape';

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
				className={controlInnerClassNames('mask-popover')}
			>
				<BaseControl
					columns="columns-2"
					label={__('Mask Shape', 'publisher-core')}
				>
					<div
						className="shape-button"
						onClick={() => setIsSelectShapeOpen(true)}
						data-test="mask-shape-button"
					>
						<span
							className={`shape-icon ${
								item['horizontally-flip'] ? 'h-flip' : ''
							} ${item['vertically-flip'] ? 'v-flip' : ''}`}
						>
							{selectedShape(item.shape.id)?.icon}
						</span>
						<span className="shape-title">
							{selectedShape(item.shape.id)?.id}
						</span>

						<span className="search-icon">
							<SearchIcon />
						</span>
					</div>

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
									</div>
								</BaseControl>
							)}
						</Popover>
					)}
				</BaseControl>

				<ToggleSelectControl
					id={getControlId(itemId, 'size')}
					label={__('Size', 'publisher-core')}
					columns="columns-2"
					options={[
						{
							label: __('Fit', 'publisher-core'),
							value: 'fit',
						},
						{
							label: __('Cover', 'publisher-core'),
							value: 'cover',
						},
						{
							label: __('Contain', 'publisher-core'),
							value: 'contain',
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
				/>

				<SelectControl
					id={getControlId(itemId, 'repeat')}
					label={__('Repeat', 'publisher-core')}
					columns="columns-2"
					options={[
						{
							label: __('No Repeat', 'publisher-core'),
							value: 'no-repeat',
						},
						{
							label: __('Repeat', 'publisher-core'),
							value: 'repeat',
						},
						{
							label: __('Repeat X', 'publisher-core'),
							value: 'repeat-x',
						},
						{
							label: __('Repeat Y', 'publisher-core'),
							value: 'repeat-y',
						},
						{
							label: __('Round', 'publisher-core'),
							value: 'round',
						},
						{
							label: __('Space', 'publisher-core'),
							value: 'space',
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

				<AlignmentMatrixControl
					id={getControlId(itemId, 'position')}
					label="Position"
					columns="columns-2"
					inputFields={true}
					onChange={(position) =>
						changeRepeaterItem({
							controlId,
							repeaterId,
							itemId,
							value: { ...item, position },
						})
					}
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
