/**
 * Selector to check if the secondary sidebar is visible.
 *
 * @param {Object} state Store state.
 * @return {boolean} Whether the secondary sidebar is visible.
 */
export function isSecondarySidebarVisible(state: {
	secondarySidebarVisible: boolean;
}) {
	return state.secondarySidebarVisible;
}

/**
 * Whether the primary (settings) sidebar is open (Blockera session mirror).
 *
 * @param {Object} state Store state.
 * @return {boolean} Whether the primary sidebar is open.
 */
export function isPrimarySidebarOpen(state: { primarySidebarOpen: boolean }) {
	return state.primarySidebarOpen;
}

/**
 * True when both Blockera secondary and primary sidebars are closed.
 *
 * @param {Object} state Store state.
 * @return {boolean} Whether both are closed.
 */
export function areBothSidebarsClosed(state: {
	secondarySidebarVisible: boolean;
	primarySidebarOpen: boolean;
}) {
	return !state.secondarySidebarVisible && !state.primarySidebarOpen;
}

/**
 * Selector to get the primary sidebar width.
 *
 * @param {Object} state Store state.
 * @return {string} The primary sidebar width (e.g., '300px').
 */
export function getPrimarySidebarWidth(state: { primarySidebarWidth: string }) {
	return state.primarySidebarWidth;
}

/**
 * Selector to get the secondary sidebar width.
 *
 * @param {Object} state Store state.
 * @return {string} The secondary sidebar width (e.g., '350px').
 */
export function getSecondarySidebarWidth(state: {
	secondarySidebarWidth: string;
}) {
	return state.secondarySidebarWidth;
}

/**
 * Selector to get the list view height.
 *
 * @param {Object} state Store state.
 * @return {string} The list view height as percentage (e.g., '50%').
 */
export function getListViewHeight(state: { listViewHeight: string }) {
	return state.listViewHeight;
}
