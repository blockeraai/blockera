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
import { isUndefined } from '@publisher/utils';

/**
 * Internal dependencies
 */
import RepeaterControl from '../../repeater-control';
import { useControlContext } from '../../context';
// Icons
import RepeatIcon from '../icons/repeat';
import RepeatXIcon from '../icons/repeat-x';
import RepeatYIcon from '../icons/repeat-y';
import RepeatNoIcon from '../icons/repeat-no';
import TypeImageIcon from '../icons/type-image';
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
import { default as RegenerateIcon } from '../icons/regenerate';
import { RepeaterContext } from '../../repeater-control/context';

/**
 * Providing mesh gradient colors details.
 *
 * @param {Object} object the data holder
 * @return {{}} retrieved object includes mesh gradient details
 */
function meshGradientProvider(object) {
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

const Fields = ({ itemId, item }) => {
	const {
		controlInfo: { name: controlId },
		dispatch: { changeRepeaterItem },
	} = useControlContext();
	const { repeaterId } = useContext(RepeaterContext);

	const linearGradientValue = /\((\d.*)deg,/im?.exec(item['linear-gradient']);

	function getControlId(id) {
		if (!/\[.*]/g.test(id)) {
			id = `.${id}`;
		}

		return isUndefined(repeaterId)
			? `[${itemId}]${id}`
			: `${repeaterId}[${itemId}]${id}`;
	}

	// fill new random mesh gradient with provider if it's empty
	if (!item['mesh-gradient']) {
		item = { ...item, ...meshGradientProvider(item) };
	}

	return (
		<div id={`repeater-item-${itemId}`}>
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
				id={getControlId('type')}
				value={item.type}
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
					<MediaImageField
						label=""
						columns="columns-1"
						settings={{
							type: 'text',
						}}
						//
						value={item.image}
						onValueChange={(image) => {
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
						id={getControlId('image-size')}
						value={item['image-size']}
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
					</ToggleSelectField>

					<PositionField
						topValue={item['image-position-top']}
						leftValue={item['image-position-left']}
						onValueChange={({ top, left }) => {
							changeRepeaterItem({
								controlId,
								repeaterId,
								itemId,
								value: {
									...item,
									'image-position-top': top || item.top,
									'image-position-left': left || item.left,
								},
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
						id={getControlId('[image-repeat]')}
						value={item['image-repeat']}
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
						id={getControlId('[image-attachment]')}
						value={item['image-attachment']}
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
					<GradientBarField
						value={item['linear-gradient']}
						onValueChange={(newValue) =>
							changeRepeaterItem({
								controlId,
								repeaterId,
								itemId,
								value: {
									...item,
									'linear-gradient': newValue,
								},
							})
						}
					/>

					<AnglePickerField
						label={__('Angel', 'publisher-core')}
						onChange={(newValue) => {
							// update linear gradient value
							changeRepeaterItem({
								controlId,
								repeaterId,
								itemId,
								value: {
									...item,
									'linear-gradient': item[
										'linear-gradient'
									].replace(
										/\(\d.*deg,/gim,
										`(${newValue}deg,`
									),
								},
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
						id={getControlId('[linear-gradient-repeat]')}
						value={item['linear-gradient-repeat']}
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
						id={getControlId('[linear-gradient-attachment]')}
						value={item['linear-gradient-attachment']}
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
					<GradientBarField
						//
						value={item['radial-gradient']}
						onValueChange={(newValue) =>
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

					<PositionField
						topValue={item['radial-gradient-position-top']}
						leftValue={item['radial-gradient-position-left']}
						onValueChange={({ top, left }) => {
							changeRepeaterItem({
								controlId,
								repeaterId,
								itemId,
								value: {
									...item,
									'radial-gradient-position-top':
										top || item.top,
									'radial-gradient-position-left':
										left || item.left,
								},
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
						id={getControlId('[radial-gradient-size]')}
						value={item['radial-gradient-size']}
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
						id={getControlId('[radial-gradient-repeat]')}
						value={item['radial-gradient-repeat']}
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
						id={getControlId('[radial-gradient-attachment]')}
						value={item['radial-gradient-attachment']}
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
					</Field>

					<Field label="" columns="columns-1">
						<RepeaterControl
							repeaterId={getControlId('[mesh-gradient-colors]')}
							label={__('Colors', 'publisher-core')}
							className={controlClassNames(
								'mesh-gradient-background'
							)}
							popoverLabel={__(
								'Mesh Gradient Color',
								'publisher-color'
							)}
							repeaterItemHeader={MeshGradientHeader}
							repeaterItemChildren={MeshGradientFields}
							minItems={3}
							actionButtonVisibility={false}
							defaultRepeaterItemValue={{
								color: '',
							}}
							onChange={(newValue) => {
								//Prevent to re-updating state when newValue with current value is equal!
								if (
									newValue[itemId]['mesh-gradient-colors'] ===
									item['mesh-gradient-colors']
								) {
									return;
								}

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
												isUndefined(
													newItem[
														'mesh-gradient-colors'
													][index]
												)
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

									changeRepeaterItem({
										controlId,
										repeaterId,
										itemId,
										value: newItem,
									});
								} else {
									changeRepeaterItem({
										controlId,
										repeaterId,
										itemId,
										value: {
											...item,
											'mesh-gradient-colors': newValue,
										},
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
						id={getControlId('[mesh-gradient-attachment]')}
						value={item['mesh-gradient-attachment']}
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
};

export default memo(Fields);
