/**
 * External dependencies
 */
import fastDeepEqual from 'fast-deep-equal/es6';
import { useViewportMatch } from '@wordpress/compose';
import { getCSSValueFromRawStyle } from '@wordpress/style-engine';

/**
 * Internal dependencies
 */
import { getValueFromObjectPath, findInPresetsBy } from '@blockera/data';

export {
	getValueFromObjectPath,
	getValueFromVariable,
	findInPresetsBy,
} from '@blockera/data';

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
			Record<string, Array<Record<string, unknown>>> | undefined;
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

export function getVariationClassName(
	variation: string,
	classPrefix: string = 'is-style-'
): string {
	if (!variation) {
		return '';
	}
	return `${classPrefix}${variation}`;
}

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
