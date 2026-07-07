/**
 * Skip runtime CSS style injection during Jest tests.
 *
 * wp-build compiles CSS module imports in @wordpress/* packages into JavaScript
 * that injects <style> elements at import time. The injected CSS uses @layer and
 * nesting, which jsdom cannot parse — causing "Could not parse CSS stylesheet"
 * console errors. Newer Gutenberg builds guard with `process.env.NODE_ENV !==
 * 'test'`; until those packages are updated, noop style injection here.
 *
 * @see https://github.com/WordPress/gutenberg/pull/75792
 */
if (typeof document !== 'undefined' && document.head) {
	const isStyleElement = (node) => node?.tagName === 'STYLE';

	const originalHeadAppendChild = document.head.appendChild.bind(
		document.head
	);
	document.head.appendChild = function appendChild(child) {
		if (isStyleElement(child)) {
			return child;
		}
		return originalHeadAppendChild(child);
	};

	const originalHeadInsertBefore = document.head.insertBefore.bind(
		document.head
	);
	document.head.insertBefore = function insertBefore(newNode, referenceNode) {
		if (isStyleElement(newNode)) {
			return newNode;
		}
		return originalHeadInsertBefore(newNode, referenceNode);
	};
}
