/**
 * WordPress dependencies
 */
import { useMemo, useContext } from '@wordpress/element';
import { __experimentalSpacer as Spacer } from '@wordpress/components';

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
				<Spacer key={`repeater-item-${itemId}`}>
					<RepeaterItem {...{ item, itemId }} />
				</Spacer>
			)),
		[items]
	);

	return cachedValue;
};

export default MappedItems;
