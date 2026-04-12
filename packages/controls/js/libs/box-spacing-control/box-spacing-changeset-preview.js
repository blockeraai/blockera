// @flow
/**
 * External dependencies
 */
import type { MixedElement } from 'react';
import { createElement, Fragment } from '@wordpress/element';

/**
 * Blockera Dependencies
 */
import { isEquals, isObject } from '@blockera/utils';

/**
 * Internal dependencies
 */
import { renderChangesetPreviewPart } from '../../value-addons/render-changeset-preview-part';

const isEmptyPreviewPart = (part: string | MixedElement): boolean =>
	part === '';

/**
 * Compact preview for padding/margin changeset graph (top/right/bottom/left).
 * Variables / dynamic values use ValueAddonDisplay via renderChangesetPreviewPart.
 */
export function formatBoxSpacingSidesForChangesetPreview(
	sideBox: mixed
): string | MixedElement {
	if (!isObject(sideBox) || sideBox === null) {
		return '';
	}

	// $FlowFixMe[prop-missing] side box shape from control context
	const box = (sideBox: Object);

	const top = box.top;
	const right = box.right;
	const bottom = box.bottom;
	const left = box.left;

	const t = renderChangesetPreviewPart(top);
	const r = renderChangesetPreviewPart(right);
	const b = renderChangesetPreviewPart(bottom);
	const l = renderChangesetPreviewPart(left);

	if (
		isEmptyPreviewPart(t) &&
		isEmptyPreviewPart(r) &&
		isEmptyPreviewPart(b) &&
		isEmptyPreviewPart(l)
	) {
		return '';
	}

	if (isEquals(top, right) && isEquals(top, bottom) && isEquals(top, left)) {
		return t || r || b || l;
	}

	if (
		isEquals(top, bottom) &&
		isEquals(left, right) &&
		(!isEmptyPreviewPart(t) || !isEmptyPreviewPart(l))
	) {
		if (isEquals(top, left)) {
			return !isEmptyPreviewPart(t) ? t : l;
		}

		const leftPart = !isEmptyPreviewPart(l) ? l : '-';
		const topPart = !isEmptyPreviewPart(t) ? t : '0';

		return createElement(Fragment, null, topPart, ' / ', leftPart);
	}

	const parts = [t, r, b, l].filter((p) => !isEmptyPreviewPart(p));

	if (!parts.length) {
		return '';
	}

	const interleaved = parts.flatMap((p, i) => (i === 0 ? [p] : [' · ', p]));

	return createElement(Fragment, null, ...interleaved);
}
