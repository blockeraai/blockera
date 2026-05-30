/**
 * WordPress dependencies
 */
import { Button } from '@wordpress/components';
import { useViewportMatch } from '@wordpress/compose';
import {
	createPortal,
	useEffect,
	useState,
	type RefObject,
} from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { closeSmall } from '@wordpress/icons';

/**
 * Panel types that expose a category column in the inserter.
 * See Gutenberg: packages/block-editor/src/components/inserter/menu.js
 */
type CategoryPanelType = 'patterns' | 'media';

interface PortalTarget {
	container: HTMLElement;
	panelType: CategoryPanelType;
}

interface InserterCategoryPanelCloseButtonProps {
	containerRef: RefObject<HTMLElement | null>;
	/** Bumps when InserterLibrary remounts so the observer rebinds to the new root. */
	observerKey?: number;
	onCloseCategoryPanel: () => void;
}

/**
 * Resolves the active inserter menu element. The library ref is attached to
 * `.block-editor-inserter__menu` itself, so querySelector (descendants only)
 * misses it when show-panel is on the root.
 */
function getActiveMenu(root: HTMLElement): HTMLElement | null {
	if (
		root.classList.contains('block-editor-inserter__menu') &&
		root.classList.contains('show-panel')
	) {
		return root;
	}

	const descendant = root.querySelector(
		'.block-editor-inserter__menu.show-panel'
	);

	return descendant instanceof HTMLElement ? descendant : null;
}

/**
 * CategoryTabs renders one panel per category; only the selected panel has
 * z-index 1 (see category-tabs/index.js motion variants). Others are -1.
 */
function isVisibleCategoryPanel(panel: HTMLElement): boolean {
	const zIndex = Number.parseInt(window.getComputedStyle(panel).zIndex, 10);

	return !Number.isNaN(zIndex) && zIndex >= 0;
}

/**
 * Returns the currently visible `.block-editor-inserter__category-panel`.
 */
function getVisibleCategoryPanel(menu: HTMLElement): HTMLElement | null {
	const panels = menu.querySelectorAll(
		'.block-editor-inserter__category-panel'
	);

	for (const panel of panels) {
		if (panel instanceof HTMLElement && isVisibleCategoryPanel(panel)) {
			return panel;
		}
	}

	return null;
}

/**
 * Resolves the DOM node to portal the close button into when a category
 * column is open (Patterns or Media tab on desktop).
 */
function findPortalTarget(root: HTMLElement): PortalTarget | null {
	const menu = getActiveMenu(root);

	if (!menu) {
		return null;
	}

	const visiblePanel = getVisibleCategoryPanel(menu);

	if (visiblePanel) {
		const patternsFilterToggle = visiblePanel.querySelector(
			'.block-editor-inserter__patterns-category-panel-header .components-dropdown-menu__toggle'
		);

		const patternsHeaderRow =
			patternsFilterToggle?.parentElement?.parentElement;

		if (patternsHeaderRow instanceof HTMLElement) {
			return {
				container: patternsHeaderRow,
				panelType: 'patterns',
			};
		}

		if (visiblePanel.querySelector('.block-editor-inserter__media-panel')) {
			return {
				container: visiblePanel,
				panelType: 'media',
			};
		}
	}

	return null;
}

/**
 * Injects a close button into Gutenberg's category panel header so users can
 * deselect the active category and collapse the secondary column.
 */
export default function InserterCategoryPanelCloseButton({
	containerRef,
	observerKey = 0,
	onCloseCategoryPanel,
}: InserterCategoryPanelCloseButtonProps) {
	const isDesktopViewport = useViewportMatch('medium');
	const [portalTarget, setPortalTarget] = useState<PortalTarget | null>(null);

	useEffect(() => {
		if (!isDesktopViewport) {
			setPortalTarget(null);
			return;
		}

		const syncPortalTarget = () => {
			const root = containerRef.current;

			if (!root) {
				setPortalTarget(null);
				return;
			}

			const target = findPortalTarget(root);

			setPortalTarget((current) => {
				if (
					current?.container === target?.container &&
					current?.panelType === target?.panelType
				) {
					return current;
				}

				return target;
			});
		};

		syncPortalTarget();

		const root = containerRef.current;

		if (!root) {
			return;
		}

		const observer = new MutationObserver(syncPortalTarget);

		observer.observe(root, {
			childList: true,
			subtree: true,
			attributes: true,
			attributeFilter: ['class', 'aria-selected', 'style'],
		});

		return () => {
			observer.disconnect();
		};
	}, [containerRef, isDesktopViewport, observerKey]);

	if (!portalTarget?.container.isConnected) {
		return null;
	}

	const className = [
		'blockera-inserter-category-panel-close',
		portalTarget.panelType === 'media'
			? 'blockera-inserter-category-panel-close--media'
			: '',
	]
		.filter(Boolean)
		.join(' ');

	return createPortal(
		<Button
			className={className}
			icon={closeSmall}
			label={__('Close', 'blockera')}
			onClick={onCloseCategoryPanel}
			size="compact"
		/>,
		portalTarget.container
	);
}
