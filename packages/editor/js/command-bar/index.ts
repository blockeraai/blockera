/**
 * Command Bar integration for Blockera Tabs.
 *
 * This module provides components, hooks, and utilities for integrating with
 * WordPress command bar (Cmd+K) to enable tab-based navigation.
 *
 * @package
 */

// Components
export { default as CommandBarIntegration } from './components/CommandBarIntegration';
export type { CommandBarIntegrationProps } from './components/CommandBarIntegration';

// Hooks
export { useCommandBarIntegration } from './hooks/useCommandBarIntegration';
export type { UseCommandBarIntegrationParams } from './hooks/useCommandBarIntegration';

export { useAddTabCommandBar } from './hooks/useAddTabCommandBar';
export type { UseAddTabCommandBarReturn } from './hooks/useAddTabCommandBar';

export { useCreateEntityCommands } from './hooks/useCreateEntityCommands';
export type { UseCreateEntityCommandsParams } from './hooks/useCreateEntityCommands';

export { useOpenTabsCommands } from './hooks/useOpenTabsCommands';
export type { UseOpenTabsCommandsParams } from './hooks/useOpenTabsCommands';

// Utils
export {
	createWrappedHook,
	NAVIGATION_LOADER_NAMES,
	TAB_COMMAND_MARKER,
} from './utils/wrapCommandLoaderHook';
export type {
	Command,
	CommandLoaderResult,
	CommandLoaderParams,
	CommandLoaderHook,
	TabActions,
} from './utils/wrapCommandLoaderHook';

export {
	getIsCommandBarMode,
	setCommandBarMode,
	subscribeToCommandBarMode,
} from './utils/commandBarMode';

export { parseCommandName } from './utils/parseCommandName';
export type { ParsedCommandName } from './utils/parseCommandName';

// Export bootstrap function
export { bootstrapCommandBar } from './bootstrap';

