// @flow

/**
 * Blockera dependencies
 */
import type { ValueAddon } from '@blockera/controls/js/value-addons/types';
import { isObject, isString } from '@blockera/utils';
import { isValid } from '@blockera/controls/js/value-addons/utils';

/**
 * Internal dependencies
 */
import type { ValueAddonReference } from '../types';
import { getColorVAFromVarString } from './color';
import { getFontSizeVAFromVarString } from './font-size';
import { getGradientVAFromVarString } from './gradient';
import { getSpacingVAFromVarString } from './spacing';
import type { VariableCategory } from './types';
import { getWidthSizeVAFromVarString } from './width-size';

export function generateVariableString({
	reference,
	type,
	id,
}: {
	reference: ValueAddonReference,
	type: VariableCategory,
	id: string,
}): string {
	let _type: string = type;
	let _reference: string = reference?.type;

	if (type === 'width-size') {
		if (id === 'contentSize') {
			id = 'content-size';
			_type = 'global';
			_reference = 'style';
		} else if (id === 'wideSize') {
			id = 'wide-size';
			_type = 'global';
			_reference = 'style';
		}
	} else {
		_type = type.replace(/^linear-|^radial-/i, '');
	}

	switch (_reference) {
		case 'custom':
			_reference = 'blockera';
			break;

		case 'theme':
		case 'plugin':
		case 'core':
		case 'core-pro':
			_reference = 'preset';
			break;

		case 'style':
			_reference = 'style';
			break;

		default:
			_reference = 'preset';
			break;
	}

	return `--wp--${_reference}--${_type}--${id}`;
}

export function generateVariableStringFromAttributeVarString(
	varString: string
): string {
	return varString.replace('var:', '--wp--').replaceAll('|', '--');
}

export function generateAttributeVarStringFromVA(
	valueAddon: ValueAddon | string
): string {
	if (isString(valueAddon)) {
		//$FlowFixMe
		return valueAddon;
	}

	if (isValid(valueAddon)) {
		//$FlowFixMe
		let _reference: string = valueAddon?.settings?.reference?.type;

		switch (_reference) {
			case 'custom':
				_reference = 'blockera';
				break;

			case 'theme':
			case 'plugin':
			case 'core':
			case 'core-pro':
			default:
				_reference = 'preset';
				break;
		}

		//$FlowFixMe
		const type = valueAddon?.settings?.type || '';

		//$FlowFixMe
		const id = valueAddon?.settings?.id || '';

		return 'var:' + _reference + '|' + type + '|' + id;
	}

	//$FlowFixMe
	return valueAddon;
}

export function matchesVarStringMiddleType(
	partsType: string,
	expectedType: string
): boolean {
	if (partsType === expectedType) {
		return true;
	}

	if (
		expectedType === 'gradient' &&
		(partsType === 'linear-gradient' || partsType === 'radial-gradient')
	) {
		return true;
	}

	return false;
}

/**
 * Parses a variable string (either var: or var() format) and extracts the ID and variable string.
 *
 * @param {string} value - The variable string to parse (e.g., "var:preset|color|accent-1" or "var(--wp--preset--color--accent-1)")
 * @param {string} type - The variable type (e.g., "color" or "gradient")
 * @return {{ id: string | null, varString: string | null }} An object containing the extracted ID and variable string, or null values if not found
 */
export function parseVarString(
	value: string,
	type: string
): { id: string | null, varString: string | null } {
	if (!isString(value)) {
		return { id: null, varString: null };
	}

	let id: string | null = null;
	let varString: string | null = null;

	// Handle var: pattern (e.g., "var:preset|color|accent-1" or "var:preset|gradient|accent-1-to-accent-2")
	if (value.startsWith('var:')) {
		const parts = value.split('|');
		if (parts.length >= 3 && matchesVarStringMiddleType(parts[1], type)) {
			id = parts[2];
			varString = generateVariableStringFromAttributeVarString(value);
		}
	}
	// Layout width tokens (content / wide) use --wp--style--global--*, not --wp--preset--width-size--.
	else if (
		type === 'width-size' &&
		value.startsWith('var(--wp--style--global--')
	) {
		const match = value.match(
			/^var\(--wp--style--global--(content-size|wide-size)(?:[,)]|$)/
		);
		if (match && match[1]) {
			const slug = match[1];
			id = slug === 'content-size' ? 'contentSize' : 'wideSize';
			varString = `--wp--style--global--${slug}`;
		}
	}
	// Handle CSS var() pattern (e.g., "var(--wp--preset--color--accent-1)" or "var(--wp--preset--gradient--accent-1-to-accent-2)")
	else if (value.startsWith(`var(--wp--preset--${type}--`)) {
		// Extract the ID from the CSS variable name
		// Pattern: var(--wp--preset--{type}--{id}) or var(--wp--preset--{type}--{id}
		// Handles cases with or without closing parenthesis
		const match = value.match(
			new RegExp(`^var\\(--wp--preset--${type}--([^,)]+)(?:[,)]|$)`)
		);
		if (match && match[1]) {
			id = match[1];
			varString = `--wp--preset--${type}--${id}`;
		}
	}

	return { id, varString };
}

export type GetValueAddonFromVarStringOptions = {|
	/**
	 * Non-strings are always returned as-is. When true, strings that are not
	 * `var:…` or `var(--wp--…)` are returned unchanged without running handlers.
	 */
	onlyVariableLike?: boolean,
	/**
	 * When true, if handlers return a plain string (no value-addon object), the
	 * original input string is returned instead.
	 */
	passthroughNonObject?: boolean,
|};

let vaFromVarStringByTypeCache: {
	[string]: (string) => ValueAddon | string,
} | null = null;

/**
 * Lazily build the handler map so we never read per-type exports while those
 * modules (e.g. gradient.js) are still initializing — utils.js and gradient
 * mutually depend on each other via `parseVarString` / `get*VAFromVarString`.
 */
function getVAFromVarStringByType(): {
	[string]: (string) => ValueAddon | string,
} {
	if (!vaFromVarStringByTypeCache) {
		vaFromVarStringByTypeCache = {
			spacing: getSpacingVAFromVarString,
			'width-size': getWidthSizeVAFromVarString,
			color: getColorVAFromVarString,
			'font-size': getFontSizeVAFromVarString,
			gradient: getGradientVAFromVarString,
		};
	}

	return vaFromVarStringByTypeCache;
}

function handlerKeyForVariableCategory(type: VariableCategory): string {
	if (type === 'linear-gradient' || type === 'radial-gradient') {
		return 'gradient';
	}

	return type;
}

function inferVariableCategoryFromCssVarValue(
	value: string
): VariableCategory | null {
	const checks: Array<[RegExp, VariableCategory]> = [
		[/^var\(--wp--preset--spacing--/, 'spacing'],
		[/^var\(--wp--preset--width-size--/, 'width-size'],
		[/^var\(--wp--style--global--(?:content-size|wide-size)/, 'width-size'],
		[/^var\(--wp--preset--color--/, 'color'],
		[/^var\(--wp--preset--font-size--/, 'font-size'],
		[/^var\(--wp--preset--gradient--/, 'gradient'],
		[/^var\(--wp--preset--border-radius--/, 'border-radius'],
		[/^var\(--wp--preset--text-shadow--/, 'text-shadow'],
		[/^var\(--wp--preset--shadow--/, 'shadow'],
		[/^var\(--wp--preset--transition--/, 'transition'],
		[/^var\(--wp--preset--transform--/, 'transform'],
		[/^var\(--wp--preset--filter--/, 'filter'],
		[/^var\(--wp--preset--border--/, 'border'],
	];

	for (let i = 0; i < checks.length; i++) {
		if (checks[i][0].test(value)) {
			return checks[i][1];
		}
	}

	return null;
}

function resolveVarStringToValueAddonOrString(
	value: string,
	allowedTypes: $ReadOnlyArray<VariableCategory>
): ValueAddon | string {
	const handlers = getVAFromVarStringByType();
	const allowedHandlerKeys: { [string]: boolean } = {};
	for (let i = 0; i < allowedTypes.length; i++) {
		allowedHandlerKeys[handlerKeyForVariableCategory(allowedTypes[i])] =
			true;
	}

	if (value.startsWith('var:')) {
		const parts = value.split('|');
		if (parts.length >= 3) {
			const middle = parts[1];
			let handlerKey = middle;

			if (
				middle === 'linear-gradient' ||
				middle === 'radial-gradient' ||
				middle === 'gradient'
			) {
				handlerKey = 'gradient';
			}

			if (allowedHandlerKeys[handlerKey]) {
				const fn = handlers[handlerKey];
				if (fn) {
					return fn(value);
				}
			}
		}

		return value;
	}

	if (value.startsWith('var(--wp--')) {
		const inferred = inferVariableCategoryFromCssVarValue(value);

		if (inferred !== null) {
			const hk = handlerKeyForVariableCategory(inferred);

			if (allowedHandlerKeys[hk]) {
				const fn = handlers[hk];
				if (fn) {
					const result = fn(value);

					if (isObject(result)) {
						return result;
					}
				}
			}
		}
	}

	for (let i = 0; i < allowedTypes.length; i++) {
		const hk = handlerKeyForVariableCategory(allowedTypes[i]);
		const fn = handlers[hk];

		if (!fn) {
			continue;
		}

		const result = fn(value);

		if (isObject(result)) {
			return result;
		}
	}

	return value;
}

export function getValueAddonFromVarString(
	value: mixed,
	allowedTypes: $ReadOnlyArray<VariableCategory>,
	options?: GetValueAddonFromVarStringOptions
): mixed {
	if (!isString(value)) {
		return value;
	}

	//$FlowFixMe[incompatible-type]
	const str: string = value;

	if (options?.onlyVariableLike) {
		if (!str.startsWith('var:') && !str.startsWith('var(--wp--')) {
			return str;
		}
	}

	const result = resolveVarStringToValueAddonOrString(str, allowedTypes);

	if (options?.passthroughNonObject && !isObject(result)) {
		return str;
	}

	return result;
}
