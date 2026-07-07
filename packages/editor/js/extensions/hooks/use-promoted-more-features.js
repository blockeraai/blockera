// @flow
/**
 * External dependencies
 */
import { useState, useEffect, useCallback } from '@wordpress/element';

type UsePromotedMoreFeaturesArgs = {
	clientId: string,
	getEditedKeys: () => string[],
	enabled?: boolean,
};

/**
 * Tracks MoreFeatures promotion per block session.
 *
 * - Non-default values on block select promote immediately (initialPromoted).
 * - Edits made inside MoreFeatures promote only after the panel closes.
 * - Session-promoted features stay visible after reset until block switch.
 */
export function usePromotedMoreFeatures({
	clientId,
	getEditedKeys,
	enabled = true,
}: UsePromotedMoreFeaturesArgs): {
	isPromoted: (key: string) => boolean,
	markTouched: (key: string) => void,
	commitPendingPromotion: () => void,
	hasPendingTouched: (key: string) => boolean,
} {
	const [initialPromoted, setInitialPromoted] = useState(() => new Set());
	const [sessionPromoted, setSessionPromoted] = useState(() => new Set());
	const [pendingTouched, setPendingTouched] = useState(() => new Set());

	useEffect(() => {
		if (!enabled) {
			setInitialPromoted(new Set());
			setSessionPromoted(new Set());
			setPendingTouched(new Set());
			return;
		}

		setInitialPromoted(new Set(getEditedKeys()));
		setSessionPromoted(new Set());
		setPendingTouched(new Set());
		// Snapshot edited keys only when the selected block changes.
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [clientId, enabled]);

	const markTouched = useCallback(
		(key: string) => {
			if (!enabled) {
				return;
			}

			setPendingTouched((prev) => {
				if (prev.has(key)) {
					return prev;
				}

				const next = new Set(prev);
				next.add(key);
				return next;
			});
		},
		[enabled]
	);

	const commitPendingPromotion = useCallback(() => {
		if (!enabled) {
			return;
		}

		setPendingTouched((pending) => {
			if (pending.size > 0) {
				setSessionPromoted((prev) => {
					const next = new Set(prev);
					pending.forEach((key) => {
						next.add(key);
					});
					return next;
				});
			}

			return new Set();
		});
	}, [enabled]);

	const isPromoted = useCallback(
		(key: string): boolean => {
			if (!enabled) {
				return false;
			}

			return initialPromoted.has(key) || sessionPromoted.has(key);
		},
		[enabled, initialPromoted, sessionPromoted]
	);

	const hasPendingTouched = useCallback(
		(key: string): boolean => enabled && pendingTouched.has(key),
		[enabled, pendingTouched]
	);

	return {
		isPromoted,
		markTouched,
		commitPendingPromotion,
		hasPendingTouched,
	};
}
