/**
 * External dependencies
 */
import { Slot } from '@wordpress/components';
import { useEffect, memo, useRef } from '@wordpress/element';
import { select } from '@wordpress/data';

/**
 * Blockera dependencies
 */
import { prependPortal } from '@blockera/utils';

const Component = ({ clientId, sentinelRef, stickyWrapperRef }) => (
	<>
		<div
			ref={sentinelRef}
			className="blockera-block-card-sticky-sentinel"
		></div>
		<div
			ref={stickyWrapperRef}
			className="blockera-block-card-wrapper is-sticky-active"
		>
			<Slot name={`blockera-block-card-content-${clientId}`} />
		</div>

		<div className="blockera-block-edit-wrapper">
			<Slot name={`blockera-block-edit-content-${clientId}`} />
		</div>
	</>
);

export const BlockPartials = memo(({ clientId, isActive }) => {
	const stickyWrapperRef = useRef(null);
	const sentinelRef = useRef(null);

	// implementing block card sticky behavior
	useEffect(() => {
		const stickyWrapper = stickyWrapperRef.current;
		const sentinel = sentinelRef.current;

		if (!stickyWrapper || !sentinel) return;

		const observer = new IntersectionObserver(
			([entry]) => {
				// Add `is-stuck-monitoring` to prevent `is-stuck` atr first time
				if (stickyWrapper.classList.contains('is-stuck-monitoring')) {
					// Add `is-stuck` only when the sentinel is out of view (element has become sticky)
					if (!entry.isIntersecting) {
						stickyWrapper.classList.add('is-stuck');
					} else {
						stickyWrapper.classList.remove('is-stuck');
					}
				} else {
					stickyWrapper.classList.add('is-stuck-monitoring');
				}
			},
			{
				root: null, // relative to the viewport
				threshold: 0, // trigger when sentinel is fully out of view
			}
		);

		observer.observe(sentinel);

		return () => observer.disconnect();
	}, []);

	const { getActiveComplementaryArea } = select('core/interface');

	const activeComplementaryArea =
		getActiveComplementaryArea('core/edit-site');

	if ('edit-site/global-styles' === activeComplementaryArea) {
		return (
			<Component
				clientId={clientId}
				sentinelRef={sentinelRef}
				stickyWrapperRef={stickyWrapperRef}
			/>
		);
	}

	return prependPortal(
		<Component
			clientId={clientId}
			sentinelRef={sentinelRef}
			stickyWrapperRef={stickyWrapperRef}
		/>,
		document.querySelector('.block-editor-block-inspector'),
		{
			className: isActive ? 'blockera-active-block' : '',
		}
	);
});
