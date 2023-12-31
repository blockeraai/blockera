// @flow
/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import type { Element } from 'react';
import { memo, useContext } from '@wordpress/element';

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
import RepeatXIcon from '../icons/repeat-x';
import RepeatYIcon from '../icons/repeat-y';
import RepeatNoIcon from '../icons/repeat-no';
import TypeImageIcon from '../icons/type-image';
import { default as RegenerateIcon } from '../icons/regenerate';
import TypeLinearGradientIcon from '../icons/type-linear-gradient';
import TypeRadialGradientIcon from '../icons/type-radial-gradient';
import type { TDefaultRepeaterItemValue, FieldItem } from '../types';
import { default as MeshGradientFields } from './mesh-gradient/fields';
import { default as MeshGradientHeader } from './mesh-gradient/header';
import LinearGradientRepeatIcon from '../icons/linear-gradient-repeat';
import RadialGradientRepeatIcon from '../icons/radial-gradient-repeat';
import LinearGradientNoRepeatIcon from '../icons/linear-gradient-no-repeat';
import RadialGradientNoRepeatIcon from '../icons/radial-gradient-no-repeat';
import { default as TypeMeshGradientIcon } from '../icons/type-mesh-gradient';
import {
	default as generateMeshGradient,
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

/**
 * Providing mesh gradient colors details.
 *
 * @param {Object} object the data holder
 * @return {{}} retrieved object includes mesh gradient details
 */
function meshGradientProvider(
	object: TDefaultRepeaterItemValue
): TDefaultRepeaterItemValue {
	const meshGradient = generateMeshGradient(
		object['mesh-gradient-colors']?.length
			? object['mesh-gradient-colors'].length
			: 4
	);

	return {
		...object,
		'mesh-gradient': meshGradient.gradient,
		'mesh-gradient-colors': meshGradient.colors.map((value) => {
			return { color: value };
		}),
	};
}

const Fields: FieldItem = memo<FieldItem>(
	({ itemId, item }: FieldItem): Element<any> => {
		const {
			controlInfo: { name: controlId },
			dispatch: { changeRepeaterItem },
		} = useControlContext();

		const { repeaterId, getControlId } = useContext(RepeaterContext);

		// fill new random mesh gradient with provider if it's empty
		if (!item['mesh-gradient']) {
			item = { ...item, ...meshGradientProvider(item) };
		}

		return (
			<div id={`repeater-item-${itemId}`}>
				<ToggleSelectControl
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
					id={getControlId(itemId, 'type')}
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
							id={getControlId(itemId, 'image')}
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
							id={getControlId(itemId, 'image-size')}
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
										id={getControlId(
											itemId,
											'image-size-width'
										)}
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
										id={getControlId(
											itemId,
											'image-size-height'
										)}
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
							repeaterItem={itemId}
							id={getControlId(itemId, '[image-position]')}
							singularId={'image-position'}
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
							id={getControlId(itemId, '[image-repeat]')}
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
							id={getControlId(itemId, '[image-attachment]')}
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
							id={getControlId(itemId, '[linear-gradient]')}
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
							id={getControlId(itemId, '[linear-gradient-angel]')}
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
								//
								id={getControlId(
									itemId,
									'[linear-gradient-repeat]'
								)}
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
							id={getControlId(
								itemId,
								'[linear-gradient-attachment]'
							)}
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
							id={getControlId(itemId, '[radial-gradient]')}
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
							id={getControlId(
								itemId,
								'[radial-gradient-position]'
							)}
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
							id={getControlId(itemId, '[radial-gradient-size]')}
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
								id={getControlId(
									itemId,
									'[radial-gradient-repeat]'
								)}
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
							id={getControlId(
								itemId,
								'[radial-gradient-attachment]'
							)}
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
								style={{
									backgroundColor:
										item['mesh-gradient-colors'][0].color,
									backgroundImage: item['mesh-gradient'],
									...Object.assign(
										// $FlowFixMe
										...item['mesh-gradient-colors'].map(
											(
												value: { color: string },
												index: number
											): Object => {
												const newVar = '--c' + index;
												const obj: any = {};
												obj[newVar] = value.color;
												return obj;
											}
										)
									),
								}}
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
								id={getControlId(
									itemId,
									'[mesh-gradient-colors]'
								)}
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
								}}
								onChange={(newValue) => {
									changeRepeaterItem({
										controlId,
										repeaterId,
										itemId,
										value: {
											...item,
											'mesh-gradient': generateGradient(
												newValue.length
											),
										},
									});
								}}
							/>
						</BaseControl>

						<ToggleSelectControl
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
							id={getControlId(
								itemId,
								'[mesh-gradient-attachment]'
							)}
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
