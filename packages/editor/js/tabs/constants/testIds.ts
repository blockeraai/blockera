/**
 * Stable `test-id` values for Blockera workspace tabs (Cypress: `cy.getByTestId`).
 * Imported by Cypress via webpack alias `blockera-editor-tabs-test-ids`
 * (see `packages/dev-cypress/js/webpack.config.js`).
 */
export const WORKSPACE_TABS_TEST_ID = {
	/** Primary "Add tab" control in the main tabs bar. */
	add: 'blockera-workspace-tabs-add',
	/**
	 * Prefix for tab root `test-id` values (`blockera-workspace-tab--{key}`).
	 * Use: `[test-id^="${WORKSPACE_TABS_TEST_ID.tabRootPrefix}"]`.
	 */
	tabRootPrefix: 'blockera-workspace-tab--',
	/** Root wrapper for a single tab (includes `post-123` style keys). */
	tabRoot: (tabKey: string): string => `blockera-workspace-tab--${tabKey}`,
	/** Visible title label inside a tab. */
	tabTitle: 'blockera-workspace-tabs-tab-title',
	/** Dot shown in the tab when the document has unsaved edits. */
	tabUnsavedIndicator: 'blockera-workspace-tabs-tab-unsaved-indicator',
	/** Close control for an unpinned tab. */
	close: (tabKey: string): string =>
		`blockera-workspace-tabs-close--${tabKey}`,

	/** Tab right-click context menu (popover). */
	tabContextMenu: 'blockera-workspace-tabs-tab-context-menu',
	contextMenuClose: 'blockera-workspace-tabs-context-menu-close',
	contextMenuCloseOthers: 'blockera-workspace-tabs-context-menu-close-others',
	contextMenuCloseToRight:
		'blockera-workspace-tabs-context-menu-close-to-right',
	contextMenuCloseSaved: 'blockera-workspace-tabs-context-menu-close-saved',
	contextMenuView: 'blockera-workspace-tabs-context-menu-view',
	contextMenuCopyViewLink:
		'blockera-workspace-tabs-context-menu-copy-view-link',
	contextMenuCopyEditorLink:
		'blockera-workspace-tabs-context-menu-copy-editor-link',
	contextMenuRenameTab: 'blockera-workspace-tabs-context-menu-rename-tab',
	contextMenuClearTabRename:
		'blockera-workspace-tabs-context-menu-clear-tab-rename',
	/** Shown when the tab is unpinned; use Pin from the menu. */
	contextMenuPin: 'blockera-workspace-tabs-context-menu-pin',
	/** Shown when the tab is pinned; use Unpin from the menu. */
	contextMenuUnpin: 'blockera-workspace-tabs-context-menu-unpin',

	/** Tabs bar “⋯” toolbar menu trigger. */
	toolbarMenuTrigger: 'blockera-workspace-tabs-toolbar-menu-trigger',
	/** Toolbar → display: icon-only mode for pinned tabs. */
	toolbarIconOnlyPinnedTabs:
		'blockera-workspace-tabs-toolbar-icon-only-pinned-tabs',
	/** Toolbar → “Remember recently closed tabs” toggle (Tabs History Settings). */
	toolbarRememberRecentlyClosed:
		'blockera-workspace-tabs-toolbar-remember-recently-closed',
	/**
	 * Recently closed row in the toolbar menu (key is the tab key, e.g. `post-12`).
	 */
	recentlyClosedItem: (tabKey: string): string =>
		`blockera-workspace-tabs-recently-closed-item--${tabKey}`,
	/** Shown when the recently closed list is empty. */
	recentlyClosedEmpty: 'blockera-workspace-tabs-recently-closed-empty',

	/** Rename tab modal (inner content wrapper). */
	renameModal: 'blockera-workspace-tabs-rename-modal-root',
	renameModalInput: 'blockera-workspace-tabs-rename-modal-input',
	renameModalSave: 'blockera-workspace-tabs-rename-modal-save',
	renameModalRemoveRename:
		'blockera-workspace-tabs-rename-modal-remove-rename',
	renameModalCancel: 'blockera-workspace-tabs-rename-modal-cancel',

	/** Close confirmation modal shown when closing tabs with unsaved changes. */
	closeConfirmModalRoot: 'blockera-workspace-tabs-close-confirm-modal-root',
	closeConfirmTabsList: 'blockera-workspace-tabs-close-confirm-tabs-list',
	closeConfirmSaveAndClose:
		'blockera-workspace-tabs-close-confirm-save-and-close',
	closeConfirmCloseWithoutSaving:
		'blockera-workspace-tabs-close-confirm-close-without-saving',
	closeConfirmCancel: 'blockera-workspace-tabs-close-confirm-cancel',
	closeConfirmReviewTab: (tabKey: string): string =>
		`blockera-workspace-tabs-close-confirm-review-tab--${tabKey}`,

	/** Upgrade modal when workspace tab limits are exceeded (free tier). */
	tabsLimitUpgradePrompt: 'blockera-workspace-tabs-limit-upgrade-prompt',

	/** Modal when a tab targets a missing or inaccessible document. */
	unavailableModalRoot: 'blockera-workspace-tabs-unavailable-modal-root',
	unavailableModalConfirm:
		'blockera-workspace-tabs-unavailable-modal-confirm',
} as const;
