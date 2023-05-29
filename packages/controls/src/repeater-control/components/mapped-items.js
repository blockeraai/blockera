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
	const { repeaterItems: items } = useContext(RepeaterContext);

	const cachedValue = useMemo(
		() =>
			items.map((item, itemId) => (
				<RepeaterItem
					{...{ item, itemId }}
					key={`repeater-item-${itemId}`}
				/>
			)),
		[items]
	);

	return cachedValue;
};

export default MappedItems;
