/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { memo, useContext } from '@wordpress/element';

/**
 * Publisher dependencies
 */
import { InputField, SelectField, ColorField } from '@publisher/fields';
import { BlockEditContext } from '@publisher/extensions';
/**
 * Internal dependencies
 */
import BaseControl from '../../base';
import { getTypeOptions } from './../utils';

const Fields = ({ itemId, repeaterAttribute }) => {
	const { attributes } = useContext(BlockEditContext);

	return (
		<BaseControl id={`repeater-item-${itemId}`}>
			<SelectField
				label={__('Type', 'publisher-core')}
				options={getTypeOptions()}
				//
				initValue="blur"
				attribute="type"
				repeaterAttributeIndex={itemId}
				repeaterAttribute={repeaterAttribute}
			/>

			{attributes[repeaterAttribute][itemId].type === 'blur' && (
				<InputField
					label={__('Blur', 'publisher-core')}
					settings={{
						type: 'css',
						unitType: 'essential',
						range: true,
						min: 0,
						max: 50,
					}}
					//
					attribute="blur"
					repeaterAttributeIndex={itemId}
					repeaterAttribute={repeaterAttribute}
				/>
			)}

			{attributes[repeaterAttribute][itemId].type === 'drop-shadow' && (
				<>
					<InputField
						label={__('X', 'publisher-core')}
						settings={{
							type: 'css',
							unitType: 'essential',
							range: true,
							min: -100,
							max: 100,
						}}
						//
						attribute="drop-shadow-x"
						repeaterAttributeIndex={itemId}
						repeaterAttribute={repeaterAttribute}
					/>

					<InputField
						label={__('Y', 'publisher-core')}
						settings={{
							type: 'css',
							unitType: 'essential',
							range: true,
							min: -100,
							max: 100,
						}}
						//
						attribute="drop-shadow-y"
						repeaterAttributeIndex={itemId}
						repeaterAttribute={repeaterAttribute}
					/>

					<InputField
						label={__('Blur', 'publisher-core')}
						settings={{
							type: 'css',
							unitType: 'essential',
							range: true,
							min: 0,
							max: 100,
						}}
						//
						attribute="drop-shadow-blur"
						repeaterAttributeIndex={itemId}
						repeaterAttribute={repeaterAttribute}
					/>

					<ColorField
						label={__('Color', 'publisher-core')}
						//
						attribute="drop-shadow-color"
						repeaterAttributeIndex={itemId}
						repeaterAttribute={repeaterAttribute}
					/>
				</>
			)}

			{attributes[repeaterAttribute][itemId].type === 'brightness' && (
				<InputField
					label={__('Brightness', 'publisher-core')}
					settings={{
						type: 'css',
						unitType: 'percent',
						range: true,
						min: 0,
						max: 200,
					}}
					//
					attribute="brightness"
					repeaterAttributeIndex={itemId}
					repeaterAttribute={repeaterAttribute}
				/>
			)}

			{attributes[repeaterAttribute][itemId].type === 'contrast' && (
				<InputField
					label={__('Contrast', 'publisher-core')}
					settings={{
						type: 'css',
						unitType: 'percent',
						range: true,
						min: 0,
						max: 200,
					}}
					//
					attribute="contrast"
					repeaterAttributeIndex={itemId}
					repeaterAttribute={repeaterAttribute}
				/>
			)}

			{attributes[repeaterAttribute][itemId].type === 'hue-rotate' && (
				<InputField
					label={__('Hue Rotate', 'publisher-core')}
					settings={{
						type: 'css',
						unitType: 'angle',
						range: true,
						min: -365,
						max: 365,
					}}
					//
					attribute="hue-rotate"
					repeaterAttributeIndex={itemId}
					repeaterAttribute={repeaterAttribute}
				/>
			)}

			{attributes[repeaterAttribute][itemId].type === 'saturate' && (
				<InputField
					label={__('Saturation', 'publisher-core')}
					settings={{
						type: 'css',
						unitType: 'percent',
						range: true,
						min: 0,
						max: 200,
					}}
					//
					attribute="saturate"
					repeaterAttributeIndex={itemId}
					repeaterAttribute={repeaterAttribute}
				/>
			)}

			{attributes[repeaterAttribute][itemId].type === 'grayscale' && (
				<InputField
					label={__('Grayscale', 'publisher-core')}
					settings={{
						type: 'css',
						unitType: 'percent',
						range: true,
						min: 0,
						max: 100,
					}}
					//
					attribute="grayscale"
					repeaterAttributeIndex={itemId}
					repeaterAttribute={repeaterAttribute}
				/>
			)}

			{attributes[repeaterAttribute][itemId].type === 'invert' && (
				<InputField
					label={__('Invert', 'publisher-core')}
					settings={{
						type: 'css',
						unitType: 'percent',
						range: true,
						min: 0,
						max: 100,
					}}
					//
					attribute="invert"
					repeaterAttributeIndex={itemId}
					repeaterAttribute={repeaterAttribute}
				/>
			)}

			{attributes[repeaterAttribute][itemId].type === 'sepia' && (
				<InputField
					label={__('Sepia', 'publisher-core')}
					settings={{
						type: 'css',
						unitType: 'percent',
						range: true,
						min: 0,
						max: 100,
					}}
					//
					attribute="sepia"
					repeaterAttributeIndex={itemId}
					repeaterAttribute={repeaterAttribute}
				/>
			)}
		</BaseControl>
	);
};

export default memo(Fields);
