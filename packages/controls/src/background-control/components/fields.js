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
} from '@publisher/fields';
import { HStack } from '@publisher/components';
import { updateControlValue } from '@publisher/controls';
import { BlockEditContext } from '@publisher/extensions';
/**
 * Internal dependencies
 */
import BaseControl from '../../base';
import { default as TypeImageIcon } from '../icons/type-image';
import { default as TypeLinearGradientIcon } from '../icons/type-linear-gradient';
import { default as TypeRadialGradientIcon } from '../icons/type-radial-gradient';
import { default as RepeatIcon } from '../icons/repeat';
import { default as RepeatXIcon } from '../icons/repeat-x';
import { default as RepeatYIcon } from '../icons/repeat-y';
import { default as RepeatNoIcon } from '../icons/repeat-no';
import { default as LinearGradientRepeatIcon } from '../icons/linear-gradient-repeat';
import { default as LinearGradientNoRepeatIcon } from '../icons/linear-gradient-no-repeat';
import { default as RadialGradientFarthestCornerIcon } from '../icons/radial-gradient-farthest-corner';
import { default as RadialGradientFarthestSideIcon } from '../icons/radial-gradient-farthest-side';
import { default as RadialGradientClosestCornerIcon } from '../icons/radial-gradient-closest-corner';
import { default as RadialGradientClosestSideIcon } from '../icons/radial-gradient-closest-side';
import { default as RadialGradientRepeatIcon } from '../icons/radial-gradient-repeat';
import { default as RadialGradientNoRepeatIcon } from '../icons/radial-gradient-no-repeat';

const Fields = ({ itemId, repeaterAttribute }) => {
	const { attributes, setAttributes } = useContext(BlockEditContext);

	const value =
		attributes[repeaterAttribute] && attributes[repeaterAttribute][itemId];

	const linearGradientValue = /\((\d.*)deg,/im?.exec(
		value['linear-gradient']
	);

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
				attribute="type"
				repeaterAttributeIndex={itemId}
				repeaterAttribute={repeaterAttribute}
			/>

			{value.type === 'image' && (
				<>
					<InputField
						label={__('Image', 'publisher-core')}
						settings={{
							type: 'text',
						}}
						//
						attribute="image"
						repeaterAttributeIndex={itemId}
						repeaterAttribute={repeaterAttribute}
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
						attribute="image-size"
						repeaterAttributeIndex={itemId}
						repeaterAttribute={repeaterAttribute}
					>
						{value['image-size'] === 'custom' && (
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
									initValue="1auto"
									attribute="image-size-width"
									repeaterAttributeIndex={itemId}
									repeaterAttribute={repeaterAttribute}
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
									initValue="1auto"
									attribute="image-size-height"
									repeaterAttributeIndex={itemId}
									repeaterAttribute={repeaterAttribute}
								/>
							</HStack>
						)}
					</ToggleSelectField>

					<PositionField
						attributeTopField="image-position-top"
						attributeLeftField="image-position-left"
						repeaterAttributeIndex={itemId}
						repeaterAttribute={repeaterAttribute}
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
						attribute="image-repeat"
						repeaterAttributeIndex={itemId}
						repeaterAttribute={repeaterAttribute}
					/>

					<ToggleSelectField
						label={__('Attachment', 'publisher-core')}
						options={[
							{
								label: __('Scroll', 'publisher-core'),
								value: 'scroll',
							},
							{
								label: __('Fixed', 'publisher-core'),
								value: 'fixed',
							},
						]}
						//
						initValue="scroll"
						attribute="image-attachment"
						repeaterAttributeIndex={itemId}
						repeaterAttribute={repeaterAttribute}
					/>
				</>
			)}

			{value.type === 'linear-gradient' && (
				<>
					<GradientBarField
						initValue="linear-gradient(90deg,#009efa 10%,#e52e00 90%)"
						attribute="linear-gradient"
						repeaterAttributeIndex={itemId}
						repeaterAttribute={repeaterAttribute}
					/>

					<AnglePickerField
						label={__('Angel', 'publisher-core')}
						onChange={(newValue) => {
							// update linear gradient value
							updateControlValue(
								value['linear-gradient'].replace(
									/\(\d.*deg,/gim,
									`(${newValue}deg,`
								),
								'linear-gradient',
								repeaterAttribute,
								itemId,
								attributes,
								setAttributes
							);
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
						attribute="linear-gradient-repeat"
						repeaterAttributeIndex={itemId}
						repeaterAttribute={repeaterAttribute}
					/>
				</>
			)}

			{value.type === 'radial-gradient' && (
				<>
					<GradientBarField
						//
						initValue="radial-gradient(rgb(0,159,251) 0%,rgb(229,46,0) 100%)"
						attribute="radial-gradient"
						repeaterAttributeIndex={itemId}
						repeaterAttribute={repeaterAttribute}
					/>

					<PositionField
						attributeTopField="radial-gradient-position-top"
						attributeLeftField="radial-gradient-position-left"
						repeaterAttributeIndex={itemId}
						repeaterAttribute={repeaterAttribute}
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
						attribute="radial-gradient-size"
						repeaterAttributeIndex={itemId}
						repeaterAttribute={repeaterAttribute}
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
						attribute="radial-gradient-repeat"
						repeaterAttributeIndex={itemId}
						repeaterAttribute={repeaterAttribute}
					/>
				</>
			)}
		</BaseControl>
	);
};

export default memo(Fields);
