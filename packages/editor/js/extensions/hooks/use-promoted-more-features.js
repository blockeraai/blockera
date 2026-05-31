// @flow
/**
 * External dependencies
 */
import { useState, useEffect, useCallback } from '@wordpress/element';

type UsePromotedMoreFeaturesArgs = {
	clientId: string,
	getEditedKeys: () => string[],
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
		setInitialPromoted(new Set(getEditedKeys()));
		setSessionPromoted(new Set());
		setPendingTouched(new Set());
		// Snapshot edited keys only when the selected block changes.
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [clientId]);

	const markTouched = useCallback((key: string) => {
		setPendingTouched((prev) => {
			if (prev.has(key)) {
				return prev;
			}

			const next = new Set(prev);
			next.add(key);
			return next;
		});
	}, []);

	const commitPendingPromotion = useCallback(() => {
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
	}, []);

	const isPromoted = useCallback(
		(key: string): boolean =>
			initialPromoted.has(key) || sessionPromoted.has(key),
		[initialPromoted, sessionPromoted]
	);

	const hasPendingTouched = useCallback(
		(key: string): boolean => pendingTouched.has(key),
		[pendingTouched]
	);

	return {
		isPromoted,
		markTouched,
		commitPendingPromotion,
		hasPendingTouched,
	};
}
