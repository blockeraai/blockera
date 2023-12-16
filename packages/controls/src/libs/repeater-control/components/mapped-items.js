// @flow
/**
 * External dependencies
 */
import { useContext, useCallback } from '@wordpress/element';
import type { MixedElement } from 'react';

/**
 * Internal dependencies
 */
import RepeaterItem from './repeater-item';
import { RepeaterContext } from '../context';
import { isUndefined } from '@publisher/utils';

const MappedItems = (): MixedElement => {
	const { repeaterItems: items, repeaterId } = useContext(RepeaterContext);

	const render = useCallback(() => {
		const getUniqueId = (itemId: number) =>
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
