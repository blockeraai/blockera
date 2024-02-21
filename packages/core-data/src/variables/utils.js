// @flow

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
			_reference = 'publisher';
			break;

		case 'theme':
		case 'plugin':
		case 'core':
		case 'core-pro':
			_reference = 'preset';
			break;
	}

	return `--wp--${_reference}--${_type}--${id}`;
}
