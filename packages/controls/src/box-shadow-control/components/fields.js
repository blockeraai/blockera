/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { memo, useContext } from '@wordpress/element';

/**
 * Publisher dependencies
 */
import { InputField, ToggleSelectField, ColorField } from '@publisher/fields';

/**
 * Internal dependencies
 */
import BaseControl from '../../base';
import { RepeaterContext } from '../../repeater-control/context';

const Fields = ({ itemId, item }) => {
	const { changeItem } = useContext(RepeaterContext);

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
				value={item.type}
				onValueChange={(type) => changeItem(itemId, { ...item, type })}
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
				value={item.x}
				onValueChange={(x) => changeItem(itemId, { ...item, x })}
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
				value={item.y}
				onValueChange={(y) => changeItem(itemId, { ...item, y })}
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
				value={item.blur}
				onValueChange={(blur) => changeItem(itemId, { ...item, blur })}
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
				value={item.spread}
				onValueChange={(spread) =>
					changeItem(itemId, { ...item, spread })
				}
			/>

			<ColorField
				label={__('Color', 'publisher-core')}
				//
				value={item.color}
				onValueChange={(color) =>
					changeItem(itemId, { ...item, color })
				}
			/>
		</BaseControl>
	);
};

export default memo(Fields);
