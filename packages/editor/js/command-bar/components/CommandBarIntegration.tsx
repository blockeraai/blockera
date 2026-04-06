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
	) => Promise<boolean>;
	/** Function to switch documents. */
	switchDocument: (
		postType: string,
		postId: string | number
	) => Promise<boolean>;
	/** Function to prefetch entity data. */
	prefetchEntity: (
		postType: string | null | undefined,
		postId: string | number | null | undefined
	) => Promise<unknown>;
	/** Current tabs array. */
	tabs: Tab[];
	/**
	 * When a tab target cannot be loaded (deleted, private, no cap), after workspace cleanup.
	 */
	onDocumentInaccessible?: (info: {
		key: string;
		type: string;
		id: string | number;
		title: string;
	}) => void;
	/** Render prop that receives openAddTabCommandBar. */
	children: (props: { openAddTabCommandBar: () => void }) => ReactNode;
}

/**
 * Command Bar Integration Component
 *
 * @param props - Component props
 * @return Rendered children with openAddTabCommandBar function
 */
export default function CommandBarIntegration({
	addTab,
	switchDocument,
	prefetchEntity,
	tabs,
	onDocumentInaccessible,
	children,
}: CommandBarIntegrationProps): ReactNode {
	// Intercept command bar entity navigation commands and open as tabs
	useCommandBarIntegration({
		addTab,
		switchDocument,
		prefetchEntity,
		tabs,
		onDocumentInaccessible,
	});

	// Hook for opening command bar in "add tab mode" (navigation commands only)
	const { openAddTabCommandBar } = useAddTabCommandBar();

	// Register "Create new post/page" commands for add tab mode
	useCreateEntityCommands({
		addTab: addTab as (
			postType: string,
			postId: number,
			title?: string | null
		) => Promise<boolean>,
		switchDocument: switchDocument as (
			postType: string,
			postId: number
		) => Promise<boolean>,
		prefetchEntity: prefetchEntity as (
			postType: string,
			postId: number
		) => Promise<unknown>,
	});

	// Register commands for all open tabs
	useOpenTabsCommands({
		tabs,
		switchDocument,
		prefetchEntity,
		onDocumentInaccessible,
	});

	// Render children with openAddTabCommandBar function
	return children({ openAddTabCommandBar });
}
