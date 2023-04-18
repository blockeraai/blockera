/**
 * WordPress dependencies
 */
import { useMemo } from '@wordpress/element';
import { __experimentalSpacer as Spacer } from '@wordpress/components';

/**
 * Internal dependencies
 */
import BoxShadowFields from './fields';

function BoxShadowItems({ items }) {
	const cachedValue = useMemo(
		() =>
			items.map((item, itemId) => (
				<Spacer key={`box-shadow-item-${itemId}`}>
					<BoxShadowFields
						{...{ item: { ...item, isPanelOpen: false }, itemId }}
					/>
				</Spacer>
			)),
		[items]
	);

	return cachedValue;
}

export default BoxShadowItems;
