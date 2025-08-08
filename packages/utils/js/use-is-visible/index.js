/**
 * WordPress dependencies
 */
import { useEffect, useState } from '@wordpress/element';

export function useIsVisible(ref, options = {}) {
	const [isIntersecting, setIntersecting] = useState(false);

	useEffect(() => {
		if (!ref.current) {
			return;
		}

		// eslint-disable-next-line no-undef
		const observer = new IntersectionObserver(
			([entry]) => {
				setIntersecting(entry.isIntersecting);
			},
			{
				root: null, // Use viewport as root
				rootMargin: '50px', // Start loading 50px before element comes into view
				threshold: 0.1, // Trigger when 10% of element is visible
				...options, // Allow custom options to override defaults
			}
		);

		observer.observe(ref.current);

		return () => {
			observer.disconnect();
		};
	}, [ref, options]);

	return isIntersecting;
}
