// @flow
/**
 * External dependencies
 */
import type { MixedElement } from 'react';
import { useContext, useMemo } from '@wordpress/element';

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
	const {
		repeaterItems: items,
		repeaterId,
		defaultRepeaterItemValue,
	} = useContext(RepeaterContext);

	// Sorting repeater items based on "order" property value of each item.
	const sortedRepeaterItems = useMemo(
		() => getSortedRepeater(items),
		[items]
	);

	delete defaultRepeaterItemValue?.isOpen;

	const getUniqueId = (itemId: string | number) =>
		!isUndefined(repeaterId)
			? `${repeaterId}-repeater-item-${itemId}`
			: `repeater-item-${itemId}`;

	return sortedRepeaterItems.map(([itemId, item]) => (
		<RepeaterItem
			{...{
				item: {
					...defaultRepeaterItemValue,
					...item,
				},
				itemId,
			}}
			key={getUniqueId(itemId)}
		/>
	));
};

export default MappedItems;
