// @flow

/**
 * Blockera dependencies
 */
import { isEquals } from '@blockera/utils';

const EMPTY_STYLE: Object = {};

export type GlobalStylesPanelActiveColorStore = {
	subscribe: (listener: () => void) => () => void,
	getSnapshot: () => Object,
	setSnapshot: (nextStyle: Object) => void,
};

/**
 * External store for panel popover active-color styles.
 * Consumers use {@see useSyncExternalStore} so parent re-renders do not
 * re-run active-color resolution unless the snapshot actually changes.
 *
 * @return {GlobalStylesPanelActiveColorStore} Store instance (one per panel App).
 */
export function createGlobalStylesPanelActiveColorStore(): GlobalStylesPanelActiveColorStore {
	let snapshot: Object = EMPTY_STYLE;
	const listeners: Set<() => void> = new Set();

	return {
		subscribe(listener: () => void) {
			listeners.add(listener);

			return () => {
				listeners.delete(listener);
			};
		},
		getSnapshot(): Object {
			return snapshot;
		},
		setSnapshot(nextStyle: Object) {
			if (isEquals(snapshot, nextStyle)) {
				return;
			}

			snapshot = nextStyle;
			listeners.forEach((listener) => {
				listener();
			});
		},
	};
}
