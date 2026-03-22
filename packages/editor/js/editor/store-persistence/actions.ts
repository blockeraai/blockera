/**
 * Action to set the secondary sidebar visibility.
 *
 * @param {boolean} visible Whether the sidebar should be visible.
 * @return {Object} Action object.
 */
export function setSecondarySidebarVisible(visible: boolean) {
	return {
		type: 'SET_SECONDARY_SIDEBAR_VISIBLE',
		visible,
	};
}

/**
 * Action to toggle the secondary sidebar visibility.
 *
 * @return {Object} Action object.
 */
export function toggleSecondarySidebar() {
	return {
		type: 'TOGGLE_SECONDARY_SIDEBAR',
	};
}

/**
 * Action to set whether the primary (settings) sidebar is open (Blockera mirror; session-only).
 *
 * @param {boolean} open Whether the primary sidebar should be considered open.
 * @return {Object} Action object.
 */
export function setPrimarySidebarOpen(open: boolean) {
	return {
		type: 'SET_PRIMARY_SIDEBAR_OPEN',
		open,
	};
}

/**
 * Action to set the primary sidebar width.
 *
 * @param {string} width The width value (e.g., '300px').
 * @return {Object} Action object.
 */
export function setPrimarySidebarWidth(width: string) {
	return {
		type: 'SET_PRIMARY_SIDEBAR_WIDTH',
		width,
	};
}

/**
 * Action to set the secondary sidebar width.
 *
 * @param {string} width The width value (e.g., '350px').
 * @return {Object} Action object.
 */
export function setSecondarySidebarWidth(width: string) {
	return {
		type: 'SET_SECONDARY_SIDEBAR_WIDTH',
		width,
	};
}

/**
 * Action to set the list view height.
 *
 * @param {string} height The height value as percentage (e.g., '50%').
 * @return {Object} Action object.
 */
export function setListViewHeight(height: string) {
	return {
		type: 'SET_LIST_VIEW_HEIGHT',
		height,
	};
}
