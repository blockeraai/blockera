// @flow

/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import type { Element } from 'react';
import { memo, useEffect, useContext } from '@wordpress/element';

/**
 * Publisher dependencies
 */
import { Flex } from '@publisher/components';
import {
	controlClassNames,
	controlInnerClassNames,
} from '@publisher/classnames';
import { isValid as isValidVariable } from '@publisher/hooks';

/**
 * Internal dependencies
 */
import {
	BaseControl,
	InputControl,
	MediaImageControl,
	GradientBarControl,
	AnglePickerControl,
	ToggleSelectControl,
	AlignmentMatrixControl,
	NoticeControl,
} from '../../index';
import RepeaterControl from '../../repeater-control';
import { useControlContext } from '../../../context';
import { RepeaterContext } from '../../repeater-control/context';

// Icons
import RepeatIcon from '../icons/repeat';
import type { FieldItem } from '../types';
import RepeatXIcon from '../icons/repeat-x';
import RepeatYIcon from '../icons/repeat-y';
import RepeatNoIcon from '../icons/repeat-no';
import TypeImageIcon from '../icons/type-image';
import { default as RegenerateIcon } from '../icons/regenerate';
import TypeLinearGradientIcon from '../icons/type-linear-gradient';
import TypeRadialGradientIcon from '../icons/type-radial-gradient';
import { default as MeshGradientFields } from './mesh-gradient/fields';
import { default as MeshGradientHeader } from './mesh-gradient/header';
import LinearGradientRepeatIcon from '../icons/linear-gradient-repeat';
import RadialGradientRepeatIcon from '../icons/radial-gradient-repeat';
import LinearGradientNoRepeatIcon from '../icons/linear-gradient-no-repeat';
import RadialGradientNoRepeatIcon from '../icons/radial-gradient-no-repeat';
import { default as TypeMeshGradientIcon } from '../icons/type-mesh-gradient';
import {
	generateGradient,
	getRandomHexColor,
} from './mesh-gradient/mesh-generator';
import RadialGradientClosestSideIcon from '../icons/radial-gradient-closest-side';
import RadialGradientFarthestSideIcon from '../icons/radial-gradient-farthest-side';
import RadialGradientClosestCornerIcon from '../icons/radial-gradient-closest-corner';
import RadialGradientFarthestCornerIcon from '../icons/radial-gradient-farthest-corner';
import { LabelDescription } from './label-description';
import FitNormalIcon from '../icons/fit-normal';
import FitCoverIcon from '../icons/fit-cover';
import FitContainIcon from '../icons/fit-contain';
import { meshGradientProvider } from '../';

const Fields: FieldItem = memo<FieldItem>(
	({ itemId, item }: FieldItem): Element<any> => {
		const {
			controlInfo: { name: controlId },
			dispatch: { changeRepeaterItem },
		} = useControlContext();

		const { repeaterId, getControlId, defaultRepeaterItemValue } =
			useContext(RepeaterContext);

		useEffect(() => {
			if (undefined === item['mesh-gradient-colors']) {
				return;
			}

			changeRepeaterItem({
				controlId,
				repeaterId,
				itemId,
				value: {
					...item,
					'mesh-gradient': generateGradient(
						Object.values(item['mesh-gradient-colors']).length
					),
				},
			});
		}, [item['mesh-gradient-colors']]);

		return (
			<div id={`repeater-item-${itemId}`}>
				<ToggleSelectControl
					repeaterItem={itemId}
					singularId={'type'}
					id={getControlId(itemId, 'type')}
					defaultValue={defaultRepeaterItemValue.type}
					label={__('Type', 'publisher-core')}
					labelPopoverTitle={__('Background Type', 'publisher-core')}
					labelDescription={<LabelDescription />}
					columns="columns-2"
					options={[
						{
							label: __('Image', 'publisher-core'),
							value: 'image',
							icon: <TypeImageIcon />,
						},
						{
							label: __('Linear Gradient', 'publisher-core'),
							value: 'linear-gradient',
							icon: <TypeLinearGradientIcon />,
						},
						{
							label: __('Radial Gradient', 'publisher-core'),
							value: 'radial-gradient',
							icon: <TypeRadialGradientIcon />,
						},
						{
							label: __('Mesh Gradient', 'publisher-core'),
							value: 'mesh-gradient',
							icon: <TypeMeshGradientIcon />,
						},
					]}
					onChange={(type) =>
						changeRepeaterItem({
							controlId,
							repeaterId,
							itemId,
							value: {
								...item,
								type,
							},
						})
					}
				/>

				{item.type === 'image' && (
					<>
						<MediaImageControl
							repeaterItem={itemId}
							singularId={'image'}
							id={getControlId(itemId, 'image')}
							defaultValue={defaultRepeaterItemValue.image}
							label={__('Image', 'publisher-core')}
							labelPopoverTitle={__(
								'Background Image',
								'publisher-core'
							)}
							labelDescription={
								<>
									<p>
										{__(
											'It sets an image as the background of block, offering a significant enhancement in visual design and allowing for creative expression in web layouts.',
											'publisher-core'
										)}
									</p>
								</>
							}
							field="empty"
							columns="columns-1"
							onChange={(image) => {
								changeRepeaterItem({
									controlId,
									repeaterId,
									itemId,
									value: {
										...item,
										image,
									},
								});
							}}
						/>

						<ToggleSelectControl
							repeaterItem={itemId}
							singularId={'image-size'}
							id={getControlId(itemId, 'image-size')}
							defaultValue={
								defaultRepeaterItemValue['image-size']
							}
							label={__('Size', 'publisher-core')}
							labelPopoverTitle={__(
								'Background Size',
								'publisher-core'
							)}
							labelDescription={
								<>
									<p>
										{__(
											'It controls the scaling of background images, determining how an image covers or fits within the block.',
											'publisher-core'
										)}
									</p>
									<p>
										{__(
											'It offers settings like cover, contain, or custom specific dimensions.',
											'publisher-core'
										)}
									</p>
									<p>
										{__(
											'This feature is essential for responsive design, ensuring background images adapt seamlessly across different devices and screen sizes, enhancing the visual impact and consistency.',
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
							onChange={(size) =>
								changeRepeaterItem({
									controlId,
									repeaterId,
									itemId,
									value: {
										...item,
										'image-size': size,
									},
								})
							}
						>
							{item['image-size'] === 'custom' && (
								<Flex
									direction="row"
									gap="8px"
									justifyContent="space-around"
								>
									<InputControl
										repeaterItem={itemId}
										singularId={'image-size-width'}
										id={getControlId(
											itemId,
											'image-size-width'
										)}
										defaultValue={
											defaultRepeaterItemValue[
												'image-size-width'
											]
										}
										label={__('Width', 'publisher-core')}
										labelPopoverTitle={__(
											'Background Width Size',
											'publisher-core'
										)}
										labelDescription={
											<>
												<p>
													{__(
														'Specifies the exact width size for background image.',
														'publisher-core'
													)}
												</p>
											</>
										}
										columns="columns-1"
										className="control-first label-center small-gap"
										unitType="background-size"
										onChange={(width) =>
											changeRepeaterItem({
												controlId,
												repeaterId,
												itemId,
												value: {
													...item,
													'image-size-width': width,
												},
											})
										}
										size="small"
										controlAddonTypes={['variable']}
										variableTypes={['width-size']}
									/>

									<InputControl
										repeaterItem={itemId}
										singularId={'image-size-height'}
										id={getControlId(
											itemId,
											'image-size-height'
										)}
										defaultValue={
											defaultRepeaterItemValue[
												'image-size-height'
											]
										}
										label={__('Height', 'publisher-core')}
										labelPopoverTitle={__(
											'Background Height Size',
											'publisher-core'
										)}
										labelDescription={
											<>
												<p>
													{__(
														'Specifies the exact height size for background image.',
														'publisher-core'
													)}
												</p>
											</>
										}
										columns="columns-1"
										className="control-first label-center small-gap"
										unitType="background-size"
										onChange={(height) =>
											changeRepeaterItem({
												controlId,
												repeaterId,
												itemId,
												value: {
													...item,
													'image-size-height': height,
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

						<AlignmentMatrixControl
							repeaterItem={itemId}
							singularId={'image-position'}
							id={getControlId(itemId, '[image-position]')}
							defaultValue={
								defaultRepeaterItemValue['image-position']
							}
							inputFields={true}
							label={__('Position', 'publisher-core')}
							labelPopoverTitle={__(
								'Background Position',
								'publisher-core'
							)}
							labelDescription={
								<>
									<p>
										{__(
											'Adjusts the positioning of a background image within a block.',
											'publisher-core'
										)}
									</p>
									<p>
										{__(
											'Useful for aligning images to specific areas.',
											'publisher-core'
										)}
									</p>
								</>
							}
							columns="columns-2"
							onChange={(newValue) => {
								changeRepeaterItem({
									controlId,
									repeaterId,
									itemId,
									value: {
										...item,
										'image-position': newValue,
									},
								});
							}}
						/>

						<ToggleSelectControl
							repeaterItem={itemId}
							singularId={'image-repeat'}
							id={getControlId(itemId, 'image-repeat')}
							defaultValue={
								defaultRepeaterItemValue['image-repeat']
							}
							label={__('Repeat', 'publisher-core')}
							labelPopoverTitle={__(
								'Background Repeat',
								'publisher-core'
							)}
							labelDescription={
								<>
									<p>
										{__(
											'It defines how a background image is repeated within the block.',
											'publisher-core'
										)}
									</p>
									<p>
										{__(
											'It controls whether the image repeats along the x-axis, y-axis, both, or not at all.',
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
									label: __(
										"Don't Tile Background",
										'publisher-core'
									),
									value: 'no-repeat',
									icon: <RepeatNoIcon />,
								},
							]}
							//
							onChange={(newValue) =>
								changeRepeaterItem({
									controlId,
									repeaterId,
									itemId,
									value: {
										...item,
										'image-repeat': newValue,
									},
								})
							}
						/>

						<ToggleSelectControl
							repeaterItem={itemId}
							singularId={'image-attachment'}
							id={getControlId(itemId, 'image-attachment')}
							defaultValue={
								defaultRepeaterItemValue['image-attachment']
							}
							label={__('Effect', 'publisher-core')}
							labelPopoverTitle={__(
								'Background Effect',
								'publisher-core'
							)}
							labelDescription={
								<>
									<p>
										{__(
											'It specifies how the background behaves when the user scrolls.',
											'publisher-core'
										)}
									</p>
									<h3>{__('Fix', 'publisher-core')}</h3>
									<p>
										{__(
											'The background scrolls with the content of the block. (The default setting)',
											'publisher-core'
										)}
									</p>
									<h3>{__('Parallax', 'publisher-core')}</h3>
									<p>
										{__(
											'The background is fixed with respect to the viewport, creating a parallax scrolling effect.',
											'publisher-core'
										)}
									</p>
								</>
							}
							columns="columns-2"
							options={[
								{
									label: __('Fix', 'publisher-core'),
									value: 'scroll',
								},
								{
									label: __('Parallax', 'publisher-core'),
									value: 'fixed',
								},
							]}
							onChange={(newValue) =>
								changeRepeaterItem({
									controlId,
									repeaterId,
									itemId,
									value: {
										...item,
										'image-attachment': newValue,
									},
								})
							}
						/>
					</>
				)}

				{item.type === 'linear-gradient' && (
					<>
						<GradientBarControl
							repeaterItem={itemId}
							singularId={'linear-gradient'}
							id={getControlId(itemId, 'linear-gradient')}
							defaultValue={
								defaultRepeaterItemValue['linear-gradient']
							}
							label={__('Linear Gradient', 'publisher-core')}
							labelDescription={
								<>
									<p>
										{__(
											'Linear Gradient creates a smooth transition between multiple colors in a straight line. ',
											'publisher-core'
										)}
									</p>
									<p>
										{__(
											'Linear gradients are ideal for creating vibrant backgrounds, adding dimension, or emphasizing branding blocks.',
											'publisher-core'
										)}
									</p>
								</>
							}
							field="empty"
							onChange={(newValue: string) => {
								changeRepeaterItem({
									controlId,
									repeaterId,
									itemId,
									value: {
										...item,
										'linear-gradient': newValue,
									},
								});
							}}
							height={40}
							controlAddonTypes={['variable']}
							variableTypes={['linear-gradient']}
						/>

						<AnglePickerControl
							repeaterItem={itemId}
							singularId={'linear-gradient-angel'}
							id={getControlId(itemId, 'linear-gradient-angel')}
							defaultValue={
								defaultRepeaterItemValue[
									'linear-gradient-angel'
								]
							}
							label={__('Angel', 'publisher-core')}
							labelPopoverTitle={__(
								'Linear Gradient Angel',
								'publisher-core'
							)}
							labelDescription={
								<>
									<p>
										{__(
											'It specifies the gradient line angle.',
											'publisher-core'
										)}
									</p>
									<p>
										{__(
											"It can be used to direct the viewer's attention or to create a sense of movement and depth.",
											'publisher-core'
										)}
									</p>
								</>
							}
							columns="columns-2"
							className={
								isValidVariable(item['linear-gradient']) &&
								'publisher-control-is-not-active'
							}
							onChange={(newValue: string) => {
								// update linear gradient value
								changeRepeaterItem({
									controlId,
									repeaterId,
									itemId,
									value: {
										...item,
										'linear-gradient-angel': newValue,
									},
								});
							}}
						/>

						<BaseControl columns="columns-1">
							<ToggleSelectControl
								repeaterItem={itemId}
								singularId={'linear-gradient-repeat'}
								id={getControlId(
									itemId,
									'linear-gradient-repeat'
								)}
								defaultValue={
									defaultRepeaterItemValue[
										'linear-gradient-repeat'
									]
								}
								label={__('Repeat', 'publisher-core')}
								labelPopoverTitle={__(
									'Repeating Linear Gradient',
									'publisher-core'
								)}
								labelDescription={
									<>
										<p>
											{__(
												'It creates a background pattern with a linear gradient that repeats at regular intervals.',
												'publisher-core'
											)}
										</p>
										<p>
											{__(
												'This is ideal for creating textured gradient backgrounds or complex patterns.',
												'publisher-core'
											)}
										</p>
									</>
								}
								columns="columns-2"
								options={[
									{
										label: __(
											"Don't Repeat",
											'publisher-core'
										),
										value: 'no-repeat',
										icon: <LinearGradientNoRepeatIcon />,
									},
									{
										label: __('Repeat', 'publisher-core'),
										value: 'repeat',
										icon: <LinearGradientRepeatIcon />,
									},
								]}
								onChange={(newValue) =>
									changeRepeaterItem({
										controlId,
										repeaterId,
										itemId,
										value: {
											...item,
											'linear-gradient-repeat': newValue,
										},
									})
								}
								className={
									isValidVariable(item['linear-gradient']) &&
									'publisher-control-is-not-active'
								}
							/>

							{isValidVariable(item['linear-gradient']) && (
								<NoticeControl type="information">
									{__(
										"These options can't work for variables. Use custom gradient or unlink current variable.",
										'publisher-core'
									)}
								</NoticeControl>
							)}
						</BaseControl>

						<ToggleSelectControl
							repeaterItem={itemId}
							singularId={'linear-gradient-attachment'}
							id={getControlId(
								itemId,
								'linear-gradient-attachment'
							)}
							defaultValue={
								defaultRepeaterItemValue[
									'linear-gradient-attachment'
								]
							}
							label={__('Effect', 'publisher-core')}
							labelPopoverTitle={__(
								'Background Effect',
								'publisher-core'
							)}
							labelDescription={
								<>
									<p>
										{__(
											'It specifies how the background behaves when the user scrolls.',
											'publisher-core'
										)}
									</p>
									<h3>{__('Fix', 'publisher-core')}</h3>
									<p>
										{__(
											'The background scrolls with the content of the block. (The default setting)',
											'publisher-core'
										)}
									</p>
									<h3>{__('Parallax', 'publisher-core')}</h3>
									<p>
										{__(
											'The background is fixed with respect to the viewport, creating a parallax scrolling effect.',
											'publisher-core'
										)}
									</p>
								</>
							}
							columns="columns-2"
							options={[
								{
									label: __('Fix', 'publisher-core'),
									value: 'scroll',
								},
								{
									label: __('Parallax', 'publisher-core'),
									value: 'fixed',
								},
							]}
							onChange={(newValue) =>
								changeRepeaterItem({
									controlId,
									repeaterId,
									itemId,
									value: {
										...item,
										'linear-gradient-attachment': newValue,
									},
								})
							}
						/>
					</>
				)}

				{item.type === 'radial-gradient' && (
					<>
						<GradientBarControl
							repeaterItem={itemId}
							singularId={'radial-gradient'}
							id={getControlId(itemId, 'radial-gradient')}
							defaultValue={
								defaultRepeaterItemValue['radial-gradient']
							}
							label={__('Radial Gradient', 'publisher-core')}
							labelDescription={
								<>
									<p>
										{__(
											'A radial gradient background creates a circular or elliptical color transition, emanating from a single point and radiating outward, offering a unique and visually dynamic background option.',
											'publisher-core'
										)}
									</p>
									<p>
										{__(
											'This type of background gradient is perfect for creating focal points, adding depth, or crafting visually intriguing backgrounds.',
											'publisher-core'
										)}
									</p>
								</>
							}
							field="empty"
							onChange={(newValue) =>
								changeRepeaterItem({
									controlId,
									repeaterId,
									itemId,
									value: {
										...item,
										'radial-gradient': newValue,
									},
								})
							}
							height={40}
							controlAddonTypes={['variable']}
							variableTypes={['radial-gradient']}
						/>

						<AlignmentMatrixControl
							repeaterItem={itemId}
							singularId={'radial-gradient-position'}
							id={getControlId(
								itemId,
								'radial-gradient-position'
							)}
							defaultValue={
								defaultRepeaterItemValue[
									'radial-gradient-position'
								]
							}
							inputFields={true}
							label={__('Position', 'publisher-core')}
							labelPopoverTitle={__(
								'Background Position',
								'publisher-core'
							)}
							labelDescription={
								<>
									<p>
										{__(
											'Adjusts the positioning of a radial gradient background within a block.',
											'publisher-core'
										)}
									</p>
									<p>
										{__(
											'Useful for aligning gradient to specific areas.',
											'publisher-core'
										)}
									</p>
								</>
							}
							columns="columns-2"
							onChange={(newValue) => {
								changeRepeaterItem({
									controlId,
									repeaterId,
									itemId,
									value: {
										...item,
										'radial-gradient-position': newValue,
									},
								});
							}}
							className={
								isValidVariable(item['radial-gradient']) &&
								'publisher-control-is-not-active'
							}
						/>

						<ToggleSelectControl
							repeaterItem={itemId}
							singularId={'radial-gradient-size'}
							id={getControlId(itemId, 'radial-gradient-size')}
							defaultValue={
								defaultRepeaterItemValue['radial-gradient-size']
							}
							label={__('Size', 'publisher-core')}
							labelPopoverTitle={__(
								'Background Position',
								'publisher-core'
							)}
							labelDescription={
								<>
									<p>
										{__(
											"In a radial gradient background, the size determines the extent of the gradient's shape, which can be circular or elliptical.",
											'publisher-core'
										)}
									</p>
									<p>
										{__(
											'It controls how the gradient spreads within the block.',
											'publisher-core'
										)}
									</p>
									<h3>
										<RadialGradientFarthestCornerIcon />
										{__(
											'Farthest Corner',
											'publisher-core'
										)}
									</h3>
									<p>
										{__(
											"The gradient's final color reaches the farthest corner of the box containing the gradient.",
											'publisher-core'
										)}
									</p>
									<h3>
										<RadialGradientFarthestSideIcon />
										{__('Farthest Side', 'publisher-core')}
									</h3>
									<p>
										{__(
											"The gradient extends to the farthest side of the container, creating a gradient that is visually aligned with the container's widest point.",
											'publisher-core'
										)}
									</p>
									<h3>
										<RadialGradientClosestCornerIcon />
										{__('Closest Corner', 'publisher-core')}
									</h3>
									<p>
										{__(
											"The gradient's radius extends to the closest corner of the container, resulting in a more focused and concentrated radial effect.",
											'publisher-core'
										)}
									</p>
									<h3>
										<RadialGradientClosestSideIcon />
										{__('Closest Side', 'publisher-core')}
									</h3>
									<p>
										{__(
											'The gradient extends to the side of the container that is closest to its center, creating a gradient that closely follows the shape of the container.',
											'publisher-core'
										)}
									</p>
								</>
							}
							columns="columns-2"
							options={[
								{
									label: __(
										'Farthest corner of the box from its center',
										'publisher-core'
									),
									value: 'farthest-corner',
									icon: <RadialGradientFarthestCornerIcon />,
								},
								{
									label: __(
										'Similar to closest-side, except the ending shape is sized to meet the side of the box farthest from its center',
										'publisher-core'
									),
									value: 'farthest-side',
									icon: <RadialGradientFarthestSideIcon />,
								},
								{
									label: __(
										"The gradient's ending shape is sized so that it exactly meets the closest corner of the box from its center",
										'publisher-core'
									),
									value: 'closest-corner',
									icon: <RadialGradientClosestCornerIcon />,
								},
								{
									label: __(
										"The gradient's ending shape meets the side of the box closest to its center",
										'publisher-core'
									),
									value: 'closest-side',
									icon: <RadialGradientClosestSideIcon />,
								},
							]}
							onChange={(newValue) =>
								changeRepeaterItem({
									controlId,
									repeaterId,
									itemId,
									value: {
										...item,
										'radial-gradient-size': newValue,
									},
								})
							}
							className={
								isValidVariable(item['radial-gradient']) &&
								'publisher-control-is-not-active'
							}
						/>

						<BaseControl columns="columns-1">
							<ToggleSelectControl
								repeaterItem={itemId}
								singularId={'radial-gradient-repeat'}
								id={getControlId(
									itemId,
									'radial-gradient-repeat'
								)}
								defaultValue={
									defaultRepeaterItemValue[
										'radial-gradient-repeat'
									]
								}
								label={__('Repeat', 'publisher-core')}
								labelPopoverTitle={__(
									'Repeating Radial Gradient',
									'publisher-core'
								)}
								labelDescription={
									<>
										<p>
											{__(
												'It creates a background pattern with a radial gradient that repeats at regular intervals.',
												'publisher-core'
											)}
										</p>
										<p>
											{__(
												'This is ideal for creating textured gradient backgrounds or complex patterns.',
												'publisher-core'
											)}
										</p>
									</>
								}
								columns="columns-2"
								options={[
									{
										label: __(
											"Don't Repeat",
											'publisher-core'
										),
										value: 'no-repeat',
										icon: <RadialGradientNoRepeatIcon />,
									},
									{
										label: __('Repeat', 'publisher-core'),
										value: 'repeat',
										icon: <RadialGradientRepeatIcon />,
									},
								]}
								onChange={(newValue) =>
									changeRepeaterItem({
										controlId,
										repeaterId,
										itemId,
										value: {
											...item,
											'radial-gradient-repeat': newValue,
										},
									})
								}
								className={
									isValidVariable(item['radial-gradient']) &&
									'publisher-control-is-not-active'
								}
							/>

							{isValidVariable(item['radial-gradient']) && (
								<NoticeControl type="information">
									{__(
										"These options can't work for variables. Use custom gradient or unlink current variable.",
										'publisher-core'
									)}
								</NoticeControl>
							)}
						</BaseControl>

						<ToggleSelectControl
							repeaterItem={itemId}
							singularId={'radial-gradient-attachment'}
							id={getControlId(
								itemId,
								'radial-gradient-attachment'
							)}
							defaultValue={
								defaultRepeaterItemValue[
									'radial-gradient-attachment'
								]
							}
							label={__('Effect', 'publisher-core')}
							labelPopoverTitle={__(
								'Background Effect',
								'publisher-core'
							)}
							labelDescription={
								<>
									<p>
										{__(
											'It specifies how the background behaves when the user scrolls.',
											'publisher-core'
										)}
									</p>
									<h3>{__('Fix', 'publisher-core')}</h3>
									<p>
										{__(
											'The background scrolls with the content of the block. (The default setting)',
											'publisher-core'
										)}
									</p>
									<h3>{__('Parallax', 'publisher-core')}</h3>
									<p>
										{__(
											'The background is fixed with respect to the viewport, creating a parallax scrolling effect.',
											'publisher-core'
										)}
									</p>
								</>
							}
							columns="columns-2"
							options={[
								{
									label: __('Fix', 'publisher-core'),
									value: 'scroll',
								},
								{
									label: __('Parallax', 'publisher-core'),
									value: 'fixed',
								},
							]}
							onChange={(newValue) =>
								changeRepeaterItem({
									controlId,
									repeaterId,
									itemId,
									value: {
										...item,
										'radial-gradient-attachment': newValue,
									},
								})
							}
						/>
					</>
				)}

				{item.type === 'mesh-gradient' && (
					<>
						<BaseControl
							label=""
							columns="columns-1"
							controlName="empty"
						>
							<div
								className={controlInnerClassNames(
									'mesh-generator-preview'
								)}
								style={((): Object => {
									const meshColorKeys = Object.keys(
										item['mesh-gradient-colors']
									);
									return {
										backgroundColor:
											item['mesh-gradient-colors']['--c0']
												.color,
										backgroundImage: item['mesh-gradient'],
										...Object.assign(
											// $FlowFixMe
											...Object.values(
												item['mesh-gradient-colors']
											).map((color, index): Object => ({
												[meshColorKeys[index]]:
													color.color,
											}))
										),
									};
								})()}
								onClick={() => {
									changeRepeaterItem({
										controlId,
										repeaterId,
										itemId,
										value: meshGradientProvider(item),
									});
								}}
							>
								<span
									className={controlInnerClassNames(
										'mesh-generator-preview-regenerate'
									)}
								>
									<RegenerateIcon /> {__('Regenerate')}
								</span>
							</div>
						</BaseControl>

						<BaseControl
							label=""
							columns="columns-1"
							controlName="empty"
						>
							<RepeaterControl
								repeaterItem={itemId}
								singularId={'mesh-gradient-colors'}
								id={getControlId(
									itemId,
									'[mesh-gradient-colors]'
								)}
								itemIdGenerator={(
									itemsCount: number
								): string => {
									return '--c' + itemsCount;
								}}
								defaultValue={
									defaultRepeaterItemValue[
										'mesh-gradient-colors'
									]
								}
								label={__('Colors', 'publisher-core')}
								labelPopoverTitle={__(
									'Mesh Gradient Colors',
									'publisher-core'
								)}
								labelDescription={
									<>
										<p>
											{__(
												'It specifies the colors of the mesh gradient points.',
												'publisher-core'
											)}
										</p>
										<p>
											{__(
												'You can add as many colors as you like. The fist color will be the base background color.',
												'publisher-core'
											)}
										</p>
									</>
								}
								className={controlClassNames(
									'mesh-gradient-background'
								)}
								popoverTitle={__(
									'Mesh Gradient Color',
									'publisher-color'
								)}
								addNewButtonLabel={__(
									'Add New Mesh Gradient Color',
									'publisher-color'
								)}
								repeaterItemHeader={MeshGradientHeader}
								repeaterItemChildren={MeshGradientFields}
								minItems={3}
								actionButtonVisibility={false}
								defaultRepeaterItemValue={{
									color: getRandomHexColor(),
									isOpen: false,
								}}
								isItemDeletable={(_itemId: string): boolean =>
									'--c0' !== _itemId
								}
							/>
						</BaseControl>

						<ToggleSelectControl
							repeaterItem={itemId}
							singularId={'mesh-gradient-attachment'}
							id={getControlId(
								itemId,
								'[mesh-gradient-attachment]'
							)}
							defaultValue={
								defaultRepeaterItemValue[
									'mesh-gradient-attachment'
								]
							}
							label={__('Effect', 'publisher-core')}
							labelPopoverTitle={__(
								'Background Effect',
								'publisher-core'
							)}
							labelDescription={
								<>
									<p>
										{__(
											'It specifies how the background behaves when the user scrolls.',
											'publisher-core'
										)}
									</p>
									<h3>{__('Fix', 'publisher-core')}</h3>
									<p>
										{__(
											'The background scrolls with the content of the block. (The default setting)',
											'publisher-core'
										)}
									</p>
									<h3>{__('Parallax', 'publisher-core')}</h3>
									<p>
										{__(
											'The background is fixed with respect to the viewport, creating a parallax scrolling effect.',
											'publisher-core'
										)}
									</p>
								</>
							}
							columns="columns-2"
							options={[
								{
									label: __('Fix', 'publisher-core'),
									value: 'scroll',
								},
								{
									label: __('Parallax', 'publisher-core'),
									value: 'fixed',
								},
							]}
							onChange={(newValue) =>
								changeRepeaterItem({
									controlId,
									repeaterId,
									itemId,
									value: {
										...item,
										'mesh-gradient-attachment': newValue,
									},
								})
							}
						/>
					</>
				)}
			</div>
		);
	}
);

export default Fields;
