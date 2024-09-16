/**
 * External dependencies
 */
import { Slot, Fill } from '@wordpress/components';
import { useEffect, memo, useRef } from '@wordpress/element';

/**
 * Blockera dependencies
 */
import { prependPortal } from '@blockera/utils';

/**
 * Internal dependencies
 */
import { BlockDropdownAllMenu } from './block-dropdown-all-menu';

export const BlockPartials = memo(({ clientId, isActive, setActive }) => {
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

	return prependPortal(
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

			<Fill
				key={`${clientId}-card-menu`}
				name={'blockera-block-card-children'}
			>
				<div className={'blockera-dropdown-menu'}>
					<BlockDropdownAllMenu
						{...{
							isActive,
							setActive,
						}}
					/>
				</div>
			</Fill>
		</>,
		document.querySelector('.block-editor-block-inspector')
	);
});
