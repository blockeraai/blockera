// @flow

/**
 * External dependencies
 */
import { addFilter, applyFilters } from '@wordpress/hooks';
import { subscribe, select } from '@wordpress/data';

/**
 * Internal dependencies
 */
import { layoutConfig as defaultLayoutConfig } from '../base/config/layout';
import { STORE_NAME } from '../../store/constants';
import {
	isEnabledExtension,
	isActiveField,
	isActiveExtension,
} from '../../api/utils';

/**
 * Blocks where Blockera owns flex layout (matrix in inspector).
 * core/group: layout hook respects these supports.
 * core/columns / core/column: also ship a hardcoded BlockVerticalAlignmentToolbar in block-library edit.
 */
export const BLOCKS_WITH_HIDDEN_CORE_LAYOUT_TOOLBAR: Set<string> = new Set([
	'core/group',
	'core/columns',
	'core/column',
	'core/buttons',
]);

/**
 * Blocks with hardcoded layout toolbar in block-library edit (not gated by layout supports).
 */
export const BLOCKS_WITH_HARDCODED_LAYOUT_TOOLBAR: Set<string> = new Set([
	'core/columns',
	'core/column',
]);

/**
 * WP columns/column are flex containers by default; Blockera gap uses `flex-or-empty`.
 * Toolbar + core hide should work before the user explicitly sets blockeraDisplay.
 */
export const BLOCKS_WITH_IMPLICIT_FLEX_LAYOUT_TOOLBAR: Set<string> = new Set([
	'core/columns',
	'core/column',
]);

const BODY_CLASS = 'blockera-hide-core-layout-toolbar';

export const BLOCKERA_LAYOUT_TOOLBAR_TEST_ID = 'data-blockera-layout-toolbar';

export const BLOCKERA_LAYOUT_TOOLBAR_SELECTOR = `[data-test="${BLOCKERA_LAYOUT_TOOLBAR_TEST_ID}"]`;

/**
 * Aria-label patterns for core flex layout toolbar only.
 */
const CORE_LAYOUT_TOOLBAR_ARIA_PATTERNS: string[] = [
	'Justify',
	'Align top',
	'Align middle',
	'Align bottom',
	'Change vertical alignment',
	'Stretch to fill',
];

const nodeMatchesCoreLayoutToolbarAria = (node: Element): boolean => {
	const label = node.getAttribute('aria-label');

	if (!label) {
		return false;
	}

	for (let i = 0; i < CORE_LAYOUT_TOOLBAR_ARIA_PATTERNS.length; i++) {
		const pattern = CORE_LAYOUT_TOOLBAR_ARIA_PATTERNS[i];

		if (label === pattern || label.startsWith(`${pattern} `)) {
			return true;
		}
	}

	return false;
};

const isBlockeraLayoutToolbarNode = (node: Element): boolean =>
	!!node.closest(BLOCKERA_LAYOUT_TOOLBAR_SELECTOR) ||
	!!node.querySelector(BLOCKERA_LAYOUT_TOOLBAR_SELECTOR);

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
 * `data-test="data-blockera-layout-toolbar"` is copied onto `.components-toolbar-group`).
 */
const restoreBlockeraLayoutToolbarNodes = (toolbar: Element): void => {
	toolbar
		.querySelectorAll(BLOCKERA_LAYOUT_TOOLBAR_SELECTOR)
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

const hideCoreLayoutToolbarControls = (): void => {
	const toolbar = document.querySelector('.block-editor-block-toolbar');

	if (!toolbar) {
		return;
	}

	restoreBlockeraLayoutToolbarNodes(toolbar);

	toolbar
		.querySelectorAll('.components-dropdown.components-dropdown-menu')
		.forEach((dropdown) => {
			if (isBlockeraLayoutToolbarNode(dropdown)) {
				return;
			}

			const toggle = dropdown.querySelector(
				'button.components-dropdown-menu__toggle, button[aria-haspopup="true"]'
			);

			if (toggle && nodeMatchesCoreLayoutToolbarAria(toggle)) {
				hideElement(dropdown);
			}
		});

	toolbar.querySelectorAll('.components-toolbar-group').forEach((group) => {
		if (isBlockeraLayoutToolbarNode(group)) {
			return;
		}

		const buttons = group.querySelectorAll('.components-button');

		if (!buttons.length) {
			return;
		}

		let hasCoreLayoutControl = false;

		for (let i = 0; i < buttons.length; i++) {
			if (nodeMatchesCoreLayoutToolbarAria(buttons[i])) {
				hasCoreLayoutControl = true;
				break;
			}
		}

		if (hasCoreLayoutControl) {
			hideElement(group);
		}
	});

	toolbar.querySelectorAll('.components-button').forEach((button) => {
		if (
			isBlockeraLayoutToolbarNode(button) ||
			!nodeMatchesCoreLayoutToolbarAria(button)
		) {
			return;
		}

		hideElement(button);

		const dropdown = button.closest(
			'.components-dropdown.components-dropdown-menu'
		);

		if (dropdown && !isBlockeraLayoutToolbarNode(dropdown)) {
			hideElement(dropdown);
		}
	});
};

let toolbarObserver: MutationObserver | null = null;
let bodyToolbarObserver: MutationObserver | null = null;
let hideCoreLayoutToolbarFrame: AnimationFrameID | null = null;

const scheduleHideCoreLayoutToolbarControls = (): void => {
	if (hideCoreLayoutToolbarFrame !== null) {
		cancelAnimationFrame(hideCoreLayoutToolbarFrame);
	}

	hideCoreLayoutToolbarFrame = requestAnimationFrame(() => {
		hideCoreLayoutToolbarFrame = null;
		hideCoreLayoutToolbarControls();
	});
};

const attachToolbarObserver = (): void => {
	scheduleHideCoreLayoutToolbarControls();

	const toolbar = document.querySelector('.block-editor-block-toolbar');

	if (!toolbar || toolbarObserver) {
		return;
	}

	toolbarObserver = new MutationObserver(
		scheduleHideCoreLayoutToolbarControls
	);
	toolbarObserver.observe(toolbar, { childList: true, subtree: true });
};

const stopToolbarObserver = (): void => {
	if (hideCoreLayoutToolbarFrame !== null) {
		cancelAnimationFrame(hideCoreLayoutToolbarFrame);
		hideCoreLayoutToolbarFrame = null;
	}

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

export const resolveLayoutConfigForBlock = (blockName: string): Object => {
	const targetBlock = blockName.replace(/\//g, '.');

	return applyFilters(
		`blockera.block.${targetBlock}.extension.layoutConfig`,
		defaultLayoutConfig,
		'layoutConfig',
		targetBlock
	);
};

const getBlockeraAttributeValue = (attributes: ?Object, key: string): any => {
	const value = attributes?.[key];

	if (value && 'object' === typeof value && undefined !== value.value) {
		return value.value;
	}

	return value;
};

/**
 * Whether Blockera flex layout toolbar should render / core layout toolbar should hide.
 */
export const shouldShowBlockeraFlexLayoutToolbar = (
	blockName: string,
	attributes: ?Object
): boolean => {
	const display = getBlockeraAttributeValue(attributes, 'blockeraDisplay');

	if ('flex' === display) {
		return true;
	}

	if (
		BLOCKS_WITH_IMPLICIT_FLEX_LAYOUT_TOOLBAR.has(blockName) &&
		('' === display || undefined === display)
	) {
		return true;
	}

	return false;
};

/**
 * Whether Blockera should own flex layout toolbar (toolbar + disable core).
 */
export const shouldUseBlockeraLayoutToolbar = (blockName: string): boolean => {
	if (!BLOCKS_WITH_HIDDEN_CORE_LAYOUT_TOOLBAR.has(blockName)) {
		return false;
	}

	const { getBlockExtensionBy } = select(STORE_NAME) || {};
	const blockExtension = getBlockExtensionBy?.('targetBlock', blockName);

	if (!blockExtension || !isEnabledExtension(blockExtension)) {
		return false;
	}

	const layoutExtensionConfig = resolveLayoutConfigForBlock(blockName);

	if (
		!isActiveExtension(layoutExtensionConfig) ||
		!isActiveField(layoutExtensionConfig?.blockeraFlexLayout)
	) {
		return false;
	}

	return true;
};

const blockHasLayoutSupport = (settings: Object): boolean => {
	const layoutSupport = settings.supports?.layout;

	return layoutSupport !== undefined && layoutSupport !== false;
};

/**
 * Registration-time fallback when `blockera/extensions` is not populated yet.
 */
const shouldApplyLayoutSupportOverrideAtRegistration = (
	blockName: string,
	settings: Object
): boolean => {
	if (!BLOCKS_WITH_HIDDEN_CORE_LAYOUT_TOOLBAR.has(blockName)) {
		return false;
	}

	if (shouldUseBlockeraLayoutToolbar(blockName)) {
		return true;
	}

	if (!blockHasLayoutSupport(settings)) {
		return false;
	}

	const layoutExtensionConfig = resolveLayoutConfigForBlock(blockName);

	return (
		isActiveExtension(layoutExtensionConfig) &&
		isActiveField(layoutExtensionConfig?.blockeraFlexLayout)
	);
};

const getLayoutSupportOverride = (settings: Object): Object => {
	const existingLayout = settings.supports?.layout;
	const layoutObject =
		existingLayout && typeof existingLayout === 'object'
			? existingLayout
			: {};

	return {
		...layoutObject,
		allowVerticalAlignment: false,
		allowJustification: false,
	};
};

let isHideCoreLayoutToolbarSupportsRegistered = false;
let isHideCoreLayoutToolbarDomRegistered = false;

const shouldObserveCoreLayoutToolbar = (
	blockName: string,
	attributes: ?Object
): boolean => {
	if (!shouldUseBlockeraLayoutToolbar(blockName)) {
		return false;
	}

	return shouldShowBlockeraFlexLayoutToolbar(blockName, attributes);
};

/**
 * Disable core flex layout toolbar via block supports (locale-safe; used by layout hook).
 */
export const registerHideCoreLayoutToolbarSupports = (): void => {
	if (isHideCoreLayoutToolbarSupportsRegistered) {
		return;
	}

	isHideCoreLayoutToolbarSupportsRegistered = true;

	addFilter(
		'blocks.registerBlockType',
		'blockera/editor/hide-core-layout-toolbar-supports',
		(settings: Object, blockName: string): Object => {
			if (
				!shouldApplyLayoutSupportOverrideAtRegistration(
					blockName,
					settings
				)
			) {
				return settings;
			}

			return {
				...settings,
				supports: {
					...settings.supports,
					layout: getLayoutSupportOverride(settings),
				},
			};
		},
		901
	);
};

/**
 * Hide core layout toolbar controls in the block toolbar DOM.
 *
 * Supports-based blocks (group, buttons, …) are covered by layout supports when
 * registered in time; this observer is the stable fallback for hardcoded toolbars
 * and for blocks that registered before Blockera filters were attached.
 */
export const registerHideCoreLayoutToolbarDom = (): void => {
	if (isHideCoreLayoutToolbarDomRegistered) {
		return;
	}

	isHideCoreLayoutToolbarDomRegistered = true;

	let previousObserverKey: string | null = null;

	subscribe(() => {
		const blockEditorSelect = select('core/block-editor');

		if (!blockEditorSelect?.getSelectedBlock) {
			return;
		}

		const selectedBlock = blockEditorSelect.getSelectedBlock();
		const selectedBlockName = selectedBlock?.name || null;
		const hasFlexLayoutToolbar = shouldShowBlockeraFlexLayoutToolbar(
			selectedBlockName || '',
			selectedBlock?.attributes
		);
		const observerKey = selectedBlockName
			? `${selectedBlockName}:${hasFlexLayoutToolbar ? 'flex' : 'none'}`
			: null;

		if (observerKey === previousObserverKey) {
			return;
		}

		previousObserverKey = observerKey;

		if (
			selectedBlockName &&
			shouldObserveCoreLayoutToolbar(
				selectedBlockName,
				selectedBlock?.attributes
			)
		) {
			const activeObserverKey = observerKey;

			requestAnimationFrame(() => {
				requestAnimationFrame(() => {
					if (activeObserverKey !== previousObserverKey) {
						return;
					}

					startToolbarObserver();
				});
			});

			return;
		}

		stopToolbarObserver();
	});
};

/**
 * Register layout-toolbar hide hooks once, at editor hook bootstrap time.
 */
export const initHideCoreLayoutToolbar = (): void => {
	registerHideCoreLayoutToolbarSupports();
};

/**
 * Start the layout-toolbar DOM observer after block extensions are registered.
 */
export const initHideCoreLayoutToolbarDom = (): void => {
	registerHideCoreLayoutToolbarDom();
};
