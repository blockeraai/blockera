/**
 * Internal dependencies
 */
import { queryStyleBookIframe } from '../panel-override/selectors';
import { BLOCKERA_RESOLVED_IFRAME_VARIABLES_STYLE_ID } from './blockera-supplemental-preset-variables-constants';

const CANVAS_IFRAME_SELECTORS = [
	'iframe[name="editor-canvas"]',
	'iframe[name="style-book-canvas"]',
] as const;

const latestSupplementalCss = { current: '' };
let lastDispatchedSupplementalCss: string | null = null;

const iframeLoadHandlers = new WeakMap<HTMLIFrameElement, () => void>();
const iframeHeadObservers = new WeakMap<Document, MutationObserver>();

function normalizeSupplementalCssForCompare(css: string): string {
	if (!css) {
		return '';
	}

	const inner = css
		.replace(/^:root\s*\{/i, '')
		.replace(/\}\s*;?\s*$/, '')
		.trim();

	return inner.replace(/\s+/g, '').toLowerCase();
}

function readBlockeraSupplementalStyleContent(document: Document): string {
	const head = document.head;
	if (!head) {
		return '';
	}

	const nodes = head.querySelectorAll(
		`style#${BLOCKERA_RESOLVED_IFRAME_VARIABLES_STYLE_ID}`
	);

	if (nodes.length !== 1) {
		return '';
	}

	return nodes[0].textContent ?? '';
}

function supplementalCssMatchesDocument(
	document: Document,
	supplementalCss: string
): boolean {
	const head = document.head;
	if (!head) {
		return !supplementalCss;
	}

	const nodes = head.querySelectorAll(
		`style#${BLOCKERA_RESOLVED_IFRAME_VARIABLES_STYLE_ID}`
	);

	if (!supplementalCss) {
		return nodes.length === 0;
	}

	if (nodes.length !== 1) {
		return false;
	}

	const existing = readBlockeraSupplementalStyleContent(document);
	if (!existing) {
		return false;
	}

	return (
		normalizeSupplementalCssForCompare(existing) ===
		normalizeSupplementalCssForCompare(supplementalCss)
	);
}

function observeIframeHead(document: Document): void {
	if (iframeHeadObservers.has(document)) {
		return;
	}

	const head = document.head;
	if (!head) {
		return;
	}

	let frame = 0;
	const observer = new MutationObserver(() => {
		if (frame) {
			cancelAnimationFrame(frame);
		}
		frame = requestAnimationFrame(() => {
			frame = 0;
			const supplementalCss = latestSupplementalCss.current;
			if (supplementalCssMatchesDocument(document, supplementalCss)) {
				return;
			}
			applySupplementalCssToDocument(document, supplementalCss);
		});
	});

	observer.observe(head, {
		childList: true,
		subtree: true,
		characterData: true,
	});

	iframeHeadObservers.set(document, observer);
}

function collectIframeElements(): HTMLIFrameElement[] {
	const found = new Set<HTMLIFrameElement>();

	for (const selector of CANVAS_IFRAME_SELECTORS) {
		document.querySelectorAll(selector).forEach((node) => {
			if (node instanceof HTMLIFrameElement) {
				found.add(node);
			}
		});
	}

	const styleBook = queryStyleBookIframe();
	if (styleBook) {
		found.add(styleBook);
	}

	return [...found];
}

function removeBlockeraSupplementalStyleElements(document: Document): void {
	const head = document.head;
	if (!head) {
		return;
	}

	head.querySelectorAll(
		`style#${BLOCKERA_RESOLVED_IFRAME_VARIABLES_STYLE_ID}`
	).forEach((node) => node.remove());

	document
		.getElementById(BLOCKERA_RESOLVED_IFRAME_VARIABLES_STYLE_ID)
		?.remove();
}

/**
 * @return `true` when the document `<head>` was mutated.
 */
function applySupplementalCssToDocument(
	document: Document,
	supplementalCss: string
): boolean {
	const head = document.head;
	if (!head) {
		return false;
	}

	if (supplementalCssMatchesDocument(document, supplementalCss)) {
		observeIframeHead(document);
		return false;
	}

	removeBlockeraSupplementalStyleElements(document);

	if (!supplementalCss) {
		return true;
	}

	const styleElement = document.createElement('style');
	styleElement.id = BLOCKERA_RESOLVED_IFRAME_VARIABLES_STYLE_ID;
	styleElement.textContent = supplementalCss;
	head.appendChild(styleElement);

	observeIframeHead(document);
	return true;
}

function isIframeDocumentReady(iframe: HTMLIFrameElement): boolean {
	const readyState = iframe.contentDocument?.readyState;
	return readyState === 'complete' || readyState === 'interactive';
}

function ensureIframeLoadSync(iframe: HTMLIFrameElement): void {
	const syncNow = () => {
		const iframeDocument = iframe.contentDocument;
		if (!iframeDocument) {
			return;
		}

		applySupplementalCssToDocument(
			iframeDocument,
			latestSupplementalCss.current
		);
	};

	if (!iframeLoadHandlers.has(iframe)) {
		iframeLoadHandlers.set(iframe, syncNow);
		iframe.addEventListener('load', syncNow);
	}

	if (isIframeDocumentReady(iframe)) {
		syncNow();
	}
}

function allReachableDocumentsMatch(supplementalCss: string): boolean {
	for (const iframe of collectIframeElements()) {
		const iframeDocument = iframe.contentDocument;
		if (!iframeDocument) {
			return false;
		}

		if (!supplementalCssMatchesDocument(iframeDocument, supplementalCss)) {
			return false;
		}
	}

	return true;
}

function applyToAllIframeDocuments(supplementalCss: string): {
	mutated: boolean;
	synced: boolean;
} {
	latestSupplementalCss.current = supplementalCss;

	const iframes = collectIframeElements();
	if (!iframes.length) {
		lastDispatchedSupplementalCss = supplementalCss;
		return { mutated: false, synced: false };
	}

	const cssUnchanged = supplementalCss === lastDispatchedSupplementalCss;
	const allMatch = allReachableDocumentsMatch(supplementalCss);

	if (cssUnchanged && allMatch) {
		for (const iframe of iframes) {
			ensureIframeLoadSync(iframe);
		}
		return { mutated: false, synced: true };
	}

	let mutated = false;

	for (const iframe of iframes) {
		ensureIframeLoadSync(iframe);

		const iframeDocument = iframe.contentDocument;
		if (!iframeDocument) {
			continue;
		}

		if (applySupplementalCssToDocument(iframeDocument, supplementalCss)) {
			mutated = true;
		}
	}

	lastDispatchedSupplementalCss = supplementalCss;

	return {
		mutated,
		synced: allReachableDocumentsMatch(supplementalCss),
	};
}

/**
 * Writes supplemental preset variables into live iframe documents.
 *
 * Store updates (`settings.styles`, `__unstableResolvedAssets`) are not enough:
 * - Style Book replaces `settings.styles` with core `globalStyles` output.
 * - The iframe blob URL for `__unstableResolvedAssets` is cached at mount and
 *   reloads can re-apply stale CSS from initial `load` listeners.
 *
 * Skips redundant DOM work when the target node already contains the current
 * CSS (including PHP-injected blob styles on first load). Re-applies only when
 * CSS changes, an iframe mounts, or the editor mutates `<head>`.
 */
export function applyBlockeraSupplementalPresetVariablesToIframes(
	supplementalCss: string
): { mutated: boolean; synced: boolean } {
	if (typeof document === 'undefined') {
		return { mutated: false, synced: false };
	}

	return applyToAllIframeDocuments(supplementalCss);
}
