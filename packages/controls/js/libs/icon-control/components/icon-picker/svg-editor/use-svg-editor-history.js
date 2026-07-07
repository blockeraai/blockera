/**
 * WordPress dependencies
 */
import { useCallback, useEffect, useRef, useState } from '@wordpress/element';

const MAX_HISTORY = 30;

/**
 * @typedef {{ past: string[], present: string, future: string[] }} SvgHistoryState
 */

/**
 * Undo/redo stack for SVG string snapshots.
 *
 * @param {string} svgString Current SVG markup.
 * @return {{ canUndo: boolean, canRedo: boolean, pushSnapshot: Function, syncLiveSvg: Function, undo: Function, redo: Function, resetHistory: Function }} History hook API.
 */
export function useSvgEditorHistory(svgString) {
	const historyRef = useRef(
		/** @type {SvgHistoryState} */ ({
			past: [],
			present: svgString || '',
			future: [],
		})
	);
	const [historyVersion, setHistoryVersion] = useState(0);
	const lastExternalSvg = useRef(svgString || '');

	const bumpHistory = useCallback(() => {
		setHistoryVersion((version) => version + 1);
	}, []);

	// Reset history when SVG is replaced externally (textarea paste, new file).
	useEffect(() => {
		if (svgString === lastExternalSvg.current) {
			return;
		}

		lastExternalSvg.current = svgString || '';
		historyRef.current = {
			past: [],
			present: svgString || '',
			future: [],
		};
		bumpHistory();
	}, [svgString, bumpHistory]);

	const syncLiveSvg = useCallback((nextSvg) => {
		if (!nextSvg) {
			return;
		}

		// Live editor updates (e.g. stroke drag) sync parent state without
		// treating the round-trip as an external SVG replacement.
		lastExternalSvg.current = nextSvg;
	}, []);

	const pushSnapshot = useCallback(
		(nextSvg) => {
			if (!nextSvg) {
				return;
			}

			const current = historyRef.current;

			if (nextSvg === current.present) {
				return;
			}

			const past = [...current.past, current.present];

			if (past.length > MAX_HISTORY) {
				past.shift();
			}

			historyRef.current = {
				past,
				present: nextSvg,
				future: [],
			};

			lastExternalSvg.current = nextSvg;
			bumpHistory();
		},
		[bumpHistory]
	);

	const undo = useCallback(() => {
		const current = historyRef.current;

		if (!current.past.length) {
			return null;
		}

		const past = [...current.past];
		const previous = past.pop();

		historyRef.current = {
			past,
			present: previous,
			future: [current.present, ...current.future],
		};

		lastExternalSvg.current = previous;
		bumpHistory();

		return previous;
	}, [bumpHistory]);

	const redo = useCallback(() => {
		const current = historyRef.current;

		if (!current.future.length) {
			return null;
		}

		const future = [...current.future];
		const next = future.shift();

		historyRef.current = {
			past: [...current.past, current.present],
			present: next,
			future,
		};

		lastExternalSvg.current = next;
		bumpHistory();

		return next;
	}, [bumpHistory]);

	const resetHistory = useCallback(
		(nextSvg) => {
			const value = nextSvg || '';

			lastExternalSvg.current = value;
			historyRef.current = {
				past: [],
				present: value,
				future: [],
			};
			bumpHistory();
		},
		[bumpHistory]
	);

	const history = historyRef.current;

	// historyVersion drives re-renders when undo/redo/push updates the ref.
	void historyVersion;

	return {
		canUndo: history.past.length > 0,
		canRedo: history.future.length > 0,
		present: history.present,
		pushSnapshot,
		syncLiveSvg,
		undo,
		redo,
		resetHistory,
	};
}
