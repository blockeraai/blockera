// @flow

/**
 * Internal helpers for `getSelectorWithRootBody` / `getExtractedSelectorFromRootBody`:
 * wraps block selectors in `:root` / `html:root body :where(...)`, moving trailing
 * pseudos on the last compound outside `:where()` when a combinator is present.
 *
 * Used during selector string generation (not a React render path); still kept
 * linear-time and low-allocation: one pass to find the last top-level combinator.
 */

// Tracks paren/depth so combinators inside :not(), [], or quotes are ignored.
const updateDepth = (
	c: string,
	i: number,
	s: string,
	ctx: { p: number, b: number, inStr: null | '"' | "'" }
) => {
	if (ctx.inStr) {
		if (c === ctx.inStr && s[i - 1] !== '\\') {
			ctx.inStr = null;
		}
		return;
	}
	if (c === '"' || c === "'") {
		ctx.inStr = c;
		return;
	}
	if (c === '(') {
		ctx.p++;
	} else if (c === ')' && ctx.p > 0) {
		ctx.p--;
	} else if (c === '[') {
		ctx.b++;
	} else if (c === ']' && ctx.b > 0) {
		ctx.b--;
	}
};

const isTopLevel = (ctx: { p: number, b: number, inStr: null | string }) =>
	!ctx.inStr && ctx.p === 0 && ctx.b === 0;

// Right-hand side of the last top-level combinator (the last compound) is the only
// place that may need pseudos moved after :where(…).
const splitAtLastTopLevelCombinator = (
	s: string
): { left: string, right: string, comb: string } | null => {
	const t = s.trim();
	if (!t) {
		return null;
	}
	const ctx = { p: 0, b: 0, inStr: null };
	type Cand = { i: number, kind: 'char' | 'space' };
	let last: Cand | null = null;
	for (let i = 0; i < t.length; i++) {
		const c = t[i];
		updateDepth(c, i, t, ctx);
		if (!isTopLevel(ctx)) {
			continue;
		}
		if (c === '>' || c === '+' || c === '~') {
			last = { i, kind: 'char' };
		} else if (/\s/.test(c) && (i === 0 || !/\s/.test(t[i - 1] || ''))) {
			if (
				i > 0 &&
				/\S/.test(t[i - 1] || '') &&
				t.slice(i).trim().length
			) {
				last = { i, kind: 'space' };
			}
		}
	}
	if (!last) {
		return null;
	}
	const { i, kind } = last;
	if (kind === 'char') {
		const left = t.slice(0, i).trim();
		const right = t.slice(i + 1).trim();
		const comb = t[i] || '>';
		if (!left || !right) {
			return null;
		}
		return { left, right, comb };
	}
	const left = t.slice(0, i).trim();
	let j = i;
	while (j < t.length && /\s/.test(t[j])) {
		j++;
	}
	const right = t.slice(j).trim();
	if (!left || !right) {
		return null;
	}
	return { left, right, comb: ' ' };
};

const stripOneTrailingPseudoFromEnd = (
	compound: string
): { rest: string, tail: string } | null => {
	const c = compound.trimEnd();
	if (!c) {
		return null;
	}
	// Functional pseudo-class, e.g. :not(…) — peel the whole (…) including nested parens.
	if (c.endsWith(')')) {
		let depth = 0;
		for (let j = c.length - 1; j >= 0; j--) {
			if (c[j] === ')') {
				depth++;
			} else if (c[j] === '(') {
				depth--;
				if (depth === 0) {
					if (j === 0 || c[j - 1] !== ':') {
						return null;
					}
					if (j >= 2 && c[j - 2] === ':') {
						return {
							rest: c.slice(0, j - 2).trimEnd(),
							tail: c.slice(j - 2),
						};
					}
					let n = j - 2;
					while (n >= 0 && /[a-zA-Z0-9_-]/.test(c[n] || '')) {
						n--;
					}
					if (c[n] !== ':' || c[n - 1] === ':') {
						return null;
					}
					return { rest: c.slice(0, n).trimEnd(), tail: c.slice(n) };
				}
			}
		}
		return null;
	}
	// Pseudo-element `::` must be split as one unit. Matching `^(.+)(:...|::...)$`
	// in one regex lets a single-`:` branch capture `:before` from `x:hover::before`,
	// leaving `x:hover:` in `rest` and breaking `::`.
	const mPe = c.match(/::[a-zA-Z_-][a-zA-Z0-9_-]*$/);
	if (mPe) {
		const tail = mPe[0];
		const rest = c.slice(0, c.length - tail.length).trimEnd();
		if (!rest) {
			return null;
		}
		return { rest, tail };
	}
	// Simple pseudo-class (`:hover`, not `::before`).
	const mPc = c.match(/^(.*)(:(?!:)[a-zA-Z_-][a-zA-Z0-9_-]*)$/);
	if (mPc) {
		const rest = mPc[1] ? mPc[1].trimEnd() : '';
		const tail = mPc[2] || '';
		if (!rest) {
			return null;
		}
		if (rest.endsWith('::')) {
			return null;
		}
		return { rest, tail };
	}
	return null;
};

const peekTrailingPseudosFromLastCompound = (
	compound: string
): { base: string, pseudos: string } | null => {
	let rest = compound.trim();
	const tails: string[] = [];
	// Peeling is right-to-left; e.g. .x:hover::after → :after then :hover. Reverse so
	// the suffix matches the original order (:hover::after).
	for (let n = 0, max = rest.length; n < max; n++) {
		const p = stripOneTrailingPseudoFromEnd(rest);
		if (!p) {
			break;
		}
		tails.push(p.tail);
		rest = p.rest;
	}
	if (!tails.length) {
		return null;
	}
	return { base: rest, pseudos: tails.reverse().join('') };
};

const looksLikeValidCompound = (s: string): boolean => {
	const t = s.trim();
	if (!t) {
		return false;
	}
	if (/^[\w-]+\(/.test(t) || /^{{/.test(t)) {
		return true;
	}
	return /^(?:[.#\[]|::?|\*|\|)/.test(t) || /^[a-zA-Z_][\w-]*/.test(t);
};

const splitSelectorList = (selector: string): string[] => {
	const out: string[] = [];
	let cur = '';
	let p = 0;
	let b = 0;
	let inStr: null | '"' | "'" = null;
	for (let i = 0; i < selector.length; i++) {
		const c = selector[i];
		if (inStr) {
			if (c === inStr && selector[i - 1] !== '\\') {
				inStr = null;
			}
			cur += c;
			continue;
		}
		if (c === '"' || c === "'") {
			inStr = c;
			cur += c;
			continue;
		}
		if (c === '(') {
			p++;
		} else if (c === ')' && p > 0) {
			p--;
		} else if (c === '[') {
			b++;
		} else if (c === ']' && b > 0) {
			b--;
		}
		if (c === ',' && p === 0 && b === 0) {
			if (cur.trim()) {
				out.push(cur.trim());
			}
			cur = '';
		} else {
			cur += c;
		}
	}
	if (cur.trim()) {
		out.push(cur.trim());
	}
	return out.length ? out : [selector];
};

const wrapOneSelectorForRootBody = (
	part: string,
	withHTML: boolean
): string => {
	const sel = part.trim();
	if (!sel) {
		return part;
	}
	const lastSplit = splitAtLastTopLevelCombinator(sel);
	if (!lastSplit) {
		return `${withHTML ? 'html:root' : ':root'} body :where(${sel})`;
	}
	const { left, right, comb } = lastSplit;
	const peeled = peekTrailingPseudosFromLastCompound(right);
	if (!peeled) {
		return `${withHTML ? 'html:root' : ':root'} body :where(${sel})`;
	}
	if (!looksLikeValidCompound(peeled.base)) {
		return `${withHTML ? 'html:root' : ':root'} body :where(${sel})`;
	}
	const inner = `${left}${comb === ' ' ? ' ' : ` ${comb} `}${peeled.base}`;
	return `${withHTML ? 'html:root' : ':root'} body :where(${inner})${peeled.pseudos}`;
};

export const getSelectorWithRootBody = (
	selector: string,
	withHTML: boolean = true
): string => {
	return splitSelectorList(selector)
		.map((p) => wrapOneSelectorForRootBody(p, withHTML))
		.join(', ');
};

export const getExtractedSelectorFromRootBody = (selector: string): string => {
	if (selector.includes(',')) {
		return splitSelectorList(selector)
			.map((p) => getExtractedSelectorFromRootBody(p))
			.join(', ');
	}
	const prefix = 'html:root body :where(';
	const alt = ':root body :where(';
	let rest;
	if (selector.startsWith(prefix)) {
		rest = selector.slice(prefix.length);
	} else if (selector.startsWith(alt)) {
		rest = selector.slice(alt.length);
	} else {
		const legacy = selector.match(
			/^(?:html)?:?root body :where\(([\s\S]*)\)(:[\s\S]*)?$/
		);
		if (legacy) {
			return legacy[1] || '';
		}
		return selector;
	}
	// Find the closing `)` of :where( … ) with balanced parens so inner :not(…) works;
	// not a greedy [^)]+ (would break on nested ()).
	let depth = 0;
	for (let i = 0; i < rest.length; i++) {
		const c = rest[i];
		if (c === '(') {
			depth++;
		} else if (c === ')' && depth > 0) {
			depth--;
		} else if (c === ')' && depth === 0) {
			return rest.slice(0, i);
		}
	}
	return rest;
};
