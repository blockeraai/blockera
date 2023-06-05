/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { memo } from '@wordpress/element';

/**
 * Publisher dependencies
 */
import { InputField, ToggleSelectField, ColorField } from '@publisher/fields';

/**
 * Internal dependencies
 */
import BaseControl from '../../base';

const Fields = ({ itemId, repeaterAttribute }) => {
	return (
		<BaseControl id={`repeater-item-${itemId}`}>
			<ToggleSelectField
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
				repeaterAttribute={repeaterAttribute}
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
				repeaterAttribute={repeaterAttribute}
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
				repeaterAttribute={repeaterAttribute}
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
				repeaterAttribute={repeaterAttribute}
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
				repeaterAttribute={repeaterAttribute}
			/>

			<ColorField
				label={__('Color', 'publisher-core')}
				//
				attribute="color"
				repeaterAttributeIndex={itemId}
				repeaterAttribute={repeaterAttribute}
			/>
		</BaseControl>
	);
};

export default memo(Fields);
