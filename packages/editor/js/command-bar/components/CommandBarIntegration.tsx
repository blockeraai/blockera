/**
 * Command Bar Integration Component
 *
 * Encapsulates all command bar initialization logic for Blockera Tabs.
 * This component sets up:
 * - Command bar navigation interception (opens entities as tabs)
 * - Add tab mode for filtering commands
 * - Create entity commands (new post/page)
 * - Commands for all open tabs (switch to existing tabs)
 */

import type { ReactNode } from 'react';

/**
 * Internal dependencies
 */
import { useCommandBarIntegration } from '../hooks/useCommandBarIntegration';
import { useAddTabCommandBar } from '../hooks/useAddTabCommandBar';
import { useCreateEntityCommands } from '../hooks/useCreateEntityCommands';
import { useOpenTabsCommands } from '../hooks/useOpenTabsCommands';
import type { Tab } from '../../tabs/types';

/**
 * Props for CommandBarIntegration component.
 */
export interface CommandBarIntegrationProps {
	/** Function to add a tab. */
	addTab: (
		postType: string,
		postId: string | number,
		title?: string | null,
		slug?: string | null,
		status?: string | null
	) => Promise<void>;
	/** Function to switch documents. */
	switchDocument: (postType: string, postId: string | number) => void;
	/** Function to prefetch entity data. */
	prefetchEntity: (
		postType: string | null | undefined,
		postId: string | number | null | undefined
	) => Promise<unknown>;
	/** Current tabs array. */
	tabs: Tab[];
	/** Render prop that receives openAddTabCommandBar. */
	children: (props: { openAddTabCommandBar: () => void }) => ReactNode;
}

/**
 * Command Bar Integration Component
 *
 * @param props - Component props
 * @returns Rendered children with openAddTabCommandBar function
 */
export default function CommandBarIntegration({
	addTab,
	switchDocument,
	prefetchEntity,
	tabs,
	children,
}: CommandBarIntegrationProps): ReactNode {
	// Intercept command bar entity navigation commands and open as tabs
	useCommandBarIntegration({
		addTab,
		switchDocument,
		prefetchEntity,
		tabs,
	});

	// Hook for opening command bar in "add tab mode" (navigation commands only)
	const { openAddTabCommandBar } = useAddTabCommandBar();

	// Register "Create new post/page" commands for add tab mode
	useCreateEntityCommands({
		addTab: addTab as (postType: string, postId: number, title?: string | null) => Promise<void>,
		switchDocument: switchDocument as (postType: string, postId: number) => void,
		prefetchEntity: prefetchEntity as (postType: string, postId: number) => Promise<unknown>,
	});

	// Register commands for all open tabs
	useOpenTabsCommands({
		tabs,
		switchDocument,
		prefetchEntity,
	});

	// Render children with openAddTabCommandBar function
	return children({ openAddTabCommandBar });
}

