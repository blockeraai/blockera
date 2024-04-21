/**
 * Blockera dependencies
 */
import { useEffect, useRef } from '@wordpress/element';

export function useOutsideClick({ onOutsideClick }) {
	const containerRef = useRef();

	useEffect(() => {
		const handleOutsideClick = (event) => {
			if (
				containerRef.current &&
				!containerRef.current?.contains(event.target)
			) {
				onOutsideClick();
			}
		};

		// Add an event listener for clicks on the entire document
		document.addEventListener('click', handleOutsideClick);

		return () => {
			// Clean up the event listener when the component unmounts
			document.removeEventListener('click', handleOutsideClick);
		};
	}, [containerRef, onOutsideClick]);

	return {
		ref: containerRef,
	};
}
