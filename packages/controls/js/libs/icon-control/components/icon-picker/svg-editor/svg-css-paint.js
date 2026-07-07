/**
 * Parse and normalize fill/stroke paints declared in embedded SVG <style> blocks.
 */

const EMBEDDED_CSS_PAINT_PROPS = new Set([
	'fill',
	'stroke',
	'color',
	'stop-color',
]);

/**
 * @typedef {{ selectors: string[], declarations: Record<string, string> }} SvgEmbeddedCssRule
 */

/**
 * Split comma-separated CSS selectors (no nested functions).
 *
 * @param {string} selectorText Raw selector list.
 * @return {string[]} Individual selectors.
 */
function splitCssSelectors(selectorText) {
	const selectors = [];
	let current = '';

	for (let i = 0; i < selectorText.length; i++) {
		const char = selectorText[i];

		if (char === ',') {
			const trimmed = current.trim();

			if (trimmed) {
				selectors.push(trimmed);
			}

			current = '';
			continue;
		}

		current += char;
	}

	const trimmed = current.trim();

	if (trimmed) {
		selectors.push(trimmed);
	}

	return selectors;
}

/**
 * Parse declaration block into lowercase property map.
 *
 * @param {string} block CSS declarations between `{` and `}`.
 * @return {Record<string, string>} Parsed declarations.
 */
function parseCssDeclarationBlock(block) {
	const declarations = {};
	const parts = block.split(';');

	for (let i = 0; i < parts.length; i++) {
		const part = parts[i].trim();

		if (!part) {
			continue;
		}

		const colonIndex = part.indexOf(':');

		if (colonIndex === -1) {
			continue;
		}

		const prop = part.slice(0, colonIndex).trim().toLowerCase();
		const value = part.slice(colonIndex + 1).trim();

		if (prop && value) {
			declarations[prop] = value;
		}
	}

	return declarations;
}

/**
 * Parse CSS rules from raw stylesheet text (class/id/tag selectors only).
 *
 * @param {string} cssText Stylesheet body.
 * @return {SvgEmbeddedCssRule[]} Parsed rules.
 */
export function parseEmbeddedSvgCssRules(cssText) {
	const rules = [];

	if (!cssText || typeof cssText !== 'string') {
		return rules;
	}

	const cleaned = cssText.replace(/\/\*[\s\S]*?\*\//g, '');
	const rulePattern = /([^{]+)\{([^}]*)\}/g;
	let match;

	while ((match = rulePattern.exec(cleaned)) !== null) {
		const selectors = splitCssSelectors(match[1]);
		const declarations = parseCssDeclarationBlock(match[2]);

		if (!selectors.length) {
			continue;
		}

		let hasPaint = false;

		for (const prop in declarations) {
			if (
				Object.prototype.hasOwnProperty.call(declarations, prop) &&
				EMBEDDED_CSS_PAINT_PROPS.has(prop)
			) {
				hasPaint = true;
				break;
			}
		}

		if (hasPaint) {
			rules.push({ selectors, declarations });
		}
	}

	return rules;
}

/**
 * Collect CSS rules from all `<style>` elements under the SVG root.
 *
 * @param {SVGSVGElement | Element} rootSvg SVG root.
 * @return {SvgEmbeddedCssRule[]} Combined rules in document order.
 */
export function collectEmbeddedSvgCssRules(rootSvg) {
	const rules = [];
	const styleNodes = rootSvg.querySelectorAll('style');

	for (let i = 0; i < styleNodes.length; i++) {
		const styleNode = styleNodes[i];
		const cssText = styleNode.textContent || '';

		const parsed = parseEmbeddedSvgCssRules(cssText);

		for (let j = 0; j < parsed.length; j++) {
			rules.push(parsed[j]);
		}
	}

	return rules;
}

/**
 * Whether a simple SVG export selector matches an element.
 *
 * Supports `.class`, `#id`, `tag.class`, and descendant chains ending in `.class` / `#id`.
 *
 * @param {Element} element Candidate element.
 * @param {string}  selector CSS selector.
 * @return {boolean} Result of the check.
 */
export function elementMatchesEmbeddedCssSelector(element, selector) {
	if (!element || element.nodeType !== 1 || !selector) {
		return false;
	}

	const trimmed = selector.trim();

	if (!trimmed) {
		return false;
	}

	const tagClassMatch = trimmed.match(/^([a-z][a-z0-9-]*)\.([a-z0-9_-]+)$/i);

	if (tagClassMatch) {
		return (
			element.nodeName.toLowerCase() === tagClassMatch[1].toLowerCase() &&
			element.classList.contains(tagClassMatch[2])
		);
	}

	if (trimmed.startsWith('.')) {
		const className = trimmed.slice(1).split(/[\s>+~.#[]/)[0];

		return Boolean(className && element.classList.contains(className));
	}

	if (trimmed.startsWith('#')) {
		const id = trimmed.slice(1).split(/[\s>+~.[#]/)[0];

		return Boolean(id && element.id === id);
	}

	const descendantClass = trimmed.match(/\.([a-z0-9_-]+)$/i);

	if (descendantClass) {
		return element.classList.contains(descendantClass[1]);
	}

	const descendantId = trimmed.match(/#([a-z0-9_-]+)$/i);

	if (descendantId) {
		return element.id === descendantId[1];
	}

	return false;
}

/**
 * Resolve paint declarations from embedded CSS for one element (last matching rule wins).
 *
 * @param {Element}              element SVG element.
 * @param {SvgEmbeddedCssRule[]} rules    Parsed CSS rules.
 * @return {Record<string, string>} Resolved paint declarations.
 */
export function resolveEmbeddedCssPaintsForElement(element, rules) {
	const resolved = {};

	for (let i = 0; i < rules.length; i++) {
		const rule = rules[i];
		let matched = false;

		for (let j = 0; j < rule.selectors.length; j++) {
			if (elementMatchesEmbeddedCssSelector(element, rule.selectors[j])) {
				matched = true;
				break;
			}
		}

		if (!matched) {
			continue;
		}

		for (const prop in rule.declarations) {
			if (
				Object.prototype.hasOwnProperty.call(rule.declarations, prop) &&
				EMBEDDED_CSS_PAINT_PROPS.has(prop)
			) {
				resolved[prop] = rule.declarations[prop];
			}
		}
	}

	return resolved;
}

/**
 * Rewrite hardcoded paint values inside embedded `<style>` blocks.
 *
 * @param {SVGSVGElement | Element} rootSvg SVG root.
 * @param {(raw: string) => boolean} isNormalizablePaint Predicate for values to rewrite.
 * @param {string} replacement Replacement paint value.
 */
export function rewriteEmbeddedSvgStyleBlocks(
	rootSvg,
	isNormalizablePaint,
	replacement = 'currentColor'
) {
	const styleNodes = rootSvg.querySelectorAll('style');
	const re = /(fill|stroke|color|stop-color)(\s*:\s*)([^;}\n]+)/gi;

	for (let i = 0; i < styleNodes.length; i++) {
		const styleNode = styleNodes[i];
		const cssText = styleNode.textContent || '';
		let changed = false;

		const nextText = cssText.replace(re, (full, prop, separator, value) => {
			const trimmed = value.trim();

			if (!isNormalizablePaint(trimmed)) {
				return full;
			}

			changed = true;

			return `${prop}${separator}${replacement}`;
		});

		if (changed) {
			styleNode.textContent = nextText;
		}
	}
}

/**
 * Remove `<style>` elements whose rules no longer declare paint after normalization.
 *
 * @param {SVGSVGElement | Element} rootSvg SVG root.
 */
export function removeEmptyEmbeddedSvgStyleBlocks(rootSvg) {
	const styleNodes = rootSvg.querySelectorAll('style');

	for (let i = 0; i < styleNodes.length; i++) {
		const styleNode = styleNodes[i];
		const cssText = (styleNode.textContent || '').trim();

		if (!cssText) {
			styleNode.parentNode?.removeChild(styleNode);
			continue;
		}

		const rules = parseEmbeddedSvgCssRules(cssText);
		let hasPaint = false;

		for (let j = 0; j < rules.length; j++) {
			const decls = rules[j].declarations;

			for (const prop in decls) {
				if (
					Object.prototype.hasOwnProperty.call(decls, prop) &&
					EMBEDDED_CSS_PAINT_PROPS.has(prop)
				) {
					hasPaint = true;
					break;
				}
			}

			if (hasPaint) {
				break;
			}
		}

		if (!hasPaint && !cssText.replace(/[\s{};]/g, '')) {
			styleNode.parentNode?.removeChild(styleNode);
		}
	}
}
