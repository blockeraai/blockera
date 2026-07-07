// @flow

/**
 * External dependencies
 */
import { useRef } from '@wordpress/element';

/**
 * Blockera dependencies
 */
import { isEquals } from '@blockera/utils';

/**
 * Keep `blockeraUnsavedData` referentially stable when unrelated style keys change.
 *
 * @param {Object|void} unsavedData blockeraUnsavedData from panel style.
 * @return {Object|void} Stable unsaved data reference.
 */
export function useStableBlockeraUnsavedData(
	unsavedData: Object | void
): Object | void {
	const stableRef = useRef(unsavedData);

	if (!isEquals(stableRef.current, unsavedData)) {
		stableRef.current = unsavedData;
	}

	return stableRef.current;
}
