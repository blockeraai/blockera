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
	findPatternSectionClientId,
	isCoreExitPatternEditModeVisible,
} from '../helpers/pattern-edit-section';

/**
 * Resolves the active pattern section client id when editing an inner block inside
 * a pattern (content-only section), using core's public unstable selector when available.
 *
 * @param {string} selectedClientId Currently selected block client id.
 * @return {string|null} Pattern section client id to show in PatternBlockCard, or null.
 */
export function usePatternEditSection(selectedClientId: string): string | null {
	const { editedSectionClientId, fallbackPatternClientId } = useSelect(
		(select) => {
			if (!selectedClientId) {
				return {
					editedSectionClientId: null,
					fallbackPatternClientId: null,
				};
			}

			const store = select(blockEditorStore);
			const editedSection =
				store.__unstableGetTemporarilyEditingAsBlocks?.() || null;

			let fallbackPatternClientId = null;

			if (!editedSection) {
				const { getBlockParents, getBlock } = store;
				fallbackPatternClientId = findPatternSectionClientId(
					selectedClientId,
					getBlock,
					getBlockParents
				);
			}

			return {
				editedSectionClientId: editedSection,
				fallbackPatternClientId,
			};
		},
		[selectedClientId]
	);

	const patternClientId = editedSectionClientId || fallbackPatternClientId;
	const usesStoreEditMode = Boolean(editedSectionClientId);

	const [isDomEditMode, setIsDomEditMode] = useState(false);

	useEffect(() => {
		if (usesStoreEditMode) {
			setIsDomEditMode(false);
			return;
		}

		if (
			!fallbackPatternClientId ||
			!selectedClientId ||
			fallbackPatternClientId === selectedClientId
		) {
			setIsDomEditMode(false);
			return;
		}

		const syncEditMode = () => {
			const visible = isCoreExitPatternEditModeVisible(__);

			setIsDomEditMode(visible);
		};

		syncEditMode();

		return subscribe(syncEditMode);
	}, [usesStoreEditMode, fallbackPatternClientId, selectedClientId]);

	if (
		!patternClientId ||
		!selectedClientId ||
		patternClientId === selectedClientId
	) {
		return null;
	}

	if (usesStoreEditMode) {
		return patternClientId;
	}

	if (!isDomEditMode) {
		return null;
	}

	return patternClientId;
}
