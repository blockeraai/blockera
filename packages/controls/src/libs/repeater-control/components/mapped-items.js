// @flow
/**
 * External dependencies
 */
import type { MixedElement } from 'react';
import { useContext, useCallback, useMemo } from '@wordpress/element';

/**
 * Publisher dependencies
 */
import { isUndefined } from '@publisher/utils';

/**
 * Internal dependencies
 */
import RepeaterItem from './repeater-item';
import { RepeaterContext } from '../context';
import { getSortedRepeater } from '../utils';
import { Button } from '@publisher/components';

const MappedItems = (): MixedElement => {
	const {
		repeaterItems: items,
		repeaterId,
		emptyItemPlaceholder,
	} = useContext(RepeaterContext);

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
		if (!items.length && emptyItemPlaceholder) {
			return (
				<Button contentAlign="center" size="input" disabled={true}>
					{emptyItemPlaceholder}
				</Button>
			);
		}

		// Convert the sorted array back to an object
		return sortedRepeaterItems.map(([itemId, item]) => (
			<RepeaterItem {...{ item, itemId }} key={getUniqueId(itemId)} />
		));
	}, [sortedRepeaterItems, repeaterId]);

	return render();
};

export default MappedItems;
