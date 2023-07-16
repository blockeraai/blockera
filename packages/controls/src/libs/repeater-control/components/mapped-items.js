/**
 * WordPress dependencies
 */
import { useContext, useCallback } from '@wordpress/element';

/**
 * Internal dependencies
 */
import RepeaterItem from './repeater-item';
import { RepeaterContext } from '../context';
import { isUndefined } from '@publisher/utils';

const MappedItems = () => {
	const { repeaterItems: items, repeaterId } = useContext(RepeaterContext);

	const render = useCallback(() => {
		const getUniqueId = (itemId) =>
			!isUndefined(repeaterId)
				? `${repeaterId}-repeater-item-${itemId}`
				: `repeater-item-${itemId}`;

		return items.map((item, itemId) => (
			<RepeaterItem {...{ item, itemId }} key={getUniqueId(itemId)} />
		));
	}, [items, repeaterId]);

	return render();
};

export default MappedItems;
