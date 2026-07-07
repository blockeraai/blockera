/**
 * WordPress dependencies
 */
import { useEffect } from '@wordpress/element';

const DRAFT_ICON_CLASS = 'icon-current';

/**
 * Escape a value for use inside a CSS attribute/class selector.
 *
 * @param {string} value Selector fragment.
 * @return {string} Escaped value.
 */
function escapeSelectorValue(value) {
	if (typeof CSS !== 'undefined' && typeof CSS.escape === 'function') {
		return CSS.escape(value);
	}

	return String(value).replace(/[^a-zA-Z0-9_-]/g, '\\$&');
}

/**
 * Toggle draft-selection styling on library grid icons without rebuilding React trees.
 *
 * Library grids can contain hundreds of icons; updating only the previous and next
 * selected cell avoids expensive `getLibraryIcons()` re-runs on every click.
 *
 * @param {import('react').RefObject<HTMLElement|null>} containerRef Grid container.
 * @param {?Object}                                    draftLibraryIcon Draft `{ icon, library }`.
 * @param {*}                                            refreshToken     Re-run when grid content changes (e.g. lazy load).
 */
export function useDraftIconHighlight(
	containerRef,
	draftLibraryIcon,
	refreshToken = null
) {
	useEffect(() => {
		const container = containerRef?.current;

		if (!container) {
			return;
		}

		container
			.querySelectorAll(`.${DRAFT_ICON_CLASS}`)
			.forEach((element) => {
				element.classList.remove(DRAFT_ICON_CLASS);
			});

		if (!draftLibraryIcon?.icon || !draftLibraryIcon?.library) {
			return;
		}

		const libraryClass = `library-${escapeSelectorValue(
			draftLibraryIcon.library
		)}`;
		const iconClass = `icon-${escapeSelectorValue(draftLibraryIcon.icon)}`;
		const selected = container.querySelector(
			`.${libraryClass}.${iconClass}`
		);

		selected?.classList.add(DRAFT_ICON_CLASS);
	}, [containerRef, draftLibraryIcon, refreshToken]);
}
