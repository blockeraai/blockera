/**
 * Internal dependencies
 */
import type { Tab } from '../types';

/**
 * After closing a tab, build an ordered list of tabs to try when activating another
 * document (prefer the immediate left neighbor in bar order, then the rest left-to-right).
 *
 * @param sortedTabs Full bar order (pinned first, then unpinned).
 * @param closedKey  Key of the tab being closed.
 */
export function buildTabSwitchCandidates(
	sortedTabs: Tab[],
	closedKey: string
): Tab[] {
	const closedTabIndex = sortedTabs.findIndex((t) => t.key === closedKey);
	const remainingTabs = sortedTabs.filter((t) => t.key !== closedKey);
	const candidates: Tab[] = [];
	if (closedTabIndex > 0) {
		const left = sortedTabs[closedTabIndex - 1];
		if (left && left.key !== closedKey) {
			candidates.push(left);
		}
	}
	for (const t of remainingTabs) {
		if (!candidates.some((c) => c.key === t.key)) {
			candidates.push(t);
		}
	}
	return candidates;
}
