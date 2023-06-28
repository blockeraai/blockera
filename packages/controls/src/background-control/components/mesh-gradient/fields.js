/**
 * WordPress dependencies
 */
import { memo, useContext } from '@wordpress/element';

/**
 * Publisher dependencies
 */

/**
 * Internal dependencies
 */
import BaseControl from '../../../base';
import { RepeaterContext } from '../../../repeater-control/context';
import { ColorPicker } from '../../../index';

const Fields = ({ itemId, item }) => {
	const { changeItem } = useContext(RepeaterContext);

	return (
		<BaseControl id={`repeater-item-${itemId}`}>
			<ColorPicker
				value={item.color}
				onChange={(newValue) =>
					changeItem(itemId, {
						...item,
						color: newValue,
					})
				}
			/>
		</BaseControl>
	);
};

export default memo(Fields);
