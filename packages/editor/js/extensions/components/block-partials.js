/**
 * External dependencies
 */
import { Slot, SlotFillProvider } from '@wordpress/components';
import { useEffect, memo, useRef } from '@wordpress/element';
import { select } from '@wordpress/data';

/**
 * Blockera dependencies
 */
import { getBlockeraBlockInjectedSlotName } from '@blockera/controls';
import { PrependPortal } from '@blockera/utils';
import { getDualGlobalStylesSelector } from '@blockera/global-styles-ui/panel-override/selectors';
import {
	useBlockInspectorContainer,
	isBlockInspectorContainerReady,
} from './use-block-inspector-container';

/**
 * Inspector card shell (portaled into .block-editor-block-inspector).
 * - Card: Slot/Fill pair blockera-block-card-content-{clientId}
 * - Edit wrapper: Slot for global styles; empty in block inspector (panels use InspectorControls)
 */
const BlockInspectorCard = ({
	clientId,
	sentinelRef,
	stickyWrapperRef,
	inspectorEdit,
}) => (
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

		<div className="blockera-block-edit-wrapper">{inspectorEdit}</div>

		<div className="blockera-block-injected-slot-host" aria-hidden="true">
			<Slot name={getBlockeraBlockInjectedSlotName(clientId)} />
		</div>
	</>
);

const BlockInspectorCardPortal = ({
	clientId,
	isActive,
	inspectorContainer,
	sentinelRef,
	stickyWrapperRef,
}) => (
	<PrependPortal
		container={inspectorContainer}
		className={isActive ? 'blockera-active-block' : ''}
	>
		<BlockInspectorCard
			clientId={clientId}
			sentinelRef={sentinelRef}
			stickyWrapperRef={stickyWrapperRef}
		/>
	</PrependPortal>
);

/**
 * Global styles panel: inline card + Slot/Fill (same tree as before SlotFillProvider lived in BlockBase).
 */
const GlobalStylesBlockPartials = ({
	clientId,
	children,
	sentinelRef,
	stickyWrapperRef,
}) => (
	<SlotFillProvider>
		<BlockInspectorCard
			clientId={clientId}
			sentinelRef={sentinelRef}
			stickyWrapperRef={stickyWrapperRef}
			inspectorEdit={
				<Slot name={`blockera-block-edit-content-${clientId}`} />
			}
		/>
		{children}
	</SlotFillProvider>
);

export const BlockPartials = memo(
	({
		clientId,
		isActive,
		children,
		inspectorEdit,
		insideBlockInspector = false,
	}) => {
		const stickyWrapperRef = useRef(null);
		const sentinelRef = useRef(null);
		const inspectorContainer = useBlockInspectorContainer();

		// implementing block card sticky behavior
		useEffect(() => {
			const stickyWrapper = stickyWrapperRef.current;
			const sentinel = sentinelRef.current;

			if (!stickyWrapper || !sentinel) {
				return;
			}

			const observer = new IntersectionObserver(
				([entry]) => {
					const wrapper = stickyWrapper.closest(
						getDualGlobalStylesSelector('navigatorProvider')
					);

					// Global styles sidebar wrapper should be styling with position absolute to sticky support while user scrolling.
					if (wrapper) {
						wrapper.style.position = 'absolute';
						wrapper.style.width = '100%';
					}

					// Add `is-stuck-monitoring` to prevent `is-stuck` atr first time
					if (
						stickyWrapper.classList.contains('is-stuck-monitoring')
					) {
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
		}, [inspectorContainer]);

		// Outside block inspector: preserve legacy Slot/Fill layout and state (Tabs in SharedBlockExtension).
		if (!insideBlockInspector) {
			const { getActiveComplementaryArea } = select('core/interface');
			const activeComplementaryArea =
				getActiveComplementaryArea('core/edit-site');

			if ('edit-site/global-styles' === activeComplementaryArea) {
				return (
					<GlobalStylesBlockPartials
						clientId={clientId}
						sentinelRef={sentinelRef}
						stickyWrapperRef={stickyWrapperRef}
					>
						{children}
					</GlobalStylesBlockPartials>
				);
			}

			// Fills only (no block-inspector portal).
			return <SlotFillProvider>{children}</SlotFillProvider>;
		}

		// Block inspector: InspectorControls outside SlotFillProvider; card slots inside.
		return (
			<>
				{inspectorEdit}
				<SlotFillProvider>
					{children}
					{isBlockInspectorContainerReady(inspectorContainer) && (
						<BlockInspectorCardPortal
							key={inspectorContainer}
							clientId={clientId}
							isActive={isActive}
							inspectorContainer={inspectorContainer}
							sentinelRef={sentinelRef}
							stickyWrapperRef={stickyWrapperRef}
						/>
					)}
				</SlotFillProvider>
			</>
		);
	}
);
