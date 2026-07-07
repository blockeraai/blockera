// @flow

/**
 * External dependencies
 */
import { createContext, useContext } from '@wordpress/element';

/**
 * Mirrors BlockBase `clientId` so deep children can resolve the injected slot name via
 * `getBlockeraBlockInjectedSlotName` (filtered with `blockera/block-injected-slot-name`)
 * without threading props through every layer.
 */
export const BlockInjectedSlotContext: Object = createContext<?string>(null);

/**
 * @return {?string} Current block client id for slot fills, or null outside BlockBase.
 */
export function useBlockInjectedSlotClientId(): ?string {
	return useContext(BlockInjectedSlotContext);
}
