/**
 * WordPress dependencies
 */
import { useEffect, useRef } from '@wordpress/element';

export function useLateEffect(func, deps) {
	const didMount = useRef(false);

	useEffect(() => {
		if (didMount.current) func();
		else didMount.current = true;
	}, deps);
}
