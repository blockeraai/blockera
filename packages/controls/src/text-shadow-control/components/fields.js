/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { memo, useContext } from '@wordpress/element';

/**
 * Publisher dependencies
 */
import { InputField, ColorField } from '@publisher/fields';

/**
 * Internal dependencies
 */
import BaseControl from '../../base';
import { RepeaterContext } from '../../repeater-control/context';

const Fields = ({ itemId, item }) => {
	const { changeItem } = useContext(RepeaterContext);

	return (
		<BaseControl id={`repeater-item-${itemId}`}>
			<InputField
				label={__('X', 'publisher-core')}
				settings={{
					type: 'css',
					unitType: 'text-shadow',
					range: true,
					min: -100,
					max: 100,
				}}
				//
				value={item.x}
				onChange={(x) => changeItem(itemId, { ...item, x })}
			/>

			<InputField
				label={__('Y', 'publisher-core')}
				settings={{
					type: 'css',
					unitType: 'text-shadow',
					range: true,
					min: -100,
					max: 100,
				}}
				//
				value={item.y}
				onChange={(y) => changeItem(itemId, { ...item, y })}
			/>

			<InputField
				label={__('Blur', 'publisher-core')}
				settings={{
					type: 'css',
					unitType: 'text-shadow',
					range: true,
					min: 0,
					max: 100,
				}}
				//
				value={item.blur}
				onChange={(blur) => changeItem(itemId, { ...item, blur })}
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
