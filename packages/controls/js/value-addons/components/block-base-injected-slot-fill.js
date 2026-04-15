// @flow

/**
 * External dependencies
 */
import { Fill } from '@wordpress/components';
import type { MixedElement } from 'react';

/**
 * Internal dependencies
 */
import { getBlockeraBlockInjectedSlotName } from '../block-injected-slot-name';

type SlotFillProps = {
	clientId: string,
	children?: MixedElement,
};

/**
 * Renders into Slot `blockera-block-injected-slot-${clientId}` (BlockPartials / BlockBase).
 */
export function BlockBaseInjectedSlotFill({
	clientId,
	children,
}: SlotFillProps): MixedElement | null {
	if (!clientId) {
		return null;
	}

	return (
		<Fill name={getBlockeraBlockInjectedSlotName(clientId)}>
			{children}
		</Fill>
	);
}

type StyleTagFillProps = {
	clientId: string,
	css: string,
};

/**
 * Injects a style tag into the BlockBase injected slot (sidebar DOM). For preview iframe,
 * prefer `usePreviewInjectableStyles` + BlockBase provider.
 */
export function BlockBaseInjectedStyleTagFill({
	clientId,
	css,
}: StyleTagFillProps): MixedElement | null {
	if (!clientId || !css) {
		return null;
	}

	return (
		<BlockBaseInjectedSlotFill clientId={clientId}>
			<style type="text/css" data-blockera-injected-slot-style="1">
				{css}
			</style>
		</BlockBaseInjectedSlotFill>
	);
}
