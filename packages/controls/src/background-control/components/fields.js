/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { memo, useContext } from '@wordpress/element';

/**
 * Publisher dependencies
 */
import { Field, ToggleSelectField, InputField } from '@publisher/fields';
import { HStack, VStack } from '@publisher/components';
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

const Fields = ({ itemId, repeaterAttribute }) => {
	const { attributes } = useContext(BlockEditContext);

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

			{attributes[repeaterAttribute][itemId].type === 'image' && (
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
						attribute="background-image-size"
						repeaterAttributeIndex={itemId}
						repeaterAttribute={repeaterAttribute}
					>
						{attributes[repeaterAttribute][itemId][
							'background-image-size'
						] === 'custom' && (
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
									attribute="background-image-size-width"
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
									attribute="background-image-size-height"
									repeaterAttributeIndex={itemId}
									repeaterAttribute={repeaterAttribute}
								/>
							</HStack>
						)}
					</ToggleSelectField>

					<Field label={__('Position', 'publisher-core')}>
						<HStack spacing="2" justify="space-around">
							<span>Position Picker</span>

							<VStack spacing="2" justify="space-around">
								<InputField
									label={__('Left', 'publisher-core')}
									settings={{
										type: 'css',
										unitType: 'background-position',
									}}
									className="no-gap"
									//
									initValue="0%"
									attribute="background-image-position-left"
									repeaterAttributeIndex={itemId}
									repeaterAttribute={repeaterAttribute}
								/>

								<InputField
									label={__('Top', 'publisher-core')}
									settings={{
										type: 'css',
										unitType: 'background-position',
									}}
									className="no-gap"
									//
									initValue="0%"
									attribute="background-image-position-top"
									repeaterAttributeIndex={itemId}
									repeaterAttribute={repeaterAttribute}
								/>
							</VStack>
						</HStack>
					</Field>

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
						attribute="background-image-repeat"
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
						attribute="background-image-attachment"
						repeaterAttributeIndex={itemId}
						repeaterAttribute={repeaterAttribute}
					/>
				</>
			)}
		</BaseControl>
	);
};

export default memo(Fields);
