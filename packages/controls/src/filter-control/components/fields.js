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
import { getTypeOptions } from '../utils';
import { getRepeaterItemTypeProps } from '../../utils';
import { RepeaterContext } from '../../repeater-control/context';

const Fields = ({ itemId, item, repeaterAttribute }) => {
	const { attributes } = useContext(BlockEditContext);
	const { changeItem } = useContext(RepeaterContext);

	return (
		<BaseControl id={`repeater-item-${itemId}`}>
			<SelectField
				label={__('Type', 'publisher-core')}
				options={getTypeOptions()}
				//
				initValue="blur"
				{...getRepeaterItemTypeProps({ itemId, item, changeItem })}
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
					value={item.blur}
					onValueChange={(blur) =>
						changeItem(itemId, { ...item, blur })
					}
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
						value={item['drop-shadow-x']}
						onValueChange={(newValue) =>
							changeItem(itemId, {
								...item,
								'drop-shadow-x': newValue,
							})
						}
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
						value={item['drop-shadow-y']}
						onValueChange={(newValue) =>
							changeItem(itemId, {
								...item,
								'drop-shadow-y': newValue,
							})
						}
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
						value={item['drop-shadow-blur']}
						onValueChange={(newValue) =>
							changeItem(itemId, {
								...item,
								'drop-shadow-blur': newValue,
							})
						}
					/>

					<ColorField
						label={__('Color', 'publisher-core')}
						//
						value={item['drop-shadow-color']}
						onValueChange={(newValue) =>
							changeItem(itemId, {
								...item,
								'drop-shadow-color': newValue,
							})
						}
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
					value={item.brightness}
					onValueChange={(brightness) =>
						changeItem(itemId, {
							...item,
							brightness,
						})
					}
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
					value={item.contrast}
					onValueChange={(contrast) =>
						changeItem(itemId, {
							...item,
							contrast,
						})
					}
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
					value={item['hue-rotate']}
					onValueChange={(newValue) =>
						changeItem(itemId, {
							...item,
							'hue-rotate': newValue,
						})
					}
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
					value={item.saturate}
					onValueChange={(saturate) =>
						changeItem(itemId, {
							...item,
							saturate,
						})
					}
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
					value={item.grayscale}
					onValueChange={(grayscale) =>
						changeItem(itemId, {
							...item,
							grayscale,
						})
					}
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
					value={item.invert}
					onValueChange={(invert) =>
						changeItem(itemId, {
							...item,
							invert,
						})
					}
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
					value={item.sepia}
					onValueChange={(sepia) =>
						changeItem(itemId, {
							...item,
							sepia,
						})
					}
				/>
			)}
		</BaseControl>
	);
};

export default memo(Fields);
