// @flow
/**
 * External dependencies
 */
import { createElement, Fragment } from '@wordpress/element';

/**
 * Blockera dependencies
 */
import { renderChangesetPreviewPart } from '@blockera/controls';
import { isObject } from '@blockera/utils';

/**
 * Changeset graph preview for blockeraGap: locked → single `gap`; unlocked (`lock === false`) → `rows / columns`.
 * Value addons render as ValueAddonDisplay chips; `lock` undefined is treated as locked.
 */
export function renderGapUnifiedChangesetPreview(resolved: mixed): mixed {
	if (resolved === null || resolved === undefined) {
		return '';
	}

	if (
		typeof resolved === 'string' ||
		typeof resolved === 'number' ||
		typeof resolved === 'boolean'
	) {
		return String(resolved).trim();
	}

	if (!isObject(resolved)) {
		return renderChangesetPreviewPart(resolved);
	}

	const o: Object = resolved;
	const isGapObject =
		'gap' in o || 'lock' in o || 'rows' in o || 'columns' in o;

	if (!isGapObject) {
		return renderChangesetPreviewPart(resolved);
	}

	if (o.lock !== false) {
		return renderChangesetPreviewPart(o.gap);
	}

	const rowPart = renderChangesetPreviewPart(o.rows);
	const colPart = renderChangesetPreviewPart(o.columns);

	if (rowPart === '' && colPart === '') {
		return '';
	}

	if (rowPart === '') {
		return colPart;
	}

	if (colPart === '') {
		return rowPart;
	}

	return createElement(Fragment, null, rowPart, ' / ', colPart);
}
