/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { memo } from '@wordpress/element';

/**
 * Publisher dependencies
 */
import { InputField, SelectField, ColorField } from '@publisher/fields';

/**
 * Internal dependencies
 */
import BaseControl from '../../base';

const BoxShadowFields = ({ item, itemId }) => {
	return (
		<BaseControl id={`repeater-item-${itemId}`}>
			<SelectField
				label={__('Position', 'publisher-core')}
				options={[
					{
						label: __('Outer', 'publisher-core'),
						value: 'outer',
					},
					{
						label: __('Inner', 'publisher-core'),
						value: 'inner',
					},
				]}
				//
				initValue="inside"
				attribute="type"
				repeaterAttributeIndex={itemId}
				repeaterAttribute="publisherBoxShadowItems"
			/>

			<InputField
				label={__('X', 'publisher-core')}
				settings={{
					type: 'css',
					unitType: 'box-shadow',
					range: true,
					min: -100,
					max: 100,
				}}
				//
				attribute="x"
				repeaterAttributeIndex={itemId}
				repeaterAttribute="publisherBoxShadowItems"
			/>

			<InputField
				label={__('Y', 'publisher-core')}
				settings={{
					type: 'css',
					unitType: 'box-shadow',
					range: true,
					min: -100,
					max: 100,
				}}
				//
				attribute="y"
				repeaterAttributeIndex={itemId}
				repeaterAttribute="publisherBoxShadowItems"
			/>

			<InputField
				label={__('Blur', 'publisher-core')}
				settings={{
					type: 'css',
					unitType: 'box-shadow',
					range: true,
					min: 0,
					max: 100,
				}}
				//
				attribute="blur"
				repeaterAttributeIndex={itemId}
				repeaterAttribute="publisherBoxShadowItems"
			/>

			<InputField
				label={__('Spread', 'publisher-core')}
				settings={{
					type: 'css',
					unitType: 'box-shadow',
					range: true,
					min: -100,
					max: 100,
				}}
				//
				attribute="spread"
				repeaterAttributeIndex={itemId}
				repeaterAttribute="publisherBoxShadowItems"
			/>

			<ColorField
				label={__('Color', 'publisher-core')}
				//
				attribute="color"
				repeaterAttributeIndex={itemId}
				repeaterAttribute="publisherBoxShadowItems"
			/>
		</BaseControl>
	);
};

export default memo(BoxShadowFields);
