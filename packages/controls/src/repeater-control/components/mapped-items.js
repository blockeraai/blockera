/**
 * WordPress dependencies
 */
import { useMemo } from '@wordpress/element';
import { __experimentalSpacer as Spacer } from '@wordpress/components';

/**
 * Internal dependencies
 */
import RepeaterItem from './repeater-item';

const MappedItems = ({ items }) => {
	const cachedValue = useMemo(
		() =>
			items.map((item, itemId) => (
				<Spacer key={`repeater-item-${itemId}`}>
					<RepeaterItem {...{ item, itemId }} />
				</Spacer>
			)),
		[items]
	);

	return cachedValue;
};

export default MappedItems;
