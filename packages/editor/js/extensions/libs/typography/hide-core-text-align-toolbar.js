// @flow

/**
 * External dependencies
 */
import { addFilter, applyFilters } from '@wordpress/hooks';
import { subscribe, select } from '@wordpress/data';
import { getBlockSupport, hasBlockSupport } from '@wordpress/blocks';

/**
 * Internal dependencies
 */
import { typographyConfig as defaultTypographyConfig } from '../base/config/typography';
import { STORE_NAME } from '../../store/constants';
import {
	isEnabledExtension,
	isActiveField,
	isActiveExtension,
} from '../../api/utils';

/**
 * Blocks with hardcoded AlignmentControl in block-library edit (not gated by typography.textAlign).
 *
 * @see packages/block-library/src/quote/edit.js
 * @see packages/block-library/src/pullquote/edit.js
 * @see packages/block-library/src/post-author/edit.js
 * @see packages/block-library/src/term-name/edit.js
 */
export const BLOCKS_WITH_HARDCODED_TEXT_ALIGN_TOOLBAR: Set<string> = new Set([
	'core/quote',
	'core/pullquote',
	'core/post-author',
	'core/term-name',
]);

/**
 * Populated at `blocks.registerBlockType` with blocks that ship core text-align toolbar UI.
 * Used at runtime after Blockera sets `typography.textAlign: false` on those blocks.
 */
export const BLOCKS_WITH_CORE_TEXT_ALIGN_TOOLBAR: Set<string> = new Set();

const VALID_TEXT_ALIGNMENTS: string[] = ['left', 'center', 'right'];

const BODY_CLASS = 'blockera-hide-core-text-align-toolbar';

export const BLOCKERA_TEXT_ALIGN_TOOLBAR_TEST_ID =
	'data-blockera-text-align-toolbar';

export const BLOCKERA_TEXT_ALIGN_TOOLBAR_SELECTOR = `[data-test="${BLOCKERA_TEXT_ALIGN_TOOLBAR_TEST_ID}"]`;

/**
 * Aria-label patterns for core text-align toolbar only (not block wide/full "Align").
 */
const CORE_TEXT_ALIGN_ARIA_PATTERNS: string[] = [
	'Align text',
	'Change text alignment',
];

const nodeMatchesCoreTextAlignAria = (node: Element): boolean => {
	const label = node.getAttribute('aria-label');

	if (!label) {
		return false;
	}

	for (let i = 0; i < CORE_TEXT_ALIGN_ARIA_PATTERNS.length; i++) {
		const pattern = CORE_TEXT_ALIGN_ARIA_PATTERNS[i];

		if (label === pattern || label.startsWith(`${pattern} `)) {
			return true;
		}
	}

	return false;
};

const isBlockeraTextAlignToolbarNode = (node: Element): boolean =>
	!!node.closest(BLOCKERA_TEXT_ALIGN_TOOLBAR_SELECTOR) ||
	!!node.querySelector(BLOCKERA_TEXT_ALIGN_TOOLBAR_SELECTOR);

const hideElement = (element: Element): void => {
	element.classList.add('blockera-hidden');

	if (element instanceof HTMLElement) {
		element.style.display = 'none';
	}
};

const restoreHiddenToolbarNodes = (toolbar: Element): void => {
	toolbar.querySelectorAll('.blockera-hidden').forEach((element) => {
		element.classList.remove('blockera-hidden');
		element.style.removeProperty('display');
	});
};

/**
 * Undo mistaken hides on Blockera's toolbar (MutationObserver can run before
 * `data-test="data-blockera-text-align-toolbar"` is copied onto `.components-toolbar-group`).
 */
const restoreBlockeraTextAlignToolbarNodes = (toolbar: Element): void => {
	toolbar
		.querySelectorAll(BLOCKERA_TEXT_ALIGN_TOOLBAR_SELECTOR)
		.forEach((marker) => {
			const group = marker.closest('.components-toolbar-group');

			if (group) {
				group.classList.remove('blockera-hidden');
				if (group instanceof HTMLElement) {
					group.style.removeProperty('display');
				}
			}

			marker.classList.remove('blockera-hidden');
			if (marker instanceof HTMLElement) {
				marker.style.removeProperty('display');
			}
		});
};

const hideCoreTextAlignToolbarControls = (): void => {
	const toolbar = document.querySelector('.block-editor-block-toolbar');

	if (!toolbar) {
		return;
	}

	restoreBlockeraTextAlignToolbarNodes(toolbar);

	toolbar.querySelectorAll('.components-toolbar-group').forEach((group) => {
		if (isBlockeraTextAlignToolbarNode(group)) {
			return;
		}

		const buttons = group.querySelectorAll('.components-button');

		if (!buttons.length) {
			return;
		}

		let hasCoreTextAlign = false;

		for (let i = 0; i < buttons.length; i++) {
			if (nodeMatchesCoreTextAlignAria(buttons[i])) {
				hasCoreTextAlign = true;
				break;
			}
		}

		if (hasCoreTextAlign) {
			hideElement(group);
		}
	});

	toolbar.querySelectorAll('.components-button').forEach((button) => {
		if (
			isBlockeraTextAlignToolbarNode(button) ||
			!nodeMatchesCoreTextAlignAria(button)
		) {
			return;
		}

		hideElement(button);
	});
};

let toolbarObserver: MutationObserver | null = null;
let bodyToolbarObserver: MutationObserver | null = null;

const attachToolbarObserver = (): void => {
	hideCoreTextAlignToolbarControls();

	const toolbar = document.querySelector('.block-editor-block-toolbar');

	if (!toolbar || toolbarObserver) {
		return;
	}

	toolbarObserver = new MutationObserver(hideCoreTextAlignToolbarControls);
	toolbarObserver.observe(toolbar, { childList: true, subtree: true });
};

const stopToolbarObserver = (): void => {
	if (bodyToolbarObserver) {
		bodyToolbarObserver.disconnect();
		bodyToolbarObserver = null;
	}

	if (toolbarObserver) {
		toolbarObserver.disconnect();
		toolbarObserver = null;
	}

	const toolbar = document.querySelector('.block-editor-block-toolbar');

	if (toolbar) {
		restoreHiddenToolbarNodes(toolbar);
	}

	document.body?.classList.remove(BODY_CLASS);
};

const startToolbarObserver = (): void => {
	stopToolbarObserver();

	document.body?.classList.add(BODY_CLASS);
	attachToolbarObserver();

	if (document.querySelector('.block-editor-block-toolbar')) {
		return;
	}

	bodyToolbarObserver = new MutationObserver(() => {
		if (!document.querySelector('.block-editor-block-toolbar')) {
			return;
		}

		attachToolbarObserver();

		if (bodyToolbarObserver) {
			bodyToolbarObserver.disconnect();
			bodyToolbarObserver = null;
		}
	});

	if (document.body) {
		bodyToolbarObserver.observe(document.body, {
			childList: true,
			subtree: true,
		});
	}
};

export const resolveTypographyConfigForBlock = (blockName: string): Object => {
	const targetBlock = blockName.replace(/\//g, '.');

	return applyFilters(
		`blockera.block.${targetBlock}.extension.typographyConfig`,
		defaultTypographyConfig,
		'typographyConfig',
		targetBlock
	);
};

/**
 * Mirrors core `getValidTextAlignments()` in block-editor text-align hook.
 *
 * @see source-code-block-editor/packages/block-editor/src/hooks/text-align.js
 */
const getValidTextAlignmentsFromSupport = (
	blockTextAlign: ?(boolean | Array<string>)
): string[] => {
	if (Array.isArray(blockTextAlign)) {
		const valid = [];

		for (let i = 0; i < VALID_TEXT_ALIGNMENTS.length; i++) {
			const alignment = VALID_TEXT_ALIGNMENTS[i];

			if (blockTextAlign.includes(alignment)) {
				valid.push(alignment);
			}
		}

		return valid;
	}

	return blockTextAlign === true ? VALID_TEXT_ALIGNMENTS.slice() : [];
};

/**
 * Whether core ships text-align on the block toolbar (hook or hardcoded AlignmentControl).
 */
export const blockHasCoreTextAlignToolbar = (
	blockName: string,
	settings: Object
): boolean => {
	if (BLOCKS_WITH_HARDCODED_TEXT_ALIGN_TOOLBAR.has(blockName)) {
		return true;
	}

	if (!hasBlockSupport(settings, 'typography.textAlign', false)) {
		return false;
	}

	const blockTextAlign = getBlockSupport(settings, 'typography.textAlign');

	return getValidTextAlignmentsFromSupport(blockTextAlign).length > 0;
};

/**
 * Whether Blockera should own text-align (toolbar + disable core).
 */
export const shouldUseBlockeraTextAlignToolbar = (
	blockName: string,
	settings?: Object
): boolean => {
	const { getBlockExtensionBy } = select(STORE_NAME) || {};
	const blockExtension = getBlockExtensionBy?.('targetBlock', blockName);

	if (!blockExtension || !isEnabledExtension(blockExtension)) {
		return false;
	}

	const typographyConfig = resolveTypographyConfigForBlock(blockName);

	if (
		!isActiveExtension(typographyConfig) ||
		!isActiveField(typographyConfig?.blockeraTextAlign)
	) {
		return false;
	}

	if (settings) {
		return blockHasCoreTextAlignToolbar(blockName, settings);
	}

	// After registration Blockera sets `typography.textAlign: false`; use captured set.
	return BLOCKS_WITH_CORE_TEXT_ALIGN_TOOLBAR.has(blockName);
};

const getTypographySupportOverride = (settings: Object): Object | null => {
	const existingTypography = settings.supports?.typography;

	if (!existingTypography) {
		return null;
	}

	if (existingTypography === true) {
		return {
			textAlign: false,
		};
	}

	if (typeof existingTypography === 'object') {
		return {
			...existingTypography,
			textAlign: false,
		};
	}

	return null;
};

/**
 * Disable core text-align hook + Typography inspector text-align via block supports.
 */
export const registerHideCoreTextAlignToolbarSupports = (): void => {
	addFilter(
		'blocks.registerBlockType',
		'blockera/editor/hide-core-text-align-toolbar-supports',
		(settings: Object, blockName: string): Object => {
			if (blockHasCoreTextAlignToolbar(blockName, settings)) {
				BLOCKS_WITH_CORE_TEXT_ALIGN_TOOLBAR.add(blockName);
			}

			if (!shouldUseBlockeraTextAlignToolbar(blockName, settings)) {
				return settings;
			}

			const typographyOverride = getTypographySupportOverride(settings);

			if (!typographyOverride) {
				return settings;
			}

			return {
				...settings,
				supports: {
					...settings.supports,
					typography: typographyOverride,
				},
			};
		},
		901
	);
};

/**
 * Hide hardcoded block-library text AlignmentControl instances.
 *
 * Hook-based blocks (paragraph, heading, …) rely on `typography.textAlign: false`
 * only — no DOM observer, so Blockera's toolbar is never matched by aria-label hiding.
 */
export const registerHideCoreTextAlignToolbarDom = (): void => {
	let previousSelectedBlockName: string | null = null;

	subscribe(() => {
		const selectedBlock = select('core/block-editor').getSelectedBlock();
		const selectedBlockName = selectedBlock?.name || null;

		if (selectedBlockName === previousSelectedBlockName) {
			return;
		}

		previousSelectedBlockName = selectedBlockName;

		if (
			selectedBlockName &&
			shouldUseBlockeraTextAlignToolbar(selectedBlockName) &&
			BLOCKS_WITH_HARDCODED_TEXT_ALIGN_TOOLBAR.has(selectedBlockName)
		) {
			startToolbarObserver();
			return;
		}

		stopToolbarObserver();
	});
};
