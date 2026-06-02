// @flow

/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import { subscribe, useSelect } from '@wordpress/data';
import { useState, useEffect } from '@wordpress/element';
import { store as blockEditorStore } from '@wordpress/block-editor';

/**
 * Internal dependencies
 */
import {
	shouldDeferBlockInspectorCardPortal,
	isCoreExitPatternEditModeVisible,
} from '../helpers/pattern-edit-section';

/**
 * Whether Blockera block-inspector UI may mount (card portal, side effects, etc.)
 * after the user enters WordPress 7.0 "Edit pattern" / content-only section mode.
 *
 * @param {string} clientId Active block client id.
 * @return {boolean} Whether Blockera block-inspector UI may mount.
 */
export function useShouldRenderBlockInspectorCardPortal(
	clientId: string
): boolean {
	const shouldDeferFromStore = useSelect(
		(select) => {
			if (!clientId) {
				return true;
			}

			const store = select(blockEditorStore);

			return shouldDeferBlockInspectorCardPortal(clientId, {
				getBlock: store.getBlock,
				getBlockParents: store.getBlockParents,
				getTemporarilyEditingAsBlocks:
					store.__unstableGetTemporarilyEditingAsBlocks,
			});
		},
		[clientId]
	);

	const [isDomEditMode, setIsDomEditMode] = useState(false);

	useEffect(() => {
		if (!shouldDeferFromStore) {
			setIsDomEditMode(false);
			return;
		}

		const syncEditMode = () => {
			setIsDomEditMode(isCoreExitPatternEditModeVisible(__));
		};

		syncEditMode();

		return subscribe(syncEditMode);
	}, [shouldDeferFromStore]);

	if (!clientId) {
		return false;
	}

	if (!shouldDeferFromStore) {
		return true;
	}

	return isDomEditMode;
}
