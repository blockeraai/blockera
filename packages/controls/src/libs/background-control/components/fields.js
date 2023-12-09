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
							label=""
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
							columns="columns-2"
							options={[
								{
									label: __('Custom', 'publisher-core'),
									value: 'custom',
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
										columns="columns-1"
										className="control-first label-center small-gap"
										type="css"
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
									/>

									<InputControl
										label={__('Height', 'publisher-core')}
										columns="columns-1"
										className="control-first label-center small-gap"
										type="css"
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
									/>
								</Flex>
							)}
						</ToggleSelectControl>

						<AlignmentMatrixControl
							inputFields={true}
							label={__('Position', 'publisher-core')}
							columns="columns-2"
							id={getControlId(itemId, '[image-position]')}
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
							label=""
							field="empty"
							id={getControlId(itemId, '[linear-gradient]')}
							onChange={(newValue) => {
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
						/>

						<AnglePickerControl
							label={__('Angel', 'publisher-core')}
							columns="columns-2"
							id={getControlId(itemId, '[linear-gradient-angel]')}
							onChange={(newValue) => {
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

						<ToggleSelectControl
							label={__('Repeat', 'publisher-core')}
							columns="columns-2"
							options={[
								{
									label: __("Don't Repeat", 'publisher-core'),
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
						/>

						<ToggleSelectControl
							label={__('Effect', 'publisher-core')}
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
							label=""
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
						/>

						<AlignmentMatrixControl
							inputFields={true}
							label={__('Position', 'publisher-core')}
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
						/>

						<ToggleSelectControl
							label={__('Size', 'publisher-core')}
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
						/>

						<ToggleSelectControl
							label={__('Repeat', 'publisher-core')}
							columns="columns-2"
							options={[
								{
									label: __("Don't Repeat", 'publisher-core'),
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
						/>

						<ToggleSelectControl
							label={__('Effect', 'publisher-core')}
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
