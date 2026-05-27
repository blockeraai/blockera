// @flow

/**
 * External dependencies
 */
import { dispatch } from '@wordpress/data';
import { isReusableBlock } from '@wordpress/blocks';
import { store as blockEditorStore } from '@wordpress/block-editor';

/**
 * Whether a block represents a pattern / content-only section container.
 *
 * @param {Object|null|undefined} block Block record from the block editor store.
 * @return {boolean} Whether the block is a pattern section container.
 */
export function isPatternSectionBlock(block: Object | null | void): boolean {
	if (!block) {
		return false;
	}

	if (isReusableBlock(block)) {
		return true;
	}

	if (block.name === 'core/block') {
		return true;
	}

	if (block.attributes?.templateLock === 'contentOnly') {
		return true;
	}

	return false;
}

/**
 * Finds the nearest ancestor pattern section for the selected block.
 *
 * @param {string}   selectedClientId Selected block client id.
 * @param {Function} getBlock         Block editor `getBlock` selector.
 * @param {Function} getBlockParents  Block editor `getBlockParents` selector.
 * @return {string|null} Pattern section client id, or null.
 */
export function findPatternSectionClientId(
	selectedClientId: string,
	getBlock: (clientId: string) => Object | null,
	getBlockParents: (clientId: string, ascending?: boolean) => Array<string>
): string | null {
	if (!selectedClientId) {
		return null;
	}

	const parents = getBlockParents(selectedClientId, false);

	for (let i = 0; i < parents.length; i++) {
		const parentId = parents[i];
		const block = getBlock(parentId);

		if (isPatternSectionBlock(block)) {
			return parentId;
		}
	}

	return null;
}

/**
 * Core shows an "Exit pattern" button while editing inside a content-only section.
 *
 * @param {Function} translate `__` from `@wordpress/i18n`.
 * @return {boolean} Whether core's Exit pattern control is visible in the inspector.
 */
export function isCoreExitPatternEditModeVisible(
	translate: (text: string) => string
): boolean {
	const exitLabel = translate('Exit pattern');
	const buttons = document.querySelectorAll(
		'.block-editor-block-inspector-edit-contents__button'
	);

	for (let i = 0; i < buttons.length; i++) {
		const button = buttons[i];

		if (button.textContent?.trim() === exitLabel) {
			return true;
		}
	}

	return false;
}

/**
 * Clicks core's inspector "Exit pattern" button (DOM fallback).
 *
 * @param {Function} translate `__` from `@wordpress/i18n`.
 * @return {boolean} Whether a button was clicked.
 */
export function clickCoreExitPatternButton(
	translate: (text: string) => string
): boolean {
	const exitLabel = translate('Exit pattern');
	const buttons = document.querySelectorAll(
		'.block-editor-block-inspector-edit-contents__button'
	);

	for (let i = 0; i < buttons.length; i++) {
		const button = buttons[i];

		if (button.textContent?.trim() === exitLabel) {
			button.click();
			return true;
		}
	}

	return false;
}

/**
 * Leaves pattern (content-only section) edit mode using public actions when available.
 *
 * @param {Function} translate `__` from `@wordpress/i18n`.
 * @return {boolean} Whether exit was triggered.
 */
export function stopPatternContentOnlyEdit(
	translate: (text: string) => string
): boolean {
	const blockEditorDispatch = dispatch(blockEditorStore);

	if (
		typeof blockEditorDispatch.stopEditingContentOnlySection === 'function'
	) {
		blockEditorDispatch.stopEditingContentOnlySection();
		return true;
	}

	if (
		typeof blockEditorDispatch.__unstableSetTemporarilyEditingAsBlocks ===
		'function'
	) {
		blockEditorDispatch.__unstableSetTemporarilyEditingAsBlocks(false);
		return true;
	}

	return clickCoreExitPatternButton(translate);
}
