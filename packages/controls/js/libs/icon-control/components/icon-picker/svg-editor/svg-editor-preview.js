/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { RangeControl } from '@wordpress/components';
import { useCallback, useEffect, useRef, useState } from '@wordpress/element';

/**
 * Blockera dependencies
 */
import { controlInnerClassNames } from '@blockera/classnames';

/**
 * Internal dependencies
 */
import {
	parseSvgMarkup,
	serializeSvgElement,
	materializeStrokeIconPresentation,
	resolveClickTarget,
	removeElements,
	canDeleteSelection,
	ungroupGroupElementAsync,
	ungroupPathElementWithClusters,
	getUngroupTarget,
	canUngroupSelection,
	clearEditorClasses,
	markHoverableChildren,
	applySelectionHighlights,
	getContextBreadcrumb,
	normalizeMarqueeRect,
	getSelectableElementsInClientRect,
} from './svg-editor-utils';
import { canSplitPathElement, splitPathElement } from './svg-path-split';
import {
	hasAnyStrokeInSvg,
	snapshotStrokeBaselines,
	applyStrokeWidthScale,
} from './svg-stroke-width';
import { useSvgEditorHistory } from './use-svg-editor-history';
import SvgEditorToolbar from './svg-editor-toolbar';
import {
	svgNeedsIconColorFix,
	normalizeSvgForIconColor,
} from './svg-color-normalize';
import SvgColorNormalizeNotice from './svg-color-normalize-notice';
import {
	getNudgeDeltaFromKey,
	nudgeElements,
	canNudgeSelection,
} from './svg-nudge';
import { sanitizeRawSVGString } from '../../../utils';

const EMPTY_COLOR_FIX_STATE = {
	needsFix: false,
	variant: 'info',
	distinctFillCount: 0,
};

/** Debounce history commit while typing in the stroke width input field. */
const STROKE_SCALE_HISTORY_DEBOUNCE_MS = 400;

/** Pixels before pointer move counts as marquee drag (not click). */
const MARQUEE_DRAG_THRESHOLD = 4;

export default function SvgEditorPreview({
	svgString = '',
	onChange = () => {},
	disabled = false,
}) {
	const mountRef = useRef(null);
	const canvasRef = useRef(null);
	const selectionOverlayRef = useRef(null);
	const selectionCountRef = useRef(null);
	const marqueeRef = useRef(null);
	const rootSvgRef = useRef(null);
	const selectedRef = useRef(/** @type {Element[]} */ ([]));
	const contextRef = useRef(null);
	const pointerStateRef = useRef(null);
	const lastCommittedRef = useRef(svgString);

	const [selectedElements, setSelectedElements] = useState(
		/** @type {Element[]} */ ([])
	);
	const [pathCanUngroup, setPathCanUngroup] = useState(false);
	const [isBusy, setIsBusy] = useState(false);
	const [breadcrumb, setBreadcrumb] = useState([]);
	const [hasSvgStrokes, setHasSvgStrokes] = useState(false);
	const [strokeScale, setStrokeScale] = useState(100);
	const [colorFixState, setColorFixState] = useState(EMPTY_COLOR_FIX_STATE);
	const isStrokeScaleAdjustingRef = useRef(false);
	const strokeScaleHistoryTimeoutRef = useRef(null);

	const { canUndo, canRedo, pushSnapshot, syncLiveSvg, undo, redo } =
		useSvgEditorHistory(svgString);

	const normalizeSvg = useCallback((markup) => {
		return sanitizeRawSVGString(markup) || '';
	}, []);

	const updateSelectionOverlay = useCallback((selected) => {
		const overlay = selectionOverlayRef.current;
		const countBadge = selectionCountRef.current;
		const canvas = canvasRef.current;
		const selectedList = Array.isArray(selected) ? selected : [];

		if (!overlay || !canvas) {
			return;
		}

		if (!selectedList.length) {
			overlay.style.display = 'none';

			if (countBadge) {
				countBadge.style.display = 'none';
			}

			return;
		}

		let minLeft = Infinity;
		let minTop = Infinity;
		let maxRight = -Infinity;
		let maxBottom = -Infinity;

		for (let i = 0; i < selectedList.length; i++) {
			const elementRect = selectedList[i].getBoundingClientRect();

			if (!elementRect.width && !elementRect.height) {
				continue;
			}

			minLeft = Math.min(minLeft, elementRect.left);
			minTop = Math.min(minTop, elementRect.top);
			maxRight = Math.max(maxRight, elementRect.right);
			maxBottom = Math.max(maxBottom, elementRect.bottom);
		}

		if (!Number.isFinite(minLeft)) {
			overlay.style.display = 'none';

			if (countBadge) {
				countBadge.style.display = 'none';
			}

			return;
		}

		const padding = 3;
		const positioningRoot =
			overlay.offsetParent instanceof HTMLElement
				? overlay.offsetParent
				: canvas;
		const rootRect = positioningRoot.getBoundingClientRect();
		const overlayLeft =
			minLeft - rootRect.left + positioningRoot.scrollLeft - padding;
		const overlayTop =
			minTop - rootRect.top + positioningRoot.scrollTop - padding;
		const overlayWidth = maxRight - minLeft + padding * 2;
		const overlayHeight = maxBottom - minTop + padding * 2;

		overlay.style.display = 'block';
		overlay.style.left = `${overlayLeft}px`;
		overlay.style.top = `${overlayTop}px`;
		overlay.style.width = `${overlayWidth}px`;
		overlay.style.height = `${overlayHeight}px`;

		if (countBadge) {
			if (selectedList.length > 1) {
				countBadge.style.display = 'flex';
				countBadge.textContent = String(selectedList.length);
				countBadge.style.left = `${overlayLeft + overlayWidth - 4}px`;
				countBadge.style.top = `${overlayTop - 10}px`;
			} else {
				countBadge.style.display = 'none';
			}
		}
	}, []);

	const applySvgToDom = useCallback((markup) => {
		const mount = mountRef.current;

		if (!mount) {
			return null;
		}

		mount.replaceChildren();

		const parsed = parseSvgMarkup(markup);

		if (!parsed) {
			rootSvgRef.current = null;
			contextRef.current = null;
			selectedRef.current = [];
			return null;
		}

		const liveSvg = parsed.cloneNode(true);
		materializeStrokeIconPresentation(
			/** @type {SVGSVGElement} */ (liveSvg)
		);
		mount.appendChild(liveSvg);

		rootSvgRef.current = /** @type {SVGSVGElement} */ (liveSvg);
		contextRef.current = liveSvg;

		return liveSvg;
	}, []);

	const serializeSvgForCommit = useCallback((rootSvg) => {
		return serializeSvgElement(rootSvg, { stripEditorAttrs: true });
	}, []);

	const refreshStrokeWidthState = useCallback((rootSvg) => {
		if (!rootSvg) {
			setHasSvgStrokes(false);
			setStrokeScale(100);
			return;
		}

		snapshotStrokeBaselines(rootSvg);
		setHasSvgStrokes(hasAnyStrokeInSvg(rootSvg));
		setStrokeScale(100);
	}, []);

	const refreshColorFixState = useCallback((markup) => {
		if (!markup || typeof markup !== 'string') {
			setColorFixState(EMPTY_COLOR_FIX_STATE);
			return;
		}

		setColorFixState(svgNeedsIconColorFix(markup));
	}, []);

	const syncSelectionUi = useCallback(
		(rootSvg, context, selected) => {
			const selectedList = Array.isArray(selected) ? selected : [];

			if (!rootSvg) {
				setBreadcrumb([]);
				updateSelectionOverlay([]);
				return;
			}

			clearEditorClasses(rootSvg);

			if (context) {
				markHoverableChildren(context);
			}

			if (selectedList.length) {
				applySelectionHighlights(selectedList);
			}

			setBreadcrumb(getContextBreadcrumb(rootSvg, context || rootSvg));

			// Defer overlay until layout reflects reordered selected nodes.
			window.requestAnimationFrame(() => {
				updateSelectionOverlay(selectedList);
			});
		},
		[updateSelectionOverlay]
	);

	const commitSvg = useCallback(
		(nextSvg, { recordHistory = true } = {}) => {
			const sanitized = normalizeSvg(nextSvg);

			if (!sanitized) {
				return;
			}

			lastCommittedRef.current = sanitized;

			if (recordHistory) {
				pushSnapshot(sanitized);
			} else {
				syncLiveSvg(sanitized);
			}

			onChange(sanitized);
		},
		[onChange, pushSnapshot, syncLiveSvg, normalizeSvg]
	);

	const resetSelection = useCallback(() => {
		selectedRef.current = [];
		setSelectedElements([]);
	}, []);

	const singleSelectedElement =
		selectedElements.length === 1 ? selectedElements[0] : null;

	const resetDrill = useCallback(() => {
		const rootSvg = rootSvgRef.current;

		contextRef.current = rootSvg;
		resetSelection();
		syncSelectionUi(rootSvg, rootSvg, []);
	}, [resetSelection, syncSelectionUi]);

	// Remount when SVG changes externally (textarea paste, file drop).
	useEffect(() => {
		if (svgString === lastCommittedRef.current && rootSvgRef.current) {
			return;
		}

		lastCommittedRef.current = svgString;

		const rootSvg = applySvgToDom(svgString);

		refreshStrokeWidthState(rootSvg);
		refreshColorFixState(svgString);
		resetSelection();
		contextRef.current = rootSvg;
		syncSelectionUi(rootSvg, rootSvg, []);
	}, [
		svgString,
		applySvgToDom,
		resetSelection,
		syncSelectionUi,
		refreshStrokeWidthState,
		refreshColorFixState,
	]);

	// Detect whether the selected path has multiple splittable subpaths (paper.js).
	useEffect(() => {
		if (
			!singleSelectedElement ||
			singleSelectedElement.nodeName.toLowerCase() !== 'path'
		) {
			setPathCanUngroup(false);
			return;
		}

		let cancelled = false;

		canSplitPathElement(singleSelectedElement).then((canSplit) => {
			if (!cancelled) {
				setPathCanUngroup(canSplit);
			}
		});

		return () => {
			cancelled = true;
		};
	}, [singleSelectedElement, svgString]);

	const selectElements = useCallback(
		(elements) => {
			const rootSvg = rootSvgRef.current;
			const context = contextRef.current;
			const unique = [];

			for (let i = 0; i < elements.length; i++) {
				const element = elements[i];

				if (element && unique.indexOf(element) === -1) {
					unique.push(element);
				}
			}

			selectedRef.current = unique;
			setSelectedElements(unique);
			syncSelectionUi(rootSvg, context, unique);
		},
		[syncSelectionUi]
	);

	const toggleInSelection = useCallback(
		(element) => {
			const current = selectedRef.current;
			const index = current.indexOf(element);

			if (index >= 0) {
				const next = current.filter((_, i) => i !== index);

				selectElements(next);
				return;
			}

			selectElements([...current, element]);
		},
		[selectElements]
	);

	const toggleSelection = useCallback(
		(elements) => {
			const current = [...selectedRef.current];

			for (let i = 0; i < elements.length; i++) {
				const element = elements[i];
				const index = current.indexOf(element);

				if (index >= 0) {
					current.splice(index, 1);
				} else {
					current.push(element);
				}
			}

			selectElements(current);
		},
		[selectElements]
	);

	const hideMarquee = useCallback(() => {
		const marquee = marqueeRef.current;

		if (marquee) {
			marquee.style.display = 'none';
		}
	}, []);

	const updateMarqueeVisual = useCallback((x1, y1, x2, y2) => {
		const marquee = marqueeRef.current;
		const canvas = canvasRef.current;

		if (!marquee || !canvas) {
			return;
		}

		const positioningRoot =
			marquee.offsetParent instanceof HTMLElement
				? marquee.offsetParent
				: canvas;
		const rootRect = positioningRoot.getBoundingClientRect();
		const rect = normalizeMarqueeRect(
			x1 - rootRect.left + positioningRoot.scrollLeft,
			y1 - rootRect.top + positioningRoot.scrollTop,
			x2 - rootRect.left + positioningRoot.scrollLeft,
			y2 - rootRect.top + positioningRoot.scrollTop
		);

		marquee.style.display = 'block';
		marquee.style.left = `${rect.left}px`;
		marquee.style.top = `${rect.top}px`;
		marquee.style.width = `${Math.max(0, rect.right - rect.left)}px`;
		marquee.style.height = `${Math.max(0, rect.bottom - rect.top)}px`;
	}, []);

	const handleCanvasPointerDown = useCallback(
		(event) => {
			if (disabled || isBusy || event.button !== 0) {
				return;
			}

			const context = contextRef.current;

			if (!context) {
				return;
			}

			const clickTarget = resolveClickTarget(event, context);

			pointerStateRef.current = {
				startX: event.clientX,
				startY: event.clientY,
				clickTarget,
				shiftKey: event.shiftKey,
				mode: clickTarget ? 'pending-click' : 'pending-marquee',
			};

			if (!clickTarget) {
				canvasRef.current?.setPointerCapture(event.pointerId);
			}
		},
		[disabled, isBusy]
	);

	const handleCanvasPointerMove = useCallback(
		(event) => {
			const state = pointerStateRef.current;

			if (!state) {
				return;
			}

			const distance = Math.hypot(
				event.clientX - state.startX,
				event.clientY - state.startY
			);

			if (
				state.mode === 'pending-marquee' &&
				distance >= MARQUEE_DRAG_THRESHOLD
			) {
				state.mode = 'marquee';
			}

			if (state.mode === 'marquee') {
				updateMarqueeVisual(
					state.startX,
					state.startY,
					event.clientX,
					event.clientY
				);
			}
		},
		[updateMarqueeVisual]
	);

	const handleCanvasPointerUp = useCallback(
		(event) => {
			const state = pointerStateRef.current;

			if (!state) {
				return;
			}

			const context = contextRef.current;
			const rootSvg = rootSvgRef.current;

			pointerStateRef.current = null;

			if (canvasRef.current?.hasPointerCapture(event.pointerId)) {
				canvasRef.current.releasePointerCapture(event.pointerId);
			}

			if (state.mode === 'marquee') {
				hideMarquee();

				const clientRect = normalizeMarqueeRect(
					state.startX,
					state.startY,
					event.clientX,
					event.clientY
				);
				const hits = getSelectableElementsInClientRect(
					context,
					clientRect
				);

				if (state.shiftKey) {
					toggleSelection(hits);
				} else {
					selectElements(hits);
				}

				return;
			}

			const distance = Math.hypot(
				event.clientX - state.startX,
				event.clientY - state.startY
			);

			if (
				state.mode === 'pending-click' &&
				state.clickTarget &&
				distance < MARQUEE_DRAG_THRESHOLD
			) {
				if (state.shiftKey) {
					toggleInSelection(state.clickTarget);
				} else {
					selectElements([state.clickTarget]);
				}

				return;
			}

			if (
				state.mode === 'pending-marquee' &&
				distance < MARQUEE_DRAG_THRESHOLD
			) {
				if (!state.shiftKey) {
					resetSelection();
					syncSelectionUi(rootSvg, context, []);
				}
			}

			hideMarquee();
		},
		[
			hideMarquee,
			selectElements,
			toggleInSelection,
			toggleSelection,
			resetSelection,
			syncSelectionUi,
		]
	);

	const handleCanvasDoubleClick = useCallback(
		(event) => {
			if (disabled || isBusy) {
				return;
			}

			const context = contextRef.current;
			const target = resolveClickTarget(event, context);

			if (!target || target.nodeName.toLowerCase() !== 'g') {
				return;
			}

			event.preventDefault();
			contextRef.current = target;
			resetSelection();
			syncSelectionUi(rootSvgRef.current, target, []);
		},
		[disabled, isBusy, resetSelection, syncSelectionUi]
	);

	const handleExitGroup = useCallback(() => {
		const rootSvg = rootSvgRef.current;
		const context = contextRef.current;

		if (!rootSvg || !context || context === rootSvg) {
			return;
		}

		const parent = context.parentElement;

		if (
			parent &&
			(parent === rootSvg || parent.nodeName.toLowerCase() === 'g')
		) {
			contextRef.current = parent;
		} else {
			contextRef.current = rootSvg;
		}

		resetSelection();
		syncSelectionUi(rootSvg, contextRef.current, []);
	}, [resetSelection, syncSelectionUi]);

	const handleNormalizeColors = useCallback(() => {
		const rootSvg = rootSvgRef.current;

		if (disabled || isBusy || !rootSvg) {
			return;
		}

		const currentMarkup = serializeSvgForCommit(rootSvg);

		if (!svgNeedsIconColorFix(currentMarkup).needsFix) {
			return;
		}

		normalizeSvgForIconColor(rootSvg);

		const nextSvg = serializeSvgForCommit(rootSvg);

		commitSvg(nextSvg, { recordHistory: true });
		refreshStrokeWidthState(rootSvg);
		refreshColorFixState(nextSvg);
		syncSelectionUi(rootSvg, contextRef.current, selectedRef.current);
	}, [
		disabled,
		isBusy,
		serializeSvgForCommit,
		commitSvg,
		refreshStrokeWidthState,
		refreshColorFixState,
		syncSelectionUi,
	]);

	const handleNudge = useCallback(
		(dx, dy) => {
			const rootSvg = rootSvgRef.current;
			const selected = selectedRef.current;

			if (disabled || isBusy || !canNudgeSelection(selected, rootSvg)) {
				return;
			}

			const moved = nudgeElements(selected, dx, dy, rootSvg);

			if (!moved) {
				return;
			}

			const nextSvg = serializeSvgForCommit(rootSvg);

			commitSvg(nextSvg, { recordHistory: true });
			syncSelectionUi(rootSvg, contextRef.current, selectedRef.current);
		},
		[disabled, isBusy, serializeSvgForCommit, commitSvg, syncSelectionUi]
	);

	const handleDelete = useCallback(() => {
		const rootSvg = rootSvgRef.current;
		const selected = selectedRef.current;

		if (disabled || isBusy || !canDeleteSelection(selected, rootSvg)) {
			return;
		}

		removeElements(selected);
		resetSelection();

		clearEditorClasses(rootSvg);
		updateSelectionOverlay([]);

		const nextSvg = serializeSvgForCommit(rootSvg);

		commitSvg(nextSvg);
		refreshStrokeWidthState(rootSvg);
		refreshColorFixState(nextSvg);
		syncSelectionUi(rootSvg, contextRef.current, []);
	}, [
		disabled,
		isBusy,
		resetSelection,
		syncSelectionUi,
		commitSvg,
		updateSelectionOverlay,
		serializeSvgForCommit,
		refreshStrokeWidthState,
		refreshColorFixState,
	]);

	const commitStrokeScaleHistory = useCallback(() => {
		const rootSvg = rootSvgRef.current;

		if (!rootSvg) {
			return;
		}

		const nextSvg = serializeSvgForCommit(rootSvg);

		commitSvg(nextSvg, { recordHistory: true });
	}, [commitSvg, serializeSvgForCommit]);

	const flushStrokeScaleHistory = useCallback(() => {
		if (!isStrokeScaleAdjustingRef.current) {
			return;
		}

		if (strokeScaleHistoryTimeoutRef.current) {
			clearTimeout(strokeScaleHistoryTimeoutRef.current);
			strokeScaleHistoryTimeoutRef.current = null;
		}

		isStrokeScaleAdjustingRef.current = false;
		commitStrokeScaleHistory();
	}, [commitStrokeScaleHistory]);

	const scheduleStrokeScaleHistoryCommit = useCallback(() => {
		if (strokeScaleHistoryTimeoutRef.current) {
			clearTimeout(strokeScaleHistoryTimeoutRef.current);
		}

		strokeScaleHistoryTimeoutRef.current = setTimeout(() => {
			strokeScaleHistoryTimeoutRef.current = null;
			flushStrokeScaleHistory();
		}, STROKE_SCALE_HISTORY_DEBOUNCE_MS);
	}, [flushStrokeScaleHistory]);

	const handleStrokeScaleChange = useCallback(
		(nextScale) => {
			const rootSvg = rootSvgRef.current;

			if (disabled || isBusy || !rootSvg) {
				return;
			}

			const scale = Math.max(25, Math.min(300, Number(nextScale) || 100));

			isStrokeScaleAdjustingRef.current = true;

			setStrokeScale(scale);
			applyStrokeWidthScale(rootSvg, scale);

			const nextSvg = serializeSvgForCommit(rootSvg);

			// Live preview + parent sync without flooding undo stack.
			commitSvg(nextSvg, { recordHistory: false });
			scheduleStrokeScaleHistoryCommit();
			syncSelectionUi(rootSvg, contextRef.current, selectedRef.current);
		},
		[
			disabled,
			isBusy,
			commitSvg,
			syncSelectionUi,
			serializeSvgForCommit,
			scheduleStrokeScaleHistoryCommit,
		]
	);

	useEffect(() => {
		const handleWindowPointerUp = (event) => {
			if (pointerStateRef.current) {
				handleCanvasPointerUp(event);
			}

			flushStrokeScaleHistory();
		};

		window.addEventListener('pointerup', handleWindowPointerUp);

		return () => {
			window.removeEventListener('pointerup', handleWindowPointerUp);

			if (strokeScaleHistoryTimeoutRef.current) {
				clearTimeout(strokeScaleHistoryTimeoutRef.current);
			}
		};
	}, [handleCanvasPointerUp, flushStrokeScaleHistory]);

	const handleUngroup = useCallback(async () => {
		const rootSvg = rootSvgRef.current;
		const selected = singleSelectedElement;
		const context = contextRef.current;
		const target = getUngroupTarget(
			selected,
			context,
			rootSvg,
			pathCanUngroup
		);

		if (disabled || isBusy || !target) {
			return;
		}

		setIsBusy(true);

		try {
			if (contextRef.current === target) {
				contextRef.current = target.parentElement || rootSvg;
			}

			let result;

			if (target.nodeName.toLowerCase() === 'path') {
				let split = await splitPathElement(target, {
					forceSplit: false,
				});

				// Pure hole compounds: user explicitly selected this path to break it apart.
				if (!split.ok && split.reason === 'single-cluster') {
					split = await splitPathElement(target, {
						forceSplit: true,
					});
				}

				if (!split.ok || !split.clusters) {
					return;
				}

				result = ungroupPathElementWithClusters(target, split.clusters);
			} else {
				result = await ungroupGroupElementAsync(target);
			}

			if (!result.ok) {
				return;
			}

			resetSelection();
			setPathCanUngroup(false);
			clearEditorClasses(rootSvg);
			updateSelectionOverlay([]);

			const nextSvg = serializeSvgForCommit(rootSvg);

			commitSvg(nextSvg);
			refreshStrokeWidthState(rootSvg);
			refreshColorFixState(nextSvg);
			syncSelectionUi(rootSvg, contextRef.current, []);
		} finally {
			setIsBusy(false);
		}
	}, [
		disabled,
		isBusy,
		pathCanUngroup,
		singleSelectedElement,
		resetSelection,
		syncSelectionUi,
		commitSvg,
		updateSelectionOverlay,
		serializeSvgForCommit,
		refreshStrokeWidthState,
		refreshColorFixState,
	]);

	const handleUndo = useCallback(() => {
		if (disabled || isBusy) {
			return;
		}

		const previous = undo();

		if (previous === null) {
			return;
		}

		const sanitized = normalizeSvg(previous);

		if (!sanitized) {
			return;
		}

		lastCommittedRef.current = sanitized;

		const rootSvg = applySvgToDom(sanitized);
		refreshStrokeWidthState(rootSvg);
		refreshColorFixState(sanitized);
		resetDrill();
		onChange(sanitized);
		contextRef.current = rootSvg;
	}, [
		disabled,
		isBusy,
		undo,
		applySvgToDom,
		resetDrill,
		onChange,
		normalizeSvg,
		refreshStrokeWidthState,
		refreshColorFixState,
	]);

	const handleRedo = useCallback(() => {
		if (disabled || isBusy) {
			return;
		}

		const next = redo();

		if (next === null) {
			return;
		}

		const sanitized = normalizeSvg(next);

		if (!sanitized) {
			return;
		}

		lastCommittedRef.current = sanitized;

		const rootSvg = applySvgToDom(sanitized);
		refreshStrokeWidthState(rootSvg);
		refreshColorFixState(sanitized);
		resetDrill();
		onChange(sanitized);
		contextRef.current = rootSvg;
	}, [
		disabled,
		isBusy,
		redo,
		applySvgToDom,
		resetDrill,
		onChange,
		normalizeSvg,
		refreshStrokeWidthState,
		refreshColorFixState,
	]);

	// Keyboard shortcuts: Nudge, Delete, Escape, Undo, Redo.
	useEffect(() => {
		const handleKeyDown = (event) => {
			if (disabled || isBusy) {
				return;
			}

			const mount = mountRef.current;

			if (!mount) {
				return;
			}

			const isMeta = event.metaKey || event.ctrlKey;

			if (isMeta && event.key.toLowerCase() === 'z') {
				event.preventDefault();

				if (event.shiftKey) {
					handleRedo();
				} else {
					handleUndo();
				}

				return;
			}

			if (event.key === 'Escape') {
				const rootSvg = rootSvgRef.current;
				const context = contextRef.current;

				if (context && context !== rootSvg) {
					handleExitGroup();
				} else {
					resetSelection();
					syncSelectionUi(rootSvg, context, []);
				}

				return;
			}

			const nudgeDelta = getNudgeDeltaFromKey(event.key, event.shiftKey);

			if (nudgeDelta && selectedRef.current.length) {
				const active = mount.ownerDocument?.activeElement;
				const tag = active?.tagName?.toLowerCase();

				if (
					tag === 'textarea' ||
					tag === 'input' ||
					active?.isContentEditable
				) {
					return;
				}

				event.preventDefault();
				handleNudge(nudgeDelta.dx, nudgeDelta.dy);
				return;
			}

			if (
				(event.key === 'Delete' || event.key === 'Backspace') &&
				selectedRef.current.length
			) {
				const active = mount.ownerDocument?.activeElement;
				const tag = active?.tagName?.toLowerCase();

				if (
					tag === 'textarea' ||
					tag === 'input' ||
					active?.isContentEditable
				) {
					return;
				}

				event.preventDefault();
				handleDelete();
			}
		};

		window.addEventListener('keydown', handleKeyDown);

		return () => {
			window.removeEventListener('keydown', handleKeyDown);
		};
	}, [
		disabled,
		isBusy,
		handleUndo,
		handleRedo,
		handleNudge,
		handleDelete,
		handleExitGroup,
		resetSelection,
		syncSelectionUi,
	]);

	return (
		<div
			className={controlInnerClassNames('icon-picker-svg-editor', {
				'is-disabled': disabled,
				'is-busy': isBusy,
			})}
		>
			<SvgEditorToolbar
				canUndo={canUndo}
				canRedo={canRedo}
				canDelete={canDeleteSelection(
					selectedElements,
					rootSvgRef.current
				)}
				selectedCount={selectedElements.length}
				canUngroup={canUngroupSelection(
					singleSelectedElement,
					contextRef.current,
					rootSvgRef.current,
					pathCanUngroup
				)}
				isBusy={isBusy}
				disabled={disabled}
				breadcrumb={breadcrumb}
				onUndo={handleUndo}
				onRedo={handleRedo}
				onDelete={handleDelete}
				onUngroup={handleUngroup}
				onExitGroup={handleExitGroup}
			/>

			<div
				ref={canvasRef}
				className={controlInnerClassNames(
					'icon-picker-custom-icon-preview-area',
					'icon-picker-svg-editor-canvas'
				)}
				style={{ position: 'relative' }}
				onPointerDown={handleCanvasPointerDown}
				onPointerMove={handleCanvasPointerMove}
				onDoubleClick={handleCanvasDoubleClick}
				role="presentation"
			>
				<div
					ref={mountRef}
					className={controlInnerClassNames(
						'icon-picker-custom-icon-preview-svg',
						'icon-picker-svg-editor-mount'
					)}
				/>
				<div
					ref={marqueeRef}
					className={controlInnerClassNames(
						'icon-picker-svg-editor-marquee'
					)}
					aria-hidden="true"
				/>
				<div
					ref={selectionOverlayRef}
					className={controlInnerClassNames(
						'icon-picker-svg-editor-selection-overlay'
					)}
					aria-hidden="true"
				/>
				<div
					ref={selectionCountRef}
					className={controlInnerClassNames(
						'icon-picker-svg-editor-selection-count'
					)}
					aria-hidden="true"
				/>
				{isBusy && (
					<div
						className={controlInnerClassNames(
							'icon-picker-svg-editor-busy-overlay'
						)}
					>
						{__('Processing…', 'blockera')}
					</div>
				)}
				{hasSvgStrokes && (
					<div
						className={controlInnerClassNames(
							'icon-picker-svg-editor-stroke-width-footer'
						)}
						onPointerDown={(event) => event.stopPropagation()}
						onClick={(event) => event.stopPropagation()}
						onDoubleClick={(event) => event.stopPropagation()}
					>
						<RangeControl
							__nextHasNoMarginBottom
							__next40pxDefaultSize
							label={__('Stroke width (%)', 'blockera')}
							value={strokeScale}
							onChange={handleStrokeScaleChange}
							min={25}
							max={300}
							step={1}
							withInputField={true}
							disabled={disabled || isBusy}
						/>
					</div>
				)}
			</div>

			{colorFixState.needsFix && !disabled && !isBusy && (
				<SvgColorNormalizeNotice
					variant={colorFixState.variant}
					distinctFillCount={colorFixState.distinctFillCount}
					disabled={disabled}
					isBusy={isBusy}
					onNormalize={handleNormalizeColors}
				/>
			)}
		</div>
	);
}
