// @flow
/**
 * Shared building block for changeset graph custom previews: show ValueAddonDisplay
 * for bound variables / dynamic values, otherwise the resolved scalar string.
 */
/**
 * External dependencies
 */
import type { MixedElement } from 'react';

/**
 * Blockera dependencies
 */
import { isObject } from '@blockera/utils';

/**
 * Internal dependencies
 */
import ValueAddonDisplay from './components/control/value-addon-display';
import { getValueAddonRealValue } from './helpers';
import { isValid } from './utils';

export const CHANGESET_PREVIEW_VALUE_ADDON_CLASS =
	'blockera-control-states-changes-item__preview-value-addon';

/**
 * @return {string | import('react').MixedElement} Empty string, plain text, or ValueAddonDisplay.
 */
export function renderChangesetPreviewPart(raw: mixed): string | MixedElement {
	if (raw === null || raw === undefined || raw === '') {
		return '';
	}

	// $FlowFixMe[incompatible-call] mixed slice may be a value addon
	if (isObject(raw) && isValid(raw)) {
		return (
			<ValueAddonDisplay
				// $FlowFixMe[incompatible-type]
				value={(raw: any)}
				className={CHANGESET_PREVIEW_VALUE_ADDON_CLASS}
			/>
		);
	}

	// $FlowFixMe[incompatible-call] mixed may be plain scalar or addon-shaped
	const v = getValueAddonRealValue((raw: any));

	if (v === null || v === undefined || v === '') {
		return '';
	}

	if (
		typeof v === 'string' ||
		typeof v === 'number' ||
		typeof v === 'boolean'
	) {
		return String(v).trim();
	}

	return String(v).trim();
}
