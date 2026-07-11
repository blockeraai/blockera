/**
 * Blockera dependencies
 */
import {
	THEME_JSON_PRESET_METADATA_BASE,
	resolveThemeJsonPresetCssDeclarationValue,
	BLOCKERA_PRESET_METADATA_PATHS,
} from '@blockera/data';

/**
 * Preset buckets already emitted by core {@see generateGlobalStyles} in
 * `@wordpress/global-styles-engine` (see `PRESET_METADATA` in that package).
 */
const CORE_ENGINE_CSS_VAR_INFIXES = new Set([
	'color',
	'gradient',
	'duotone',
	'shadow',
	'font-size',
	'font-family',
	'spacing',
	'border-radius',
	'dimension',
]);

const BLOCKERA_ONLY_PRESET_ROWS: Array<{
	path: string[];
	cssVarInfix: string;
}> = [
	{
		path: [...BLOCKERA_PRESET_METADATA_PATHS.BORDER_PRESETS],
		cssVarInfix: 'border',
	},
	{
		path: [...BLOCKERA_PRESET_METADATA_PATHS.TRANSITION_PRESETS],
		cssVarInfix: 'transition',
	},
	{
		path: [...BLOCKERA_PRESET_METADATA_PATHS.TRANSFORM_PRESETS],
		cssVarInfix: 'transform',
	},
	{
		path: [...BLOCKERA_PRESET_METADATA_PATHS.FILTER_PRESETS],
		cssVarInfix: 'filter',
	},
	{
		path: [...BLOCKERA_PRESET_METADATA_PATHS.TEXT_SHADOW_PRESETS],
		cssVarInfix: 'text-shadow',
	},
];

const PRESET_ORIGINS = ['default', 'theme', 'custom'] as const;

type PresetRow = Record<string, unknown>;

function isPlainObject(value: unknown): value is Record<string, unknown> {
	return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function getAtPath(object: Record<string, unknown>, path: string[]): unknown {
	let current: unknown = object;
	for (const segment of path) {
		if (!isPlainObject(current)) {
			return undefined;
		}
		current = current[segment];
	}
	return current;
}

function normalizeSlug(slug: unknown): string {
	return String(slug ?? '')
		.trim()
		.toLowerCase()
		.replace(/[^a-z0-9-]/g, '-');
}

function collectPresetDeclarations(
	settings: Record<string, unknown>,
	path: string[],
	cssVarInfix: string
): string[] {
	const group = getAtPath(settings, path);
	if (!isPlainObject(group)) {
		return [];
	}

	const declarations: string[] = [];

	for (const origin of PRESET_ORIGINS) {
		const items = group[origin];
		if (!Array.isArray(items)) {
			continue;
		}

		for (const item of items) {
			if (!isPlainObject(item)) {
				continue;
			}
			const preset = item as PresetRow;
			const slug = normalizeSlug(preset.slug);
			if (!slug) {
				continue;
			}
			const value = resolveThemeJsonPresetCssDeclarationValue(
				preset,
				cssVarInfix
			);
			if (!value) {
				continue;
			}
			declarations.push(
				`--wp--preset--${cssVarInfix}--${slug}: ${value}`
			);
		}
	}

	return declarations;
}

/**
 * CSS custom properties for Blockera / extended theme.json preset paths that
 * core `generateGlobalStyles` does not emit (e.g. `blockera.blockeraLineHeights`).
 *
 * Parity target: variables slice of {@see blockera_get_global_stylesheet()}.
 */
export function generateBlockeraSupplementalPresetVariablesCss(
	settings: Record<string, unknown> | undefined
): string {
	if (!settings) {
		return '';
	}

	const declarations: string[] = [];

	for (const row of THEME_JSON_PRESET_METADATA_BASE) {
		if (CORE_ENGINE_CSS_VAR_INFIXES.has(row.cssVarInfix)) {
			continue;
		}
		declarations.push(
			...collectPresetDeclarations(settings, row.path, row.cssVarInfix)
		);
	}

	for (const row of BLOCKERA_ONLY_PRESET_ROWS) {
		declarations.push(
			...collectPresetDeclarations(settings, row.path, row.cssVarInfix)
		);
	}

	if (!declarations.length) {
		return '';
	}

	return `:root{${declarations.join(';')};}`;
}
