// @flow
/**
 * Theme.json preset/custom token resolution (`var:preset|…`, `var(--wp--preset--…)`) using merged
 * settings trees — shared by `@blockera/controls`, `@blockera/global-styles-ui`, and editor hooks.
 */

/**
 * External dependencies
 */
import { select } from '@wordpress/data';

/**
 * Internal dependencies
 */
import { normalizePresetSize } from './normalize-preset-sizes';

export type ThemeJsonPresetResolutionRow = {|
	path: $ReadOnlyArray<string>,
	valueKey: string,
	cssVarInfix: string,
|};

type JsonObject = { +[string]: mixed };

const USER_VALUE_PREFIX = 'var:';
const THEME_VALUE_PREFIX = 'var(--wp--';
const THEME_VALUE_SUFFIX = ')';

/** Split `var:|…` or `var(--wp--…)` payloads into pipe-or-double-dash segments (same rules as resolution). */
function splitThemeJsonVariableSegments(token: string): Array<string> | void {
	if (token.startsWith(USER_VALUE_PREFIX)) {
		return token.slice(USER_VALUE_PREFIX.length).split('|');
	}
	if (
		token.startsWith(THEME_VALUE_PREFIX) &&
		token.endsWith(THEME_VALUE_SUFFIX)
	) {
		return token
			.slice(THEME_VALUE_PREFIX.length, -THEME_VALUE_SUFFIX.length)
			.split('--');
	}
	return undefined;
}

export type ParsedThemeJsonVariableToken =
	| {| kind: 'preset', cssVarInfix: string, slug: string |}
	| {| kind: 'custom', path: Array<string> |};

/** Result of resolving a plain preset slug against merged theme.json preset rows. */
export type PlainThemeJsonPresetSlugResolution = {|
	cssVarInfix: string,
	valueKey: string,
	leaf: mixed,
|};

/**
 * Parses a theme.json **preset** (`var:preset|…` / `var(--wp--preset--…)`) or **custom**
 * (`var:custom|…` / `var(--wp--custom--…)`) token. Other `var:` shapes return null.
 */
export function parseThemeJsonVariableToken(
	token: string
): ParsedThemeJsonVariableToken | null {
	const segments = splitThemeJsonVariableSegments(token);
	if (!segments?.length) {
		return null;
	}
	const [type, ...pathParts] = segments;
	if (type === 'preset') {
		const cssVarInfix = pathParts[0];
		const slug = pathParts.slice(1).join('|');
		if (!cssVarInfix || slug === '') {
			return null;
		}
		return { kind: 'preset', cssVarInfix, slug };
	}
	if (type === 'custom') {
		if (!pathParts.length) {
			return null;
		}
		return { kind: 'custom', path: [...pathParts] };
	}
	return null;
}

/** Minimal preset rows aligned with `theme.json` preset arrays (paths / value keys / CSS var infixes). */
export const THEME_JSON_PRESET_METADATA_BASE: $ReadOnlyArray<ThemeJsonPresetResolutionRow> =
	[
		{
			path: ['color', 'palette'],
			valueKey: 'color',
			cssVarInfix: 'color',
		},
		{
			path: ['color', 'gradients'],
			valueKey: 'gradient',
			cssVarInfix: 'gradient',
		},
		{
			path: ['color', 'duotone'],
			valueKey: 'colors',
			cssVarInfix: 'duotone',
		},
		{
			path: ['shadow', 'presets'],
			valueKey: 'shadow',
			cssVarInfix: 'shadow',
		},
		{
			path: ['typography', 'fontSizes'],
			valueKey: 'size',
			cssVarInfix: 'font-size',
		},
		{
			path: ['typography', 'blockeraLineHeights'],
			valueKey: 'size',
			cssVarInfix: 'line-height',
		},
		{
			path: ['typography', 'fontFamilies'],
			valueKey: 'fontFamily',
			cssVarInfix: 'font-family',
		},
		{
			path: ['spacing', 'spacingSizes'],
			valueKey: 'size',
			cssVarInfix: 'spacing',
		},
		{
			path: ['blockeraWidthSizes'],
			valueKey: 'size',
			cssVarInfix: 'width-size',
		},
		{
			path: ['border', 'radiusSizes'],
			valueKey: 'size',
			cssVarInfix: 'border-radius',
		},
		{
			path: ['blockeraDimensionSizes'],
			valueKey: 'size',
			cssVarInfix: 'dimension',
		},
	];

export function getValueFromObjectPath(
	object: JsonObject | void,
	path: string | Array<string>,
	defaultValue?: mixed
): mixed {
	const arrayPath = Array.isArray(path) ? path : path.split('.');
	let val: mixed = object;
	arrayPath.forEach((fieldName) => {
		if (val && typeof val === 'object' && val !== null) {
			val = (val: JsonObject)[fieldName];
		} else {
			val = undefined;
		}
	});
	return val !== undefined && val !== null ? val : defaultValue;
}

export function findInPresetsBy(
	features: JsonObject,
	blockName: string,
	presetPath: Array<string>,
	presetProperty: string,
	presetValueValue: string
): JsonObject | void {
	const orderedPresetsByOrigin = [
		getValueFromObjectPath(features, ['blocks', blockName, ...presetPath]),
		getValueFromObjectPath(features, presetPath),
	];

	for (const presetByOrigin of orderedPresetsByOrigin) {
		if (presetByOrigin && typeof presetByOrigin === 'object') {
			const origins = ['custom', 'theme', 'default'];
			for (const origin of origins) {
				const presets = (presetByOrigin: JsonObject)[origin];
				if (presets && Array.isArray(presets)) {
					const presetObject = presets.find(
						(preset) =>
							typeof preset === 'object' &&
							preset !== null &&
							(preset: JsonObject)[presetProperty] ===
								presetValueValue
					);
					if (
						presetObject &&
						typeof presetObject === 'object' &&
						presetObject !== null
					) {
						const po: JsonObject = presetObject;
						if (presetProperty === 'slug') {
							return po;
						}
						const highestPresetObjectWithSameSlug = findInPresetsBy(
							features,
							blockName,
							presetPath,
							'slug',
							String(po.slug)
						);
						if (
							highestPresetObjectWithSameSlug &&
							highestPresetObjectWithSameSlug[presetProperty] ===
								po[presetProperty]
						) {
							return po;
						}
						return undefined;
					}
				}
			}
		}
	}
	return undefined;
}

function getValueFromPresetVariable(
	features: JsonObject,
	blockName: string,
	variable: string,
	pathParts: Array<string>
): mixed {
	const presetType = pathParts[0];
	const slug = pathParts.slice(1).join('|');
	if (!presetType || slug === '') {
		return variable;
	}

	const metadata = THEME_JSON_PRESET_METADATA_BASE.find(
		(data) => data.cssVarInfix === presetType
	);
	if (!metadata) {
		return variable;
	}

	const settings = features.settings;
	if (!settings || typeof settings !== 'object') {
		return variable;
	}

	const presetObject = findInPresetsBy(
		(settings: JsonObject),
		blockName,
		[...metadata.path],
		'slug',
		slug
	);

	if (presetObject) {
		const { valueKey } = metadata;
		const result = presetObject[valueKey];
		return getValueFromVariable(features, blockName, result);
	}

	return variable;
}

function getValueFromCustomVariable(
	features: JsonObject,
	blockName: string,
	variable: string,
	path: Array<string>
): mixed {
	const settings = features.settings;
	const settingsObj =
		settings && typeof settings === 'object' ? (settings: JsonObject) : {};
	const result =
		getValueFromObjectPath(settingsObj, [
			'blocks',
			blockName,
			'custom',
			...path,
		]) ?? getValueFromObjectPath(settingsObj, ['custom', ...path]);
	if (!result) {
		return variable;
	}
	return getValueFromVariable(features, blockName, result);
}

/**
 * Resolves a theme.json-style token (`var:preset|…`, `var(--wp--preset--…)`, custom `var:` refs).
 */
export function getValueFromVariable(
	features: JsonObject,
	blockName: string,
	variable: mixed
): mixed {
	let current: mixed = variable;

	if (!current || typeof current !== 'string') {
		if (
			typeof current === 'object' &&
			current !== null &&
			typeof current.ref === 'string'
		) {
			current = getValueFromObjectPath(features, current.ref);
			if (
				!current ||
				(typeof current === 'object' &&
					current !== null &&
					'ref' in current &&
					current.ref)
			) {
				return current !== undefined && current !== null
					? current
					: variable;
			}
		} else {
			return variable;
		}
	}

	if (typeof current !== 'string') {
		return variable;
	}

	const token = current;

	const parsedVar = splitThemeJsonVariableSegments(token);
	if (!parsedVar) {
		return token;
	}

	const [type, ...pathParts] = parsedVar;
	if (type === 'preset') {
		return getValueFromPresetVariable(
			features,
			blockName,
			token,
			pathParts
		);
	}
	if (type === 'custom') {
		return getValueFromCustomVariable(
			features,
			blockName,
			token,
			pathParts
		);
	}
	return token;
}

/**
 * Normalize block-editor `__experimentalFeatures` into `{ settings: … }` for preset lookups.
 */
export function wrapExperimentalFeaturesRaw(
	raw: JsonObject | null | void
): JsonObject | void {
	if (!raw || typeof raw !== 'object') {
		return undefined;
	}
	if ('settings' in raw && raw.settings && typeof raw.settings === 'object') {
		return raw;
	}
	return { settings: raw };
}

export function getWpMergedExperimentalFeaturesWrapped(): JsonObject | void {
	try {
		const editorSettings = select('core/block-editor')?.getSettings?.();
		const xf = editorSettings?.__experimentalFeatures;
		return wrapExperimentalFeaturesRaw(xf);
	} catch {
		return undefined;
	}
}

/**
 * True when `value` is a parsable theme.json **preset** or **custom** variable token
 * (`var:preset|…`, `var:custom|…`, `var(--wp--preset--…)`, `var(--wp--custom--…)`).
 */
export function isThemeJsonVariableResolutionCandidateString(
	value: mixed
): boolean {
	return (
		typeof value === 'string' && parseThemeJsonVariableToken(value) !== null
	);
}

/**
 * Whether a **preset slug** exists
 * in merged editor theme.json preset arrays (`featuresWrapped` = `{ settings: mergedSettings }`,
 * e.g. wrapped `__experimentalFeatures` from `core/block-editor`).
 *
 * When `presetCssVarInfix` is set (e.g. `'color'`), only that preset bucket is searched; otherwise
 * all known preset paths from {@link THEME_JSON_PRESET_METADATA_BASE} are checked.
 */
export function isThemeJsonVariableDefinedInMergedFeatures(
	featuresWrapped: JsonObject | null | void,
	stringValue: string,
	blockName: string = '',
	presetCssVarInfix?: string
): boolean {
	if (!featuresWrapped || typeof stringValue !== 'string') {
		return false;
	}
	const settings = featuresWrapped.settings;
	if (!settings || typeof settings !== 'object') {
		return false;
	}
	const settingsObj = (settings: JsonObject);

	const rows = presetCssVarInfix
		? THEME_JSON_PRESET_METADATA_BASE.filter(
				(row) => row.cssVarInfix === presetCssVarInfix
			)
		: [...THEME_JSON_PRESET_METADATA_BASE];

	for (const metadata of rows) {
		if (
			findInPresetsBy(
				settingsObj,
				blockName,
				[...metadata.path],
				'slug',
				stringValue
			)
		) {
			return true;
		}
	}
	return false;
}

/**
 * Whether the slug exists on merged features from the block editor store (false if unavailable).
 */
export function isThemeJsonVariableDefinedInWpEditor(
	stringValue: string,
	blockName: string = '',
	presetCssVarInfix?: string
): boolean {
	const wrapped = getWpMergedExperimentalFeaturesWrapped();
	return isThemeJsonVariableDefinedInMergedFeatures(
		wrapped,
		stringValue,
		blockName,
		presetCssVarInfix
	);
}

/**
 * Turns a resolved preset **leaf** (after {@link getValueFromVariable}) into a scalar string for UI
 * (swatches, labels). Recognizes shapes implied by {@link THEME_JSON_PRESET_METADATA_BASE} buckets.
 *
 * @param cssVarInfix Preset bucket key (`color`, `gradient`, `font-size`, …).
 * @param leaf Resolved value — string, preset-shaped object, or nested ref output.
 * @return {string} Best-effort display string; empty when unknown / non-scalar.
 */
export function normalizeThemeJsonPresetLeafForScalarUi(
	cssVarInfix: string,
	leaf: mixed
): string {
	if (typeof leaf === 'string') {
		return leaf;
	}
	if (leaf === null || leaf === undefined) {
		return '';
	}
	if (typeof leaf !== 'object') {
		return String(leaf);
	}
	if (Array.isArray(leaf)) {
		if (cssVarInfix === 'duotone') {
			const parts = leaf.filter((c: mixed) => typeof c === 'string');
			return parts.join(', ');
		}
		return '';
	}

	const o: JsonObject = (leaf: any);

	switch (cssVarInfix) {
		case 'color':
			return typeof o.color === 'string' ? o.color : '';
		case 'gradient':
			return typeof o.gradient === 'string' ? o.gradient : '';
		case 'duotone':
			if (Array.isArray(o.colors)) {
				const colors = ((o.colors: any): mixed[]).filter(
					(c) => typeof c === 'string'
				);
				return colors.join(', ');
			}
			return '';
		case 'font-size':
		case 'line-height':
		case 'spacing':
		case 'border-radius':
		case 'dimension':
			return typeof o.size === 'string'
				? normalizePresetSize(o.size)
				: '';
		case 'font-family':
			return typeof o.fontFamily === 'string' ? o.fontFamily : '';
		case 'shadow':
			return typeof o.shadow === 'string' ? o.shadow : '';
		default:
			if (typeof o.color === 'string') {
				return o.color;
			}
			if (typeof o.gradient === 'string') {
				return o.gradient;
			}
			if (typeof o.size === 'string') {
				return o.size;
			}
			if (typeof o.fontFamily === 'string') {
				return o.fontFamily;
			}
			return '';
	}
}

/**
 * Locate a plain preset slug in merged editor features and return bucket metadata plus resolved leaf.
 *
 * @return {?PlainThemeJsonPresetSlugResolution} Match info, or null when not found.
 */
export function resolvePlainThemeJsonPresetSlugResolutionFromWpEditor(
	slug: string,
	blockName: string = '',
	presetCssVarInfix?: string
): PlainThemeJsonPresetSlugResolution | null {
	const wrapped = getWpMergedExperimentalFeaturesWrapped();
	if (!wrapped || typeof slug !== 'string' || slug === '') {
		return null;
	}
	const settings = wrapped.settings;
	if (!settings || typeof settings !== 'object') {
		return null;
	}
	const settingsObj = (settings: JsonObject);

	const rows = presetCssVarInfix
		? THEME_JSON_PRESET_METADATA_BASE.filter(
				(row) => row.cssVarInfix === presetCssVarInfix
			)
		: [...THEME_JSON_PRESET_METADATA_BASE];

	for (const metadata of rows) {
		const presetObject = findInPresetsBy(
			settingsObj,
			blockName,
			[...metadata.path],
			'slug',
			slug
		);
		if (
			presetObject &&
			typeof presetObject === 'object' &&
			presetObject !== null
		) {
			const raw = (presetObject: JsonObject)[metadata.valueKey];
			const leaf = getValueFromVariable(wrapped, blockName, raw);
			return {
				cssVarInfix: metadata.cssVarInfix,
				valueKey: metadata.valueKey,
				leaf,
			};
		}
	}
	return null;
}

/**
 * Resolve a **plain preset slug** string (snake_case attribute value, no `var:` wrapper) to the
 * preset’s resolved paint/value via merged `core/block-editor` features — same lookup paths as
 * `var:preset|{infix}|{slug}` resolution.
 *
 * When `presetCssVarInfix` is set (e.g. `'color'`), only that preset bucket is searched; otherwise
 * metadata rows are tried in declaration order.
 *
 * @return {*} Resolved leaf (often a CSS color or gradient string), or empty string when not found.
 */
export function resolvePlainThemeJsonPresetSlugValueFromWpEditor(
	slug: string,
	blockName: string = '',
	presetCssVarInfix?: string
): mixed {
	const hit = resolvePlainThemeJsonPresetSlugResolutionFromWpEditor(
		slug,
		blockName,
		presetCssVarInfix
	);
	if (!hit) {
		return '';
	}
	return hit.leaf;
}

export type ResolveThemeJsonPaintPresetStringFromWpEditorOptions = {|
	+value?: string,
	+presetSlug?: string,
	+blockName?: string,
	+presetCssVarInfix?: string,
	+variablePickerType?: string,
	+expandPlainPresetSlugInValue?: boolean,
|};

/**
 * Preset bucket hint for color / gradient variable-picker categories (narrows slug lookup).
 */
export function inferPresetCssVarInfixForPaintVariablePickerType(
	type?: string
): string | void {
	switch (type) {
		case 'color':
			return 'color';
		case 'linear-gradient':
		case 'radial-gradient':
			return 'gradient';
		default:
			return undefined;
	}
}

/**
 * Resolves theme.json color or gradient preset values for UI paint (swatches, icons): `var:preset|…`,
 * `var(--wp--preset--…)`, plain preset slugs, and slug fallback when `value` is empty.
 */
export function resolveThemeJsonPaintPresetStringFromWpEditor(
	options: ResolveThemeJsonPaintPresetStringFromWpEditorOptions
): string {
	const {
		value,
		presetSlug,
		blockName: blockNameOpt,
		presetCssVarInfix,
		variablePickerType,
		expandPlainPresetSlugInValue,
	} = options;
	const blockName = typeof blockNameOpt === 'string' ? blockNameOpt : '';

	let visual = typeof value === 'string' && value !== '' ? value : '';

	const explicitInfix =
		typeof presetCssVarInfix === 'string' && presetCssVarInfix !== ''
			? presetCssVarInfix
			: undefined;
	const bucketHint =
		explicitInfix ??
		inferPresetCssVarInfixForPaintVariablePickerType(variablePickerType);

	if (!visual && typeof presetSlug === 'string' && presetSlug !== '') {
		const hit = resolvePlainThemeJsonPresetSlugResolutionFromWpEditor(
			presetSlug,
			blockName,
			bucketHint
		);
		if (hit) {
			visual = normalizeThemeJsonPresetLeafForScalarUi(
				hit.cssVarInfix,
				hit.leaf
			);
		}
	}

	const expandSlug =
		expandPlainPresetSlugInValue !== false &&
		visual &&
		typeof visual === 'string' &&
		!isThemeJsonVariableResolutionCandidateString(visual) &&
		isThemeJsonVariableDefinedInWpEditor(visual, blockName);
	if (expandSlug) {
		const hit = resolvePlainThemeJsonPresetSlugResolutionFromWpEditor(
			visual,
			blockName
		);
		if (hit) {
			const normalized = normalizeThemeJsonPresetLeafForScalarUi(
				hit.cssVarInfix,
				hit.leaf
			);
			if (normalized !== '') {
				visual = normalized;
			}
		}
	}

	if (visual && isThemeJsonVariableResolutionCandidateString(visual)) {
		return resolveThemeJsonVariableStringFromWpEditor(visual, blockName);
	}

	return typeof visual === 'string' ? visual : '';
}

/**
 * Resolves preset/custom strings using live `core/block-editor` merged `__experimentalFeatures`.
 */
export function resolveThemeJsonVariableStringFromWpEditor(
	stringValue: string,
	blockName: string = ''
): string {
	if (
		typeof stringValue !== 'string' ||
		parseThemeJsonVariableToken(stringValue) === null
	) {
		return stringValue;
	}
	const wrapped = getWpMergedExperimentalFeaturesWrapped();
	if (!wrapped) {
		return stringValue;
	}
	const resolved = getValueFromVariable(wrapped, blockName, stringValue);
	return typeof resolved === 'string' ? resolved : stringValue;
}
