/**
 * Check if the current page is the Block Editor or Site Editor
 *
 * This is used to ensure customizations only run in editor contexts.
 *
 * @returns True if on block editor or site editor page
 */
export function isEditorPage(): boolean {
	if (typeof window === 'undefined') {
		return false;
	}

	const path = window.location.pathname;
	const search = window.location.search;

	// Check for Site Editor
	if (path.includes('site-editor.php')) {
		return true;
	}

	// Check for Block Editor (post.php with action=edit)
	if (path.includes('post.php') && search.includes('action=edit')) {
		return true;
	}

	// Check for new post/page editor (post-new.php)
	if (path.includes('post-new.php')) {
		return true;
	}

	return false;
}

