/**
 * External dependencies
 */
import fastDeepEqual from 'fast-deep-equal/es6';
import { useViewportMatch } from '@wordpress/compose';
import { getCSSValueFromRawStyle } from '@wordpress/style-engine';

/**
 * Internal dependencies
 */
import {
	PRESET_METADATA,
	STYLE_PATH_TO_CSS_VAR_INFIX,
} from './theme-json-preset-data';

export const ROOT_BLOCK_SELECTOR = 'body';
export const ROOT_CSS_PROPERTIES_SELECTOR = ':root';

export function useToolsPanelDropdownMenuProps(): Record<string, unknown> {
	const isMobile = useViewportMatch('medium', '<');
	return !isMobile
		? {
				popoverProps: {
					placement: 'left-start',
					offset: 259,
				},
			}
		: {};
}

function findInPresetsBy(
	features: Record<string, unknown>,
	blockName: string,
	presetPath: string[],
	presetProperty: string,
	presetValueValue: string
): Record<string, unknown> | undefined {
	const orderedPresetsByOrigin = [
		getValueFromObjectPath(features, ['blocks', blockName, ...presetPath]),
		getValueFromObjectPath(features, presetPath),
	];

	for (const presetByOrigin of orderedPresetsByOrigin) {
		if (presetByOrigin && typeof presetByOrigin === 'object') {
			const origins = ['custom', 'theme', 'default'];
			for (const origin of origins) {
				const presets = (presetByOrigin as Record<string, unknown>)[
					origin
				] as unknown[] | undefined;
				if (presets) {
					const presetObject = presets.find(
						(preset) =>
							typeof preset === 'object' &&
							preset !== null &&
							(preset as Record<string, unknown>)[
								presetProperty
							] === presetValueValue
					) as Record<string, unknown> | undefined;
					if (presetObject) {
						if (presetProperty === 'slug') {
							return presetObject;
						}
						const highestPresetObjectWithSameSlug = findInPresetsBy(
							features,
							blockName,
							presetPath,
							'slug',
							String(presetObject.slug)
						);
						if (
							highestPresetObjectWithSameSlug &&
							highestPresetObjectWithSameSlug[presetProperty] ===
								presetObject[presetProperty]
						) {
							return presetObject;
						}
						return undefined;
					}
				}
			}
		}
	}
	return undefined;
}

export function getPresetVariableFromValue(
	features: Record<string, unknown>,
	blockName: string,
	variableStylePath: string,
	presetPropertyValue: string
): string | Record<string, unknown> {
	if (!presetPropertyValue) {
		return presetPropertyValue;
	}

	const cssVarInfix =
		STYLE_PATH_TO_CSS_VAR_INFIX[variableStylePath] ?? undefined;

	const metadata = PRESET_METADATA.find(
		(data) => data.cssVarInfix === cssVarInfix
	);

	if (!metadata) {
		return presetPropertyValue;
	}
	const { valueKey, path } = metadata;

	const presetObject = findInPresetsBy(
		features,
		blockName,
		path,
		valueKey,
		presetPropertyValue
	);

	if (!presetObject) {
		return presetPropertyValue;
	}

	return `var:preset|${cssVarInfix}|${String(presetObject.slug)}`;
}

function getValueFromPresetVariable(
	features: Record<string, unknown>,
	blockName: string,
	variable: string,
	[presetType, slug]: [string, string]
): string | Record<string, unknown> {
	const metadata = PRESET_METADATA.find(
		(data) => data.cssVarInfix === presetType
	);
	if (!metadata) {
		return variable;
	}

	const settings = features.settings as Record<string, unknown> | undefined;
	if (!settings) {
		return variable;
	}

	const presetObject = findInPresetsBy(
		settings,
		blockName,
		metadata.path,
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
	features: Record<string, unknown>,
	blockName: string,
	variable: string,
	path: string[]
): string | Record<string, unknown> {
	const settings = features.settings as Record<string, unknown> | undefined;
	const result =
		getValueFromObjectPath(settings ?? {}, [
			'blocks',
			blockName,
			'custom',
			...path,
		]) ?? getValueFromObjectPath(settings ?? {}, ['custom', ...path]);
	if (!result) {
		return variable;
	}
	return getValueFromVariable(features, blockName, result);
}

/**
 * Attempts to fetch the value of a theme.json CSS variable.
 */
export function getValueFromVariable(
	features: Record<string, unknown>,
	blockName: string,
	variable: string | Record<string, unknown>
): string | Record<string, unknown> {
	let current: string | Record<string, unknown> | undefined = variable;

	if (!current || typeof current !== 'string') {
		if (
			typeof current === 'object' &&
			current !== null &&
			typeof (current as { ref?: string }).ref === 'string'
		) {
			current = getValueFromObjectPath(
				features,
				(current as { ref: string }).ref
			);
			if (
				!current ||
				(typeof current === 'object' &&
					current !== null &&
					'ref' in current &&
					(current as { ref?: unknown }).ref)
			) {
				return current ?? variable;
			}
		} else {
			return variable;
		}
	}

	const USER_VALUE_PREFIX = 'var:';
	const THEME_VALUE_PREFIX = 'var(--wp--';
	const THEME_VALUE_SUFFIX = ')';

	let parsedVar: string[];

	if (current.startsWith(USER_VALUE_PREFIX)) {
		parsedVar = current.slice(USER_VALUE_PREFIX.length).split('|');
	} else if (
		current.startsWith(THEME_VALUE_PREFIX) &&
		current.endsWith(THEME_VALUE_SUFFIX)
	) {
		parsedVar = current
			.slice(THEME_VALUE_PREFIX.length, -THEME_VALUE_SUFFIX.length)
			.split('--');
	} else {
		return current;
	}

	const [type, ...pathParts] = parsedVar;
	if (type === 'preset') {
		return getValueFromPresetVariable(
			features,
			blockName,
			current,
			pathParts as [string, string]
		);
	}
	if (type === 'custom') {
		return getValueFromCustomVariable(
			features,
			blockName,
			current,
			pathParts
		);
	}
	return current;
}

export function scopeSelector(scope: string, selector: string): string {
	if (!scope || !selector) {
		return selector;
	}

	const scopes = scope.split(',');
	const selectors = selector.split(',');

	const selectorsScoped: string[] = [];
	scopes.forEach((outer) => {
		selectors.forEach((inner) => {
			selectorsScoped.push(`${outer.trim()} ${inner.trim()}`);
		});
	});

	return selectorsScoped.join(', ');
}

export function scopeFeatureSelectors(
	scope: string,
	selectors: Record<string, unknown>
): Record<string, unknown> | undefined {
	if (!scope || !selectors) {
		return;
	}

	const featureSelectors: Record<string, unknown> = {};

	Object.entries(selectors).forEach(([feature, selector]) => {
		if (typeof selector === 'string') {
			featureSelectors[feature] = scopeSelector(scope, selector);
		}

		if (typeof selector === 'object' && selector !== null) {
			featureSelectors[feature] = {};

			Object.entries(selector as Record<string, string>).forEach(
				([subfeature, subfeatureSelector]) => {
					(featureSelectors[feature] as Record<string, string>)[
						subfeature
					] = scopeSelector(scope, subfeatureSelector);
				}
			);
		}
	});

	return featureSelectors;
}

export function appendToSelector(selector: string, toAppend: string): string {
	if (!selector.includes(',')) {
		return selector + toAppend;
	}
	const selectors = selector.split(',');
	const newSelectors = selectors.map((sel) => sel + toAppend);
	return newSelectors.join(',');
}

export function areGlobalStyleConfigsEqual(
	original: Record<string, unknown>,
	variation: Record<string, unknown>
): boolean {
	if (typeof original !== 'object' || typeof variation !== 'object') {
		return original === variation;
	}
	return (
		fastDeepEqual(original?.styles, variation?.styles) &&
		fastDeepEqual(original?.settings, variation?.settings)
	);
}

export function getBlockStyleVariationSelector(
	variation: string,
	blockSelector: string
): string {
	const variationClass = `.is-style-${variation}`;

	if (!blockSelector) {
		return variationClass;
	}

	const ancestorRegex = /((?::\([^)]+\))?\s*)([^\s:]+)/;
	const addVariationClass = (
		_match: string,
		group1: string,
		group2: string
	) => {
		return group1 + group2 + variationClass;
	};

	const result = blockSelector
		.split(',')
		.map((part) => part.replace(ancestorRegex, addVariationClass));

	return result.join(',');
}

export function getResolvedThemeFilePath(
	file: string,
	themeFileURIs: Array<Record<string, unknown>>
): string {
	if (!file || !themeFileURIs || !Array.isArray(themeFileURIs)) {
		return file;
	}

	const uri = themeFileURIs.find(
		(themeFileUri) => themeFileUri?.name === file
	);

	if (!uri?.href) {
		return file;
	}

	return String(uri.href);
}

export function getResolvedRefValue(
	ruleValue: Record<string, unknown> | string,
	tree: Record<string, unknown>
): Record<string, unknown> | string | undefined {
	if (!ruleValue || !tree) {
		return ruleValue;
	}

	if (typeof ruleValue !== 'string' && ruleValue?.ref) {
		const resolvedRuleValue = getCSSValueFromRawStyle(
			getValueFromObjectPath(tree, String(ruleValue.ref))
		) as Record<string, unknown> | string | undefined;

		if (
			resolvedRuleValue &&
			typeof resolvedRuleValue === 'object' &&
			'ref' in resolvedRuleValue &&
			(resolvedRuleValue as { ref?: unknown }).ref
		) {
			return undefined;
		}

		if (resolvedRuleValue === undefined) {
			return ruleValue;
		}

		return resolvedRuleValue;
	}
	return ruleValue;
}

export function getResolvedValue(
	ruleValue: Record<string, unknown> | string,
	tree: Record<string, unknown>
): Record<string, unknown> | string | undefined {
	if (!ruleValue || !tree) {
		return ruleValue;
	}

	const resolvedValue = getResolvedRefValue(ruleValue, tree);

	if (
		typeof resolvedValue === 'object' &&
		resolvedValue !== null &&
		'url' in resolvedValue &&
		(resolvedValue as { url?: string }).url
	) {
		const links = tree._links as
			| Record<string, Array<Record<string, unknown>>>
			| undefined;
		(resolvedValue as { url: string }).url = getResolvedThemeFilePath(
			(resolvedValue as { url: string }).url,
			(links?.['wp:theme-file'] as Array<Record<string, unknown>>) ?? []
		);
	}

	return resolvedValue;
}

export const cleanEmptyObject = (object: unknown): unknown => {
	if (
		object === null ||
		typeof object !== 'object' ||
		Array.isArray(object)
	) {
		return object;
	}

	const cleanedNestedObjects = Object.entries(
		object as Record<string, unknown>
	)
		.map(([key, value]) => [key, cleanEmptyObject(value)])
		.filter(([, value]) => value !== undefined);
	return !cleanedNestedObjects.length
		? undefined
		: Object.fromEntries(cleanedNestedObjects);
};

export function getVariationClassName(variation: string): string {
	if (!variation) {
		return '';
	}
	return `is-style-${variation}`;
}

export const getValueFromObjectPath = (
	object: Record<string, unknown> | undefined,
	path: string | string[],
	defaultValue?: unknown
): unknown => {
	const arrayPath = Array.isArray(path) ? path : path.split('.');
	let value: unknown = object;
	arrayPath.forEach((fieldName) => {
		if (value && typeof value === 'object' && value !== null) {
			value = (value as Record<string, unknown>)[fieldName];
		} else {
			value = undefined;
		}
	});
	return value ?? defaultValue;
};

export function uniqByProperty(
	array: Array<Record<string, unknown>>,
	property: string
): Array<Record<string, unknown>> {
	const seen = new Set<string>();
	return array.filter((item) => {
		const value = item[property];
		const key = String(value);
		if (seen.has(key)) {
			return false;
		}
		seen.add(key);
		return true;
	});
}
