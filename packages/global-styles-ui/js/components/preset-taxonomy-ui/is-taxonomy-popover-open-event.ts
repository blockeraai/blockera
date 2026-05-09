/**
 * External dependencies
 */
import type { MouseEvent } from 'react';

/** Mirrors repeater-control `isOpenPopoverEvent` without importing repeater internals. */
export function isTaxonomyPopoverOpenEvent(event: MouseEvent): boolean {
	const tagName = String(
		(event.target as HTMLElement | null)?.tagName ?? ''
	).toLowerCase();
	return !['svg', 'button', 'path'].includes(tagName);
}
