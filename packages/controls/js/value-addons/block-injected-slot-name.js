// @flow

/**
 * External dependencies
 */
import { applyFilters } from '@wordpress/hooks';

/**
 * WordPress `applyFilters` hook to customize the Slot / Fill name for
 * BlockBase-injected UI (`block-base.js`). Default: `blockera-block-injected-slot-${clientId}`.
 */
export const BLOCKERA_BLOCK_INJECTED_SLOT_NAME_FILTER: string =
	'blockera/block-injected-slot-name';

const DEFAULT_SLOT_NAME_PREFIX = 'blockera-block-injected-slot';

/**
 * @param {string} clientId Block client id (or global-styles fallback id) — must match BlockBase.
 * @return {string} Slot name for Slot / Fill components.
 */
export function getBlockeraBlockInjectedSlotName(clientId: string): string {
	const defaultName = `${DEFAULT_SLOT_NAME_PREFIX}-${clientId}`;
	return applyFilters(
		BLOCKERA_BLOCK_INJECTED_SLOT_NAME_FILTER,
		defaultName,
		clientId
	);
}
