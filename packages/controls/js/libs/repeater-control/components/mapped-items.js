// @flow
/**
 * External dependencies
 */
import type { MixedElement } from 'react';
import { useContext, useCallback, useMemo } from '@wordpress/element';

/**
 * Blockera dependencies
 */
import { isUndefined } from '@blockera/utils';

/**
 * Internal dependencies
 */
import RepeaterItem from './repeater-item';
import { RepeaterContext } from '../context';
import { getSortedRepeater } from '../utils';

const MappedItems = (): MixedElement => {
	const { repeaterItems: items, repeaterId } = useContext(RepeaterContext);

	// Sorting repeater items based on "order" property value of each item.
	const sortedRepeaterItems = useMemo(
		() => getSortedRepeater(items),
		[items]
	);

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
