// @flow

/**
 * Blockera dependencies
 */
import { getValueAddonRealValue } from '@blockera/controls';

/**
 * Horizontal gap for grid minmax math (core: left part of blockGap when two values).
 *
 * @param {Object|void} blockeraGapAttr Raw blockeraGap attribute (may be { value: {...} }).
 * @param {string} fallbackGap
 * @return {string} Horizontal gap token for grid-template calc (second axis if two-part gap).
 */
export function getHorizontalGapForGrid(
	blockeraGapAttr: ?Object,
	fallbackGap: string = '1.2rem'
): string {
	if (!blockeraGapAttr) {
		return fallbackGap;
	}
	const gap = blockeraGapAttr.value ?? blockeraGapAttr;
	if (!gap || typeof gap !== 'object') {
		return fallbackGap;
	}

	let raw = '';
	if (gap.lock) {
		if (gap.gap) {
			const v = getValueAddonRealValue(gap.gap);
			raw = typeof v === 'string' ? v : '';
		}
	} else if (gap.columns) {
		const v = getValueAddonRealValue(gap.columns);
		raw = typeof v === 'string' ? v : '';
	} else if (gap.gap) {
		const v = getValueAddonRealValue(gap.gap);
		raw = typeof v === 'string' ? v : '';
	}

	const normalized = normalizeGapHorizontal(raw);
	return normalized !== '' ? normalized : fallbackGap;
}

function normalizeGapHorizontal(css: string): string {
	const t = css.trim();
	if (t === '') {
		return '';
	}
	// Same as PHP GridLayout::normalize_gap_horizontal: do not split var()/clamp()/calc() values.
	if (t.includes('(')) {
		return t;
	}
	const parts = t.split(/\s+/u);
	return parts.length > 1 ? parts[1] : parts[0];
}

function ensureGapUnit(g: string | number): string {
	if (g === '0' || g === 0) {
		return '0px';
	}
	return String(g);
}

/**
 * grid-template-columns (+ optional container-type) matching core getLayoutStyle().
 *
 * @param {string} minimumColumnWidth Trimmed CSS length or ''.
 * @param {number} columnCount        > 0 when set; 0 when unset.
 * @param {string} horizontalGap      Resolved gap for calc (e.g. 1.2rem).
 * @return {Object} Map of CSS properties (`grid-template-columns`, optional `container-type`).
 */
export function getGridLayoutCssProperties(
	minimumColumnWidth: string,
	columnCount: number,
	horizontalGap: string
): { [string]: string } {
	const min = minimumColumnWidth.trim();
	const count = columnCount > 0 ? columnCount : 0;

	let blockGapToUse = horizontalGap || '1.2rem';
	blockGapToUse = ensureGapUnit(blockGapToUse);

	if (min !== '' && count > 0) {
		const maxValue = `max(min( ${min}, 100%), ( 100% - (${blockGapToUse}*${
			count - 1
		}) ) / ${count})`;
		return {
			'grid-template-columns': `repeat(auto-fill, minmax(${maxValue}, 1fr))`,
			'container-type': 'inline-size',
		};
	}

	if (count > 0) {
		return {
			'grid-template-columns': `repeat(${count}, minmax(0, 1fr))`,
		};
	}

	const minOrDefault = min !== '' ? min : '12rem';
	return {
		'grid-template-columns': `repeat(auto-fill, minmax(min(${minOrDefault}, 100%), 1fr))`,
		'container-type': 'inline-size',
	};
}
