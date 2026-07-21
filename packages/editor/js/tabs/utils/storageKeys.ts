/**
 * Centralized localStorage key constants
 *
 * All localStorage keys used by the tabs plugin are defined here
 * to ensure consistency and prevent typos across files.
 *
 * These are logical (unscoped) base keys. Use `@blockera/storage`
 * (`localStorage` / `sessionStorage` APIs) — do not call native storage.
 */

/** Key for storing the list of open tabs */
export const TABS_STORAGE_KEY = 'blockera-tabs-tabs' as const;

/** Key for storing the tabs persistence setting (boolean) */
export const PERSISTENCE_STORAGE_KEY = 'blockera-tabs-persistence' as const;

/** Key for storing the list of recently closed tabs */
export const RECENTLY_CLOSED_STORAGE_KEY =
	'blockera-tabs-recently-closed' as const;

/** Key for storing the recently closed tabs persistence setting (boolean) */
export const RECENTLY_CLOSED_PERSISTENCE_KEY =
	'blockera-tabs-recently-closed-persistence' as const;

/** Key for storing the tab icons visibility setting (boolean) */
export const TAB_ICONS_ENABLED_KEY = 'blockera-tabs-tab-icons-enabled' as const;

/** Key for storing the icon-only pinned tabs setting (boolean) - show only icons for pinned tabs */
export const ICON_ONLY_PINNED_TABS_KEY =
	'blockera-tabs-icon-only-pinned' as const;

/** sessionStorage: bulk-edit post IDs handoff */
export const BULK_EDIT_IDS_STORAGE_KEY = 'blockera_tabs_bulk_edit_ids' as const;

/** sessionStorage: bulk-edit post type handoff */
export const BULK_EDIT_POST_TYPE_STORAGE_KEY =
	'blockera_tabs_bulk_edit_post_type' as const;

/** Type for storage keys */
export type StorageKey =
	| typeof TABS_STORAGE_KEY
	| typeof PERSISTENCE_STORAGE_KEY
	| typeof RECENTLY_CLOSED_STORAGE_KEY
	| typeof RECENTLY_CLOSED_PERSISTENCE_KEY
	| typeof TAB_ICONS_ENABLED_KEY
	| typeof ICON_ONLY_PINNED_TABS_KEY
	| typeof BULK_EDIT_IDS_STORAGE_KEY
	| typeof BULK_EDIT_POST_TYPE_STORAGE_KEY;
