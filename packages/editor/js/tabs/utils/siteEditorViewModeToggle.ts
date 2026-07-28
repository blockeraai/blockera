/**
 * Site editor view-mode toggle bypasses workspace tab limits.
 *
 * Clicking `.edit-site-editor__view-mode-toggle` navigates within the site
 * editor and should not trigger companion or Pro tab-limit promotions.
 */
export const SITE_EDITOR_VIEW_MODE_TOGGLE_SELECTOR =
	'.edit-site-editor__view-mode-toggle';

let pendingViewModeToggleBypass = false;

/**
 * Mark the next tab add as originating from the site editor view-mode toggle.
 */
export function markSiteEditorViewModeToggleNavigation(): void {
	pendingViewModeToggleBypass = true;
}

/**
 * Whether the current add-tab call should skip tab limits (single-use).
 */
export function consumeSiteEditorViewModeToggleBypass(): boolean {
	if (!pendingViewModeToggleBypass) {
		return false;
	}

	pendingViewModeToggleBypass = false;
	return true;
}

/**
 * Returns true when the event target is inside the view-mode toggle control.
 */
export function isSiteEditorViewModeToggleClick(
	target: EventTarget | null
): boolean {
	if (!(target instanceof Element)) {
		return false;
	}

	return Boolean(target.closest(SITE_EDITOR_VIEW_MODE_TOGGLE_SELECTOR));
}
