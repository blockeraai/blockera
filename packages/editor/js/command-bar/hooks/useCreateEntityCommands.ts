/**
 * WordPress dependencies
 */
import { useMemo } from '@wordpress/element';
import { useSelect, useDispatch } from '@wordpress/data';
import { useCommandLoader } from '@wordpress/commands';
import { store as coreStore } from '@wordpress/core-data';
import { __ } from '@wordpress/i18n';
import { page, post } from '@wordpress/icons';
import type { Post } from '@wordpress/core-data';

/**
 * Internal dependencies
 */
import { isEditorPage } from '../../utils/isEditorPage';
import { TAB_COMMAND_MARKER } from '../utils/wrapCommandLoaderHook';
import type {
	Command,
	CommandLoaderResult,
} from '../utils/wrapCommandLoaderHook';
import { focusPostTitle } from '../../utils/focusPostTitle';

// Use entity-edit context to show commands by default in the contextual group
// This matches the context used by WordPress when editing entities
// CSS hides them when NOT in add-tab mode
const ENTITY_EDIT_CONTEXT = 'entity-edit';

/**
 * Tab actions interface for creating entities.
 */
interface CreateEntityTabActions {
	addTab: (
		postType: string,
		postId: number,
		title?: string | null
	) => Promise<boolean>;
	switchDocument: (postType: string, postId: number) => void;
	prefetchEntity: (postType: string, postId: number) => Promise<unknown>;
}

/**
 * Command loader hook that returns create post/page commands
 * Context-based loader - commands show by default when context is active
 *
 * @param tabActions - Tab action functions
 * @return The command loader hook
 */
function getCreateEntityCommandsLoader(
	tabActions: CreateEntityTabActions
): () => CommandLoaderResult {
	return function useCreateEntityCommandsLoader(): CommandLoaderResult {
		const { saveEntityRecord } = useDispatch(coreStore) as {
			saveEntityRecord: (
				kind: string,
				name: string,
				record: Record<string, unknown>,
				options?: { throwOnError?: boolean }
			) => Promise<Post | undefined>;
		};

		// Check user permissions
		const canCreatePost = useSelect(
			(select) =>
				(
					select(coreStore) as {
						canUser: (
							action: string,
							resource: { kind: string; name: string }
						) => boolean | undefined;
					}
				).canUser('create', {
					kind: 'postType',
					name: 'post',
				}),
			[]
		);

		const canCreatePage = useSelect(
			(select) =>
				(
					select(coreStore) as {
						canUser: (
							action: string,
							resource: { kind: string; name: string }
						) => boolean | undefined;
					}
				).canUser('create', {
					kind: 'postType',
					name: 'page',
				}),
			[]
		);

		// Build commands array
		// Note: Visibility is controlled by context + CSS based on add-tab mode
		const commands = useMemo((): Command[] => {
			const result: Command[] = [];

			// Add "New post" command if user has permission
			if (canCreatePost !== false) {
				const addNewPostLabel = __('Add new post', 'blockera');
				result.push({
					name: 'blockera-tabs/create-new-post',
					label: addNewPostLabel,
					// Must match visible label: cmdk filters on `value` (searchLabel), not label.
					searchLabel: `${addNewPostLabel} ${TAB_COMMAND_MARKER}`,
					keywords: [
						__('Create new post', 'blockera'),
						__('New post', 'blockera'),
					],
					icon: post,
					callback: async ({ close }) => {
						if (!isEditorPage()) {
							close?.();
							return;
						}

						try {
							const newPost = await saveEntityRecord(
								'postType',
								'post',
								{
									title: __('Draft Post', 'blockera'),
									status: 'draft',
									content:
										'<!-- wp:paragraph -->\n<p>Hello world!</p>\n<!-- /wp:paragraph -->',
								},
								{ throwOnError: true }
							);

							if (newPost?.id) {
								await tabActions.prefetchEntity(
									'post',
									newPost.id as number
								);
								const added = await tabActions.addTab(
									'post',
									newPost.id as number,
									__('New post', 'blockera')
								);
								if (added) {
									tabActions.switchDocument(
										'post',
										newPost.id as number
									);

									// Focus on the title and move cursor to end
									await focusPostTitle();
								}
							}

							close?.();
						} catch (error) {
							// @debug-ignore
							// eslint-disable-next-line no-console
							console.error('Failed to create new post:', error);
							close?.();
						}
					},
				});
			}

			// Add "New page" command if user has permission
			if (canCreatePage !== false) {
				const addNewPageLabel = __('Add new page', 'blockera');
				result.push({
					name: 'blockera-tabs/create-new-page',
					label: addNewPageLabel,
					searchLabel: `${addNewPageLabel} ${TAB_COMMAND_MARKER}`,
					keywords: [
						__('Create new page', 'blockera'),
						__('New page', 'blockera'),
					],
					icon: page,
					callback: async ({ close }) => {
						if (!isEditorPage()) {
							close?.();
							return;
						}

						try {
							const newPage = await saveEntityRecord(
								'postType',
								'page',
								{
									title: __('Draft Page', 'blockera'),
									status: 'draft',
									content:
										'<!-- wp:paragraph -->\n<p>Hello world!</p>\n<!-- /wp:paragraph -->',
								},
								{ throwOnError: true }
							);

							if (newPage?.id) {
								await tabActions.prefetchEntity(
									'page',
									newPage.id as number
								);
								const added = await tabActions.addTab(
									'page',
									newPage.id as number,
									__('New page', 'blockera')
								);
								if (added) {
									tabActions.switchDocument(
										'page',
										newPage.id as number
									);

									// Focus on the title and move cursor to end
									await focusPostTitle();
								}
							}

							close?.();
						} catch (error) {
							// @debug-ignore
							// eslint-disable-next-line no-console
							console.error('Failed to create new page:', error);
							close?.();
						}
					},
				});
			}

			return result;
		}, [canCreatePost, canCreatePage, saveEntityRecord]);

		return {
			commands,
			isLoading: false,
		};
	};
}

/**
 * Parameters for useCreateEntityCommands hook.
 */
export interface UseCreateEntityCommandsParams {
	/** Function to add a new tab. */
	addTab: (
		postType: string,
		postId: number,
		title?: string | null
	) => Promise<boolean>;
	/** Function to switch to a document. */
	switchDocument: (postType: string, postId: number) => void;
	/** Function to prefetch entity before switching. */
	prefetchEntity: (postType: string, postId: number) => Promise<unknown>;
}

/**
 * Hook to register "Create new post" and "Create new page" commands
 * Uses useCommandLoader with entity-edit context to show commands by default
 *
 * @param params - Parameters
 */
export function useCreateEntityCommands({
	addTab,
	switchDocument,
	prefetchEntity,
}: UseCreateEntityCommandsParams): void {
	// Create a stable reference to tab actions
	const tabActions = useMemo(
		(): CreateEntityTabActions => ({
			addTab,
			switchDocument,
			prefetchEntity,
		}),
		[addTab, switchDocument, prefetchEntity]
	);

	// Create the loader hook
	const loaderHook = useMemo(
		() => getCreateEntityCommandsLoader(tabActions),
		[tabActions]
	);

	// Register the command loader WITH entity-edit context
	// Commands show by default when editing entities
	// CSS hides them when not in add-tab mode
	useCommandLoader({
		name: 'blockera-tabs/create-entity-commands',
		hook: loaderHook,
		context: ENTITY_EDIT_CONTEXT,
	});
}
