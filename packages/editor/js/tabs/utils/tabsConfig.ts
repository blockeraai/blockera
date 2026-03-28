/**
 * WordPress dependencies
 */
import { applyFilters } from '@wordpress/hooks';

export interface TabsLimitsConfig {
	regular: number;
	recentlyClosed: number;
	pinned: number;
}

export interface TabsConfig {
	limits: TabsLimitsConfig;
}

const DEFAULT_TABS_CONFIG: TabsConfig = {
	limits: {
		regular: 3,
		recentlyClosed: 3,
		pinned: 1,
	},
};

function normalizeLimit(value: unknown, fallback: number): number {
	if (value === Infinity) {
		return Infinity;
	}

	if (typeof value !== 'number') {
		return fallback;
	}

	if (!Number.isFinite(value)) {
		return fallback;
	}

	if (value < 0) {
		return Infinity;
	}

	return Math.floor(value);
}

export function resolveTabsConfig(): TabsConfig {
	const filtered = applyFilters(
		'blockera.editor.tabs',
		DEFAULT_TABS_CONFIG
	) as Partial<TabsConfig>;

	const limits = filtered?.limits || {};

	return {
		...DEFAULT_TABS_CONFIG,
		...filtered,
		limits: {
			regular: normalizeLimit(
				(limits as Partial<TabsLimitsConfig>).regular,
				DEFAULT_TABS_CONFIG.limits.regular
			),
			recentlyClosed: normalizeLimit(
				(limits as Partial<TabsLimitsConfig>).recentlyClosed,
				DEFAULT_TABS_CONFIG.limits.recentlyClosed
			),
			pinned: normalizeLimit(
				(limits as Partial<TabsLimitsConfig>).pinned,
				DEFAULT_TABS_CONFIG.limits.pinned
			),
		},
	};
}

export function hasReachedLimit(count: number, limit: number): boolean {
	return Number.isFinite(limit) && count >= limit;
}
