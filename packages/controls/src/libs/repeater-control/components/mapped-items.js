// @flow
/**
 * External dependencies
 */
import type { MixedElement } from 'react';
import { useContext, useCallback, useMemo } from '@wordpress/element';

/**
 * Internal dependencies
 */
import RepeaterItem from './repeater-item';
import { RepeaterContext } from '../context';
import { isUndefined } from '@publisher/utils';

const MappedItems = (): MixedElement => {
	const { repeaterItems: items, repeaterId } = useContext(RepeaterContext);

	// Sorting repeater items based on "order" property value of each item.
	const sortedRepeaterItems = useMemo(() => {
		const dataArray = Object.entries(items);

		dataArray.sort(([, a], [, b]) => (a.order || 0) - (b.order || 0));

		return dataArray;
	}, [items]);

	const render = useCallback(() => {
		const getUniqueId = (itemId: string | number) =>
			!isUndefined(repeaterId)
				? `${repeaterId}-repeater-item-${itemId}`
				: `repeater-item-${itemId}`;

		// Convert the sorted array back to an object
		return sortedRepeaterItems.map(([itemId, item]) => (
			<RepeaterItem {...{ item, itemId }} key={getUniqueId(itemId)} />
		));
	}, [sortedRepeaterItems, repeaterId]);

	return render();
};

export default MappedItems;
