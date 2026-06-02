// @flow

/**
 * External dependencies
 */
import { dispatch, select } from '@wordpress/data';
import { isReusableBlock } from '@wordpress/blocks';
import { store as blockEditorStore } from '@wordpress/block-editor';
import { store as editorStore } from '@wordpress/editor';

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

	if (block.attributes?.metadata?.patternName) {
		return true;
	}

	if (block.attributes?.templateLock === 'contentOnly') {
		return true;
	}

	return false;
}

/**
 * Template part blocks only gate Blockera UI when locked to content-only.
 *
 * @param {Object|null|undefined} block Block record from the block editor store.
 * @return {boolean} Whether the template part should defer inspector UI.
 */
export function isContentOnlyTemplatePartSectionBlock(
	block: Object | null | void
): boolean {
	if (!block) {
		return false;
	}

	return (
		block.name === 'core/template-part' &&
		block.attributes?.templateLock === 'contentOnly'
	);
}

/**
 * Pattern or content-only template part section container.
 *
 * @param {Object|null|undefined} block Block record from the block editor store.
 * @return {boolean} Whether the block defers Blockera inspector UI until edit mode.
 */
export function isContentOnlySectionContainerBlock(
	block: Object | null | void
): boolean {
	return (
		isPatternSectionBlock(block) ||
		isContentOnlyTemplatePartSectionBlock(block)
	);
}

/**
 * Whether the site editor is editing a template part document (not an embedded part).
 *
 * @return {boolean} Whether the current post type is `wp_template_part`.
 */
export function isEditingTemplatePartPost(): boolean {
	const postType = select(editorStore)?.getCurrentPostType?.();

	return postType === 'wp_template_part';
}

/**
 * Whether the block is the edited section or a descendant of it.
 *
 * @param {string}   clientId        Block client id.
 * @param {string}   editedSection   Active content-only section client id.
 * @param {Function} getBlockParents Block editor `getBlockParents` selector.
 * @return {boolean} Whether the block is inside the edited content-only section.
 */
export function isBlockWithinEditedContentOnlySection(
	clientId: string,
	editedSection: string,
	getBlockParents: (clientId: string, ascending?: boolean) => Array<string>
): boolean {
	if (!clientId || !editedSection) {
		return false;
	}

	if (clientId === editedSection) {
		return true;
	}

	return getBlockParents(clientId, false).includes(editedSection);
}

/**
 * Whether the Blockera inspector card portal should stay unmounted until the user
 * enters pattern edit mode (WordPress 7.0 "Edit pattern" / content-only section).
 *
 * @param {string}   clientId Selected block client id.
 * @param {Object}   storeSelectors Block editor store selectors for the current render.
 * @return {boolean} True when the portal must not render yet.
 */
export function shouldDeferBlockInspectorCardPortal(
	clientId: string,
	storeSelectors: {
		getBlock: (clientId: string) => Object | null,
		getBlockParents: (
			clientId: string,
			ascending?: boolean
		) => Array<string>,
		getTemporarilyEditingAsBlocks?: () => string | null,
	}
): boolean {
	if (!clientId) {
		return true;
	}

	if (isEditingTemplatePartPost()) {
		return false;
	}

	const { getBlock, getBlockParents, getTemporarilyEditingAsBlocks } =
		storeSelectors;

	const editedSection = getTemporarilyEditingAsBlocks?.() || null;

	if (
		editedSection &&
		isBlockWithinEditedContentOnlySection(
			clientId,
			editedSection,
			getBlockParents
		)
	) {
		return false;
	}

	const patternAncestor = findPatternSectionClientId(
		clientId,
		getBlock,
		getBlockParents
	);
	const block = getBlock(clientId);

	if (!patternAncestor && !isContentOnlySectionContainerBlock(block)) {
		return false;
	}

	return true;
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

		if (isContentOnlySectionContainerBlock(block)) {
			return parentId;
		}
	}

	return null;
}

const CORE_CONTENT_ONLY_EXIT_LABELS = ['Exit pattern', 'Exit section'];

/**
 * Core shows an exit control while editing inside a content-only section.
 *
 * @param {Function} translate `__` from `@wordpress/i18n`.
 * @return {boolean} Whether core's exit content-only control is visible in the inspector.
 */
export function isCoreExitPatternEditModeVisible(
	translate: (text: string) => string
): boolean {
	const exitLabels = CORE_CONTENT_ONLY_EXIT_LABELS.map((label) =>
		translate(label)
	);
	const buttons = document.querySelectorAll(
		'.block-editor-block-inspector-edit-contents__button'
	);

	for (let i = 0; i < buttons.length; i++) {
		const label = buttons[i].textContent?.trim();

		if (label && exitLabels.includes(label)) {
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
	const exitLabels = CORE_CONTENT_ONLY_EXIT_LABELS.map((label) =>
		translate(label)
	);
	const buttons = document.querySelectorAll(
		'.block-editor-block-inspector-edit-contents__button'
	);

	for (let i = 0; i < buttons.length; i++) {
		const button = buttons[i];
		const label = button.textContent?.trim();

		if (label && exitLabels.includes(label)) {
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
