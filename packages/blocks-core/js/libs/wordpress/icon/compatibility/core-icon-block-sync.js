// @flow

/**
 * Blockera dependencies
 */
import { mergeObject } from '@blockera/utils';

/**
 * Internal dependencies
 */
import { toCoreIconAttribute } from './core-icon-slug';
import {
	hydrateBlockeraIconFromCoreEntity,
	needsCoreIconHydration,
} from './hydrate-icon';

/**
 * Apply core/icon Blockera ↔ WordPress attribute compatibility.
 *
 * @param {Object} nextState  Accumulated attributes for the block editor store.
 * @param {string} featureId  Blockera feature being updated.
 * @param {*}      newValue    New feature value.
 * @return {Object} Updated attributes.
 */
export function applyCoreIconBlockCompatibility(
	nextState: Object,
	featureId: string,
	newValue: any
): Object {
	if (needsCoreIconHydration(nextState)) {
		nextState = hydrateBlockeraIconFromCoreEntity({ ...nextState });
	}

	if (featureId !== 'blockeraIcon') {
		return nextState;
	}

	// Sync core/icon `icon` only for WordPress library slugs — not custom or third-party icons.
	if (newValue?.library === 'wp' && newValue?.icon) {
		return mergeObject(nextState, {
			icon: toCoreIconAttribute(newValue.icon),
		});
	}

	return mergeObject(
		nextState,
		{ icon: undefined },
		{ deletedProps: ['icon'] }
	);
}

/**
 * Hydrate attributes for canvas rendering (raw block store attributes).
 *
 * @param {Object} attributes Block attributes from the block editor.
 * @return {Object} Attributes with blockeraIcon hydrated when needed.
 */
export function getCoreIconCanvasAttributes(attributes: Object): Object {
	return hydrateBlockeraIconFromCoreEntity({ ...attributes });
}

/**
 * Block store patch to persist a migrated blockeraIcon from core `icon`.
 *
 * @param {Object} attributes Block attributes from the block editor.
 * @return {Object|null} setAttributes patch or null when migration is not needed.
 */
export function getCoreIconMigrationPatch(attributes: Object): Object | null {
	if (!needsCoreIconHydration(attributes)) {
		return null;
	}

	const hydrated = hydrateBlockeraIconFromCoreEntity({ ...attributes });

	if (!hydrated.blockeraIcon) {
		return null;
	}

	return {
		blockeraIcon: hydrated.blockeraIcon,
	};
}
