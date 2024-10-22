// @flow

/**
 * Blockera dependencies
 */
import { useRef, useEffect } from '@wordpress/element';

/**
 * A `React.useEffect` that will not run on the first render.
 * Source:
 * https://github.com/reakit/reakit/blob/HEAD/packages/reakit-utils/src/useUpdateEffect.ts
 *
 * @param {Function} effect
 * @param {Array} deps
 */
export const useUpdateEffect = (effect: () => void, deps: Array<any>): void => {
	const mounted = useRef(false);
	useEffect(() => {
		if (mounted.current) {
			return effect();
		}
		mounted.current = true;
		return undefined;
		// Disable reasons:
		// 1. This hook needs to pass a dep list that isn't an array literal
		// 2. `effect` is missing from the array, and will need to be added carefully to avoid additional warnings
		// see https://github.com/WordPress/gutenberg/pull/41166
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, deps);
};

export default useUpdateEffect;
