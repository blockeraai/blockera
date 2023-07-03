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
import { RepeaterContext } from '../../../repeater-control/context';
import { ColorPickerControl } from '../../../index';

const Fields = ({ itemId, item }) => {
	const { changeItem } = useContext(RepeaterContext);

	return (
		<div id={`repeater-item-${itemId}`}>
			<ColorPickerControl
				isPopover={false}
				value={item.color}
				onChange={(newValue) =>
					changeItem(itemId, {
						...item,
						color: newValue,
					})
				}
			/>
		</div>
	);
};

export default memo(Fields);
