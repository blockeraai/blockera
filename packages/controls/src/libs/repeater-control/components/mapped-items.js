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
import { Button } from '@publisher/components';

const MappedItems = (): MixedElement => {
	const {
		repeaterItems: items,
		repeaterId,
		emptyItemPlaceholder,
	} = useContext(RepeaterContext);

	const render = useCallback(() => {
		const getUniqueId = (itemId: number) =>
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

		return items.map((item, itemId) => (
			<RepeaterItem {...{ item, itemId }} key={getUniqueId(itemId)} />
		));
	}, [items, repeaterId]);

	return render();
};

export default MappedItems;
