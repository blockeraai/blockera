/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { memo, useContext } from '@wordpress/element';

/**
 * Publisher dependencies
 */
import {
	ToggleSelectField,
	InputField,
	GradientBarField,
	AnglePickerField,
	PositionField,
	MediaImageField,
	Field,
} from '@publisher/fields';
import { Flex } from '@publisher/components';
import {
	controlClassNames,
	controlInnerClassNames,
} from '@publisher/classnames';

/**
 * Internal dependencies
 */
import BaseControl from '../../base';
import RepeaterControl from '../../repeater-control';
// Icons
import RepeatIcon from '../icons/repeat';
import RepeatXIcon from '../icons/repeat-x';
import RepeatYIcon from '../icons/repeat-y';
import RepeatNoIcon from '../icons/repeat-no';
import TypeImageIcon from '../icons/type-image';
import { RepeaterContext } from '../../repeater-control/context';
import TypeLinearGradientIcon from '../icons/type-linear-gradient';
import TypeRadialGradientIcon from '../icons/type-radial-gradient';
import { default as TypeMeshGradientIcon } from '../icons/type-mesh-gradient';
import LinearGradientRepeatIcon from '../icons/linear-gradient-repeat';
import RadialGradientRepeatIcon from '../icons/radial-gradient-repeat';
import LinearGradientNoRepeatIcon from '../icons/linear-gradient-no-repeat';
import RadialGradientNoRepeatIcon from '../icons/radial-gradient-no-repeat';
import RadialGradientClosestSideIcon from '../icons/radial-gradient-closest-side';
import RadialGradientFarthestSideIcon from '../icons/radial-gradient-farthest-side';
import RadialGradientClosestCornerIcon from '../icons/radial-gradient-closest-corner';
import RadialGradientFarthestCornerIcon from '../icons/radial-gradient-farthest-corner';
import { default as MeshGradientHeader } from './mesh-gradient/header';
import { default as MeshGradientFields } from './mesh-gradient/fields';
import { default as generateMeshGradient } from './mesh-gradient/mesh-generator';
import { default as RegenerateIcon } from './../icons/regenerate';

const Fields = ({ itemId, item }) => {
	const { changeItem } = useContext(RepeaterContext);

	const linearGradientValue = /\((\d.*)deg,/im?.exec(item['linear-gradient']);

	function regenerateMeshGradient() {
		const meshGradient = generateMeshGradient(
			item['mesh-gradient-colors']?.length
				? item['mesh-gradient-colors'].length
				: 4
		);

		const newItem = {
			...item,
			'mesh-gradient': meshGradient.gradient,
			'mesh-gradient-colors': meshGradient.colors.map((value) => {
				return { color: value };
			}),
		};

		changeItem(itemId, newItem);
	}

	// fill new random mesh gradient if it's empty
	if (!item['mesh-gradient']) {
		regenerateMeshGradient();
	}

	return (
		<BaseControl id={`repeater-item-${itemId}`}>
			<ToggleSelectField
				label={__('Type', 'publisher-core')}
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
				//
				value={item.type}
				onValueChange={(type) => changeItem(itemId, { ...item, type })}
			/>

			{item.type === 'image' && (
				<>
					<MediaImageField
						label=""
						columns="columns-1"
						settings={{
							type: 'text',
						}}
						//
						value={item.image}
						onValueChange={(image) => {
							changeItem(itemId, { ...item, image });
						}}
					/>

					<ToggleSelectField
						label={__('Size', 'publisher-core')}
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
						//
						value={item['image-size']}
						onValueChange={(size) =>
							changeItem(itemId, { ...item, 'image-size': size })
						}
					>
						{item['image-size'] === 'custom' && (
							<Flex
								direction="row"
								gap="8px"
								justifyContent="space-around"
							>
								<InputField
									label={__('Width', 'publisher-core')}
									columns="columns-1"
									className="control-first label-center small-gap"
									settings={{
										type: 'css',
										unitType: 'background-size',
									}}
									//
									value={item['image-size-width']}
									onValueChange={(width) =>
										changeItem(itemId, {
											...item,
											'image-size-width': width,
										})
									}
								/>

								<InputField
									label={__('Height', 'publisher-core')}
									columns="columns-1"
									className="control-first label-center small-gap"
									settings={{
										type: 'css',
										unitType: 'background-size',
									}}
									//
									value={item['image-size-height']}
									onValueChange={(height) =>
										changeItem(itemId, {
											...item,
											'image-size-height': height,
										})
									}
								/>
							</Flex>
						)}
					</ToggleSelectField>

					<PositionField
						topValue={item['image-position-top']}
						leftValue={item['image-position-left']}
						onValueChange={({ top, left }) => {
							changeItem(itemId, {
								...item,
								'image-position-top': top || item.top,
								'image-position-left': left || item.left,
							});
						}}
					/>

					<ToggleSelectField
						label={__('Repeat', 'publisher-core')}
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
						value={item['image-repeat']}
						onValueChange={(newValue) =>
							changeItem(itemId, {
								...item,
								'image-repeat': newValue,
							})
						}
					/>

					<ToggleSelectField
						label={__('Effect', 'publisher-core')}
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
						//
						value={item['image-attachment']}
						onValueChange={(newValue) =>
							changeItem(itemId, {
								...item,
								'image-attachment': newValue,
							})
						}
					/>
				</>
			)}

			{item.type === 'linear-gradient' && (
				<>
					<GradientBarField
						value={item['linear-gradient']}
						onValueChange={(newValue) =>
							changeItem(itemId, {
								...item,
								'linear-gradient': newValue,
							})
						}
					/>

					<AnglePickerField
						label={__('Angel', 'publisher-core')}
						onValueChange={(newValue) => {
							// update linear gradient value
							changeItem(itemId, {
								...item,
								'linear-gradient': item[
									'linear-gradient'
								].replace(/\(\d.*deg,/gim, `(${newValue}deg,`),
							});
						}}
						value={
							linearGradientValue ? linearGradientValue[1] : ''
						}
					/>

					<ToggleSelectField
						label={__('Repeat', 'publisher-core')}
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
						value={item['linear-gradient-repeat']}
						onValueChange={(newValue) =>
							changeItem(itemId, {
								...item,
								'linear-gradient-repeat': newValue,
							})
						}
					/>

					<ToggleSelectField
						label={__('Effect', 'publisher-core')}
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
						//
						value={item['linear-gradient-attachment']}
						onValueChange={(newValue) =>
							changeItem(itemId, {
								...item,
								'linear-gradient-attachment': newValue,
							})
						}
					/>
				</>
			)}

			{item.type === 'radial-gradient' && (
				<>
					<GradientBarField
						//
						value={item['radial-gradient']}
						onValueChange={(newValue) =>
							changeItem(itemId, {
								...item,
								'radial-gradient': newValue,
							})
						}
					/>

					<PositionField
						topValue={item['radial-gradient-position-top']}
						leftValue={item['radial-gradient-position-left']}
						onValueChange={({ top, left }) => {
							changeItem(itemId, {
								...item,
								'radial-gradient-position-top': top || item.top,
								'radial-gradient-position-left':
									left || item.left,
							});
						}}
					/>

					<ToggleSelectField
						label={__('Size', 'publisher-core')}
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
						//
						value={item['radial-gradient-size']}
						onValueChange={(newValue) =>
							changeItem(itemId, {
								...item,
								'radial-gradient-size': newValue,
							})
						}
					/>

					<ToggleSelectField
						label={__('Repeat', 'publisher-core')}
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
						//
						value={item['radial-gradient-repeat']}
						onValueChange={(newValue) =>
							changeItem(itemId, {
								...item,
								'radial-gradient-repeat': newValue,
							})
						}
					/>

					<ToggleSelectField
						label={__('Effect', 'publisher-core')}
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
						//
						value={item['radial-gradient-attachment']}
						onValueChange={(newValue) =>
							changeItem(itemId, {
								...item,
								'radial-gradient-attachment': newValue,
							})
						}
					/>
				</>
			)}

			{item.type === 'mesh-gradient' && (
				<>
					<Field label="" columns="columns-1">
						<div
							className={controlInnerClassNames(
								'mesh-generator-preview'
							)}
							style={{
								backgroundColor:
									item['mesh-gradient-colors'][0].color,
								backgroundImage: item['mesh-gradient'],
								...Object.assign(
									...item['mesh-gradient-colors'].map(
										(value, index) => {
											const newVar = '--c' + index;
											const obj = {};
											obj[newVar] = value.color;
											return obj;
										}
									)
								),
							}}
							onClick={() => {
								regenerateMeshGradient();
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
					</Field>

					<Field label="" columns="columns-1">
						<RepeaterControl
							label={__('Colors', 'publisher-core')}
							className={controlClassNames(
								'mesh-gradient-background'
							)}
							popoverLabel={__(
								'Mesh Gradient Color',
								'publisher-color'
							)}
							Header={MeshGradientHeader}
							InnerComponents={MeshGradientFields}
							value={item['mesh-gradient-colors']}
							minItems={3}
							visibilityControl={false}
							defaultValue={{
								color: '',
							}}
							onValueChange={(newValue) => {
								// regenerate gradient if new item added or removed
								if (
									newValue.length !==
									item['mesh-gradient-colors'].length
								) {
									const meshGradient = generateMeshGradient(
										newValue.length
									);

									const newItem = {
										...item,
										'mesh-gradient': meshGradient.gradient,
									};

									newValue.map((item, index) => {
										if (
											newItem['mesh-gradient-colors']
												.length < newValue.length
										) {
											if (
												typeof newItem[
													'mesh-gradient-colors'
												][index] === 'undefined'
											) {
												newItem['mesh-gradient-colors'][
													index
												] = {
													color: meshGradient.colors[
														index
													],
												};
											}
										} else if (
											newItem['mesh-gradient-colors']
												.length > newValue.length
										) {
											newItem['mesh-gradient-colors'] =
												newItem[
													'mesh-gradient-colors'
												].slice(0, newValue.length);
										}
										return null;
									});

									changeItem(itemId, newItem);
								} else {
									changeItem(itemId, {
										...item,
										'mesh-gradient-colors': newValue,
									});
								}
							}}
						/>
					</Field>

					<ToggleSelectField
						label={__('Effect', 'publisher-core')}
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
						//
						value={item['mesh-gradient-attachment']}
						onValueChange={(newValue) =>
							changeItem(itemId, {
								...item,
								'mesh-gradient-attachment': newValue,
							})
						}
					/>
				</>
			)}
		</BaseControl>
	);
};

export default memo(Fields);
