/**
 * WordPress dependencies
 */
import { useMemo, useEffect } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { parseCommandName } from './parseCommandName';
import type { Tab } from '../../tabs/types';

/**
 * Command object from WordPress commands store.
 */
export interface Command {
	name: string;
	label: string;
	searchLabel?: string;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	icon?: any;
	callback: (context: { close?: () => void }) => void | Promise<void>;
}

/**
 * Result from a command loader hook.
 */
export interface CommandLoaderResult {
	commands: Command[];
	isLoading: boolean;
}

/**
 * Parameters passed to a command loader hook.
 */
export interface CommandLoaderParams {
	search?: string;
}

/**
 * Original command loader hook function type.
 */
export type CommandLoaderHook = (
	params: CommandLoaderParams
) => CommandLoaderResult;

/**
 * Tab actions interface for opening/focusing tabs.
 */
export interface TabActions {
	openOrFocusTab: (params: {
		postType: string;
		postId: string | number;
		tabs: Tab[];
	}) => Promise<void>;
}

/**
 * Navigation loaders that should be wrapped to intercept entity navigation
 */
export const NAVIGATION_LOADER_NAMES = [
	'core/edit-site/navigate-pages',
	'core/edit-site/navigate-posts',
	'core/edit-site/navigate-templates',
	'core/edit-site/navigate-template-parts',
] as const;

/**
 * Marker suffix added to searchLabel for CSS targeting via data-value attribute
 * This allows CSS to identify wrapped commands using [data-value$="⌘TAB"]
 */
export const TAB_COMMAND_MARKER = '⌘TAB' as const;

/**
 * Create a wrapped version of a command loader hook that intercepts navigation callbacks
 *
 * @param originalHook - The original command loader hook function
 * @param tabActions - Object containing tab action functions
 * @param tabs - Current tabs array
 * @return Wrapped hook function
 */
export function createWrappedHook(
	originalHook: CommandLoaderHook,
	tabActions: TabActions,
	tabs: Tab[]
): CommandLoaderHook {
	return function useWrappedCommandLoader(
		params: CommandLoaderParams
	): CommandLoaderResult {
		// Set CSS custom property with translated text for the "Open as Tab" indicator
		useEffect(() => {
			document.documentElement.style.setProperty(
				'--blockera-tab-indicator-text',
				`"${__('Opens in Tab', 'blockera')}"`
			);
		}, []);

		// Call the original hook to get commands
		const result = originalHook(params);
		const { commands: originalCommands = [], isLoading = false } =
			result ?? {};

		// Wrap each command's callback to intercept navigation
		const wrappedCommands = useMemo(() => {
			return originalCommands.map((command) => {
				const parsed = parseCommandName(command.name);

				// If we can't parse the command name, return original command
				if (!parsed) {
					return command;
				}

				// Add marker to searchLabel so CSS can target via [data-value$="⌘TAB"]
				const markedSearchLabel =
					(command.searchLabel ?? command.label) +
					' ' +
					TAB_COMMAND_MARKER;

				return {
					...command,
					searchLabel: markedSearchLabel,
					callback: ({ close }: { close?: () => void }) => {
						void tabActions
							.openOrFocusTab({
								postType: parsed.type,
								postId: parsed.id,
								tabs,
							})
							.then(() => close?.());
					},
				};
			});
			// eslint-disable-next-line react-hooks/exhaustive-deps
		}, [originalCommands, tabs]);

		return { commands: wrappedCommands, isLoading };
	};
}
