// @flow

/**
 * External dependencies
 */
import { addFilter } from '@wordpress/hooks';
import { subscribe, select } from '@wordpress/data';

/**
 * Blocks where Blockera owns flex layout (matrix in inspector).
 * core/group: layout hook respects these supports.
 * core/columns / core/column: also ship a hardcoded BlockVerticalAlignmentToolbar in block-library edit.
 */
export const BLOCKS_WITH_HIDDEN_CORE_LAYOUT_TOOLBAR: Set<string> = new Set([
	'core/group',
	'core/columns',
	'core/column',
]);

const BODY_CLASS = 'blockera-hide-core-layout-toolbar';

/**
 * WordPress layout toolbar icon paths (@wordpress/icons) — stable across locales.
 */
const HIDDEN_LAYOUT_TOOLBAR_ICON_PATHS: Set<string> = new Set([
	'M9 20h6V9H9v11zM4 4v1.5h16V4H4z',
	'M20 11h-5V4H9v7H4v1.5h5V20h6v-7.5h5z',
	'M15 4H9v11h6V4zM4 18.5V20h16v-1.5H4z',
	'M4 4L20 4L20 5.5L4 5.5L4 4ZM10 7L14 7L14 17L10 17L10 7ZM20 18.5L4 18.5L4 20L20 20L20 18.5Z',
	'M9 9v6h11V9H9zM4 20h1.5V4H4v16z',
	'M12.5 15v5H11v-5H4V9h7V4h1.5v5h7v6h-7Z',
	'M4 15h11V9H4v6zM18.5 4v16H20V4h-1.5z',
	'M9 15h6V9H9v6zm-5 5h1.5V4H4v16zM18.5 4v16H20V4h-1.5z',
]);

const nodeMatchesHiddenLayoutIcon = (node: Element): boolean => {
	const paths = node.querySelectorAll('svg path[d]');

	for (let i = 0; i < paths.length; i++) {
		const pathValue = paths[i].getAttribute('d');

		if (pathValue && HIDDEN_LAYOUT_TOOLBAR_ICON_PATHS.has(pathValue)) {
			return true;
		}
	}

	return false;
};

const restoreHiddenToolbarNodes = (toolbar: Element): void => {
	toolbar.querySelectorAll('.blockera-hidden').forEach((element) => {
		element.classList.remove('blockera-hidden');
		element.style.removeProperty('display');
	});
};

const hideCoreLayoutToolbarControls = (): void => {
	const toolbar = document.querySelector('.block-editor-block-toolbar');

	if (!toolbar) {
		return;
	}

	toolbar.querySelectorAll('.components-toolbar-group').forEach((group) => {
		if (!nodeMatchesHiddenLayoutIcon(group)) {
			return;
		}

		group.classList.add('blockera-hidden');
		group.style.display = 'none';
	});

	toolbar.querySelectorAll('.components-button').forEach((button) => {
		if (!nodeMatchesHiddenLayoutIcon(button)) {
			return;
		}

		button.classList.add('blockera-hidden');
		button.style.display = 'none';
	});
};

let toolbarObserver: MutationObserver | null = null;
let bodyToolbarObserver: MutationObserver | null = null;

const attachToolbarObserver = (): void => {
	hideCoreLayoutToolbarControls();

	const toolbar = document.querySelector('.block-editor-block-toolbar');

	if (!toolbar || toolbarObserver) {
		return;
	}

	toolbarObserver = new MutationObserver(hideCoreLayoutToolbarControls);
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

	// Toolbar mounts after selection; watch until it appears.
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

/**
 * Disable core flex layout toolbar via block supports (locale-safe; used by layout hook).
 */
export const registerHideCoreLayoutToolbarSupports = (): void => {
	addFilter(
		'blocks.registerBlockType',
		'blockera/editor/hide-core-layout-toolbar-supports',
		(settings: Object, blockName: string): Object => {
			if (!BLOCKS_WITH_HIDDEN_CORE_LAYOUT_TOOLBAR.has(blockName)) {
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
 * Hide hardcoded column/columns BlockVerticalAlignmentToolbar (not gated by layout supports).
 */
export const registerHideCoreLayoutToolbarDom = (): void => {
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
			BLOCKS_WITH_HIDDEN_CORE_LAYOUT_TOOLBAR.has(selectedBlockName)
		) {
			startToolbarObserver();
			return;
		}

		stopToolbarObserver();
	});
};
