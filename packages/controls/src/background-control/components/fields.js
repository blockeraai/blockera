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
} from '@publisher/fields';
import { HStack } from '@publisher/components';

/**
 * Internal dependencies
 */
import BaseControl from '../../base';
import RepeatIcon from '../icons/repeat';
import RepeatXIcon from '../icons/repeat-x';
import RepeatYIcon from '../icons/repeat-y';
import RepeatNoIcon from '../icons/repeat-no';
import TypeImageIcon from '../icons/type-image';
import { RepeaterContext } from '../../repeater-control/context';
import TypeLinearGradientIcon from '../icons/type-linear-gradient';
import TypeRadialGradientIcon from '../icons/type-radial-gradient';
import LinearGradientRepeatIcon from '../icons/linear-gradient-repeat';
import RadialGradientRepeatIcon from '../icons/radial-gradient-repeat';
import LinearGradientNoRepeatIcon from '../icons/linear-gradient-no-repeat';
import RadialGradientNoRepeatIcon from '../icons/radial-gradient-no-repeat';
import RadialGradientClosestSideIcon from '../icons/radial-gradient-closest-side';
import RadialGradientFarthestSideIcon from '../icons/radial-gradient-farthest-side';
import RadialGradientClosestCornerIcon from '../icons/radial-gradient-closest-corner';
import RadialGradientFarthestCornerIcon from '../icons/radial-gradient-farthest-corner';

const Fields = ({ itemId, item }) => {
	const { changeItem } = useContext(RepeaterContext);

	const linearGradientValue = /\((\d.*)deg,/im?.exec(item['linear-gradient']);

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
				]}
				//
				initValue="image"
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
						initValue="custom"
						value={item['image-size']}
						onValueChange={(size) =>
							changeItem(itemId, { ...item, 'image-size': size })
						}
					>
						{item['image-size'] === 'custom' && (
							<HStack spacing="2" justify="space-around">
								<InputField
									label={__('Width', 'publisher-core')}
									columns="columns-1"
									className="control-first label-center small-gap"
									settings={{
										type: 'css',
										unitType: 'background-size',
									}}
									//
									initValue="auto"
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
									initValue="auto"
									value={item['image-size-height']}
									onValueChange={(height) =>
										changeItem(itemId, {
											...item,
											'image-size-height': height,
										})
									}
								/>
							</HStack>
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
						initValue="repeat"
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
						initValue="scroll"
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
						initValue="linear-gradient(90deg,#009efa 10%,#e52e00 90%)"
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
						initValue="no-repeat"
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
						initValue="scroll"
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
						initValue="radial-gradient(rgb(0,159,251) 0%,rgb(229,46,0) 100%)"
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
						initValue="farthest-corner"
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
						initValue="no-repeat"
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
						initValue="scroll"
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
		</BaseControl>
	);
};

export default memo(Fields);
