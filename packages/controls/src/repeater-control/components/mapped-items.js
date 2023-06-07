/**
 * WordPress dependencies
 */
import { useMemo, useContext } from '@wordpress/element';

/**
 * Internal dependencies
 */
import RepeaterItem from './repeater-item';
import { RepeaterContext } from '../context';

const MappedItems = () => {
	const { repeaterItems: items, repeaterAttribute } =
		useContext(RepeaterContext);

	return useMemo(
		() =>
			items.map((item, itemId) => (
				<RepeaterItem
					{...{ item, itemId, repeaterAttribute }}
					key={`repeater-item-${itemId}`}
				/>
			)),
		[items, repeaterAttribute]
	);
};

export default MappedItems;
