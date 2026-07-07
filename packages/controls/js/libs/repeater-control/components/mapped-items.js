// @flow
/**
 * External dependencies
 */
import type { MixedElement } from 'react';
import { __ } from '@wordpress/i18n';
import { useContext, useMemo } from '@wordpress/element';

/**
 * Blockera dependencies
 */
import { controlInnerClassNames } from '@blockera/classnames';
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
		actionButtonsType,
		shouldRenderRepeaterItem,
		resolveRepeaterItemSize,
	} = useContext(RepeaterContext);

	// Sorting repeater items based on "order" property value of each item.
	const sortedRepeaterItems = useMemo(
		() => getSortedRepeater(items),
		[items]
	);

	const visibleRepeaterItems = useMemo(() => {
		if (typeof shouldRenderRepeaterItem !== 'function') {
			return sortedRepeaterItems;
		}
		return sortedRepeaterItems.filter(([itemId, item]) =>
			shouldRenderRepeaterItem(String(itemId), item)
		);
	}, [sortedRepeaterItems, shouldRenderRepeaterItem]);

	delete defaultRepeaterItemValue?.isOpen;

	const getStableItemKey = (
		item: { order?: number | string },
		sortedIndex: number
	) => {
		// Keep row instances stable across rename-by-type (order slot is unchanged).
		const stableSegment =
			typeof item?.order === 'number' || typeof item?.order === 'string'
				? `order-${item.order}`
				: `order-${sortedIndex}`;

		return !isUndefined(repeaterId)
			? `${repeaterId}-repeater-item-${stableSegment}`
			: `repeater-item-${stableSegment}`;
	};

	if (
		visibleRepeaterItems.length === 0 &&
		sortedRepeaterItems.length > 0 &&
		typeof shouldRenderRepeaterItem === 'function'
	) {
		return (
			<div
				className={controlInnerClassNames('repeater-filter-empty')}
				style={{ opacity: 0.5, fontSize: '12px' }}
			>
				{__('No variables match your search.', 'blockera')}
			</div>
		);
	}

	return visibleRepeaterItems.map(([itemId, item], sortedIndex) => {
		const resolvedSize =
			typeof resolveRepeaterItemSize === 'function'
				? resolveRepeaterItemSize(String(itemId), item)
				: 'full';

		return (
			<RepeaterItem
				{...{
					item: {
						...defaultRepeaterItemValue,
						...item,
					},
					itemId,
					actionButtonsType,
					size: resolvedSize === 'small' ? 'small' : 'full',
				}}
				key={getStableItemKey(item, sortedIndex)}
			/>
		);
	});
};

export default MappedItems;
