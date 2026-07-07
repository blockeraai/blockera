// @flow
/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import { createElement, Fragment } from '@wordpress/element';

/**
 * Blockera dependencies
 */
import {
	isValid as isValidValueAddon,
	renderChangesetPreviewPart,
} from '@blockera/controls';

/**
 * Changeset graph label for flex-wrap: plain string, value-addon on `val`, or object with `val`/`reverse`.
 */
export function formatBlockeraFlexWrapChangesetPreview(resolved: mixed): mixed {
	if (resolved === null || resolved === undefined) {
		return '';
	}

	if (typeof resolved === 'string') {
		if (resolved === 'nowrap') {
			return __('No Wrap', 'blockera');
		}
		if (resolved === 'wrap') {
			return __('Wrap', 'blockera');
		}

		return resolved ? String(resolved) : '';
	}

	if (typeof resolved !== 'object') {
		return String(resolved);
	}

	const obj: Object = resolved;
	const wrapped = obj.value;
	const inner: Object =
		wrapped && typeof wrapped === 'object' && 'val' in wrapped
			? wrapped
			: obj;

	const val = 'val' in inner ? inner.val : inner.value;

	// $FlowFixMe[incompatible-call] val may be a value addon reference
	if (typeof val === 'object' && val !== null && isValidValueAddon(val)) {
		const addonPreview = renderChangesetPreviewPart(val);

		if (addonPreview === '') {
			return '';
		}

		if (inner.reverse) {
			return createElement(
				Fragment,
				null,
				addonPreview,
				' (',
				__('reverse', 'blockera'),
				')'
			);
		}

		return addonPreview;
	}

	let label = '';
	if (val === 'nowrap') {
		label = __('No Wrap', 'blockera');
	} else if (val === 'wrap') {
		label = __('Wrap', 'blockera');
	} else if (val !== undefined && val !== null && val !== '') {
		label = String(val);
	}

	if (!label) {
		return '';
	}

	if (inner.reverse) {
		return `${label} (${__('reverse', 'blockera')})`;
	}

	return label;
}
