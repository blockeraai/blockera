// @flow

/**
 * Blockera dependencies
 */
import type { ValueAddon } from '@blockera/controls/js/value-addons/types';
import { isString } from '@blockera/utils';
import { isValid } from '@blockera/controls/js/value-addons/utils';

/**
 * Internal dependencies
 */
import type { ValueAddonReference } from '../types';
import type { VariableCategory } from './types';

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
		if (parts.length >= 3) {
			id = parts[2];
			varString = generateVariableStringFromAttributeVarString(value);
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
