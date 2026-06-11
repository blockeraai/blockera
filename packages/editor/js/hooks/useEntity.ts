/**
 * Unified hook to get all entity (document) data.
 *
 * This hook consolidates multiple entity-related hooks into a single,
 * comprehensive hook that returns all entity information including:
 * - Basic identifiers (type, id)
 * - Entity data (title, status, slug, link, record)
 * - State flags (dirty, isCurrentDocument, isLoading, hasResolved)
 * - URLs (editorUrl, viewUrl)
 * - Actions (prefetchEntity)
 *
 * @example
 * // Get entity data for a specific post
 * const entity = useEntity('post', 123);
 *
 * // Access entity properties
 * console.log(entity.title);        // "My Post Title"
 * console.log(entity.status);       // "publish"
 * console.log(entity.dirty);        // true if has unsaved changes
 * console.log(entity.editorUrl);    // "/wp-admin/post.php?post=123&action=edit"
 *
 * // Prefetch this entity (useful before displaying)
 * await entity.prefetchEntity();
 *
 * @package
 */

/**
 * WordPress dependencies
 */
import { useSelect, useDispatch, resolveSelect } from '@wordpress/data';
import {
	useCallback,
	useMemo,
	useRef,
	useEffect,
	useState,
} from '@wordpress/element';
import { store as coreStore } from '@wordpress/core-data';
import { store as editorStore } from '@wordpress/editor';
import type { Post, PostStatus, PostTypeConfig } from '@wordpress/core-data';

/**
 * Internal dependencies
 */
import {
	getEditorUrl,
	isSiteEditorPostType,
	isValidUrl,
	saveSiteEditorEntityForPreview,
} from './urlUtils';
import { useTemplatePreviewUrl } from './useTemplatePreviewUrl';
import {
	TEMPLATE_POST_TYPE,
	NON_PREVIEWABLE_POST_TYPES,
	isTemplateAutosavePreviewType,
} from './constants';

/**
 * Entity record with title that can be string or object.
 */
interface EntityRecordWithTitle {
	title?: string | { rendered?: string; raw?: string };
	status?: PostStatus;
	slug?: string;
	link?: string;
	[key: string]: unknown;
}

/**
 * Return type for useEntity hook.
 */
export interface UseEntityReturn {
	/** Post type (e.g., 'post', 'page'). */
	type: string | null;
	/** Post ID. */
	id: string | number | null;
	/** Entity title (reactive to changes). */
	title: string | null;
	/** Entity status (publish, draft, etc.). */
	status: string | null;
	/** Entity slug/permalink. */
	slug: string | null;
	/** Entity permalink URL. */
	link: string | null;
	/** Full entity record object. */
	record: EntityRecordWithTitle | null;
	/** Has unsaved changes. */
	dirty: boolean;
	/** Is the active editor document. */
	isCurrentDocument: boolean;
	/** Entity data is loading. */
	isLoading: boolean;
	/** Entity resolution completed. */
	hasResolved: boolean;
	/** Is a site editor entity type. */
	isSiteEditorType: boolean;
	/** Admin URL to edit this entity. */
	editorUrl: string | null;
	/**
	 * Frontend URL to view/preview this entity.
	 * - Regular posts/pages: uses the entity's permalink
	 * - wp_template: generates appropriate URL based on template slug (e.g., search, 404, category)
	 * - Other site editor types (parts, nav, blocks): null (not directly previewable)
	 */
	viewUrl: string | null;
	/** viewUrl is a valid URL. */
	hasValidViewUrl: boolean;
	/** Whether the post is in a saveable state (current document only). */
	isSaveable: boolean;
	/** Whether the post type is viewable on frontend. */
	isViewable: boolean;
	/** Async function to prefetch this entity. */
	prefetchEntity: () => Promise<Post | null>;
	/** Async function to get view URL (saves first if dirty, for current document only). */
	getPreviewUrl: () => Promise<string | null>;
}

/**
 * Hook to get comprehensive entity data for any document.
 *
 * @param postType - Post type (e.g., 'post', 'page', 'wp_template').
 * @param postId - Post ID.
 * @return Flat object with entity data, state flags, URLs, and actions.
 */
export function useEntity(
	postType: string | null | undefined,
	postId: string | number | null | undefined
): UseEntityReturn {
	/*
	 * Main selector for all entity data.
	 *
	 * Data fetching priority:
	 * 1. For current document: Use editorStore (real-time unsaved changes)
	 * 2. For other documents: Use getEditedEntityRecord (unsaved changes in other tabs)
	 * 3. Fallback: Use getEntityRecord (saved data from server)
	 *
	 * This ensures we always show the most up-to-date data, including unsaved edits.
	 */
	/*
	 * Get entity data from stores with equality checking.
	 *
	 * CRITICAL: The editor store fires updates very frequently (on every keystroke,
	 * selection change, etc.). Without equality checking, this selector would fire
	 * hundreds of times per second, creating new object references even when values
	 * haven't changed, causing excessive re-renders in all components using useEntity.
	 *
	 * We use useMemo with a custom equality check to only create a new object when
	 * the actual data values change, not on every store update.
	 */
	const rawEntityData = useSelect(
		(select) => {
			// Early return if missing identifiers
			if (!postType || !postId) {
				return {
					// Entity data
					title: null,
					status: null,
					slug: null,
					link: null,
					record: null,

					// State flags
					dirty: false,
					isCurrentDocument: false,
					isLoading: false,
					hasResolved: true,

					// Preview state
					isSaveable: false,
					isViewable: false,
				};
			}

			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			const coreSelect = select(coreStore) as any;
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			const editorSelect = select(editorStore) as any;

			// Check if this is the current document being edited
			const currentPostId = editorSelect.getCurrentPostId();
			const currentPostType = editorSelect.getCurrentPostType();
			const isCurrentDocument =
				currentPostId === postId && currentPostType === postType;

			// Get dirty state
			const dirty = coreSelect.hasEditsForEntityRecord(
				'postType',
				postType,
				postId
			);

			// Get resolution state
			const selectorArgs = ['postType', postType, postId] as const;
			const isLoading = coreSelect.isResolving(
				'getEntityRecord',
				selectorArgs
			);
			const hasResolved = coreSelect.hasFinishedResolution(
				'getEntityRecord',
				selectorArgs
			);

			// Initialize entity data
			let title: string | null = null;
			let status: string | null = null;
			let slug: string | null = null;
			let link: string | null = null;
			let record: EntityRecordWithTitle | null = null;

			// If this is the current document, get data from editor store first
			// (includes real-time unsaved changes)
			if (isCurrentDocument) {
				title =
					(editorSelect.getEditedPostAttribute('title') as
						| string
						| undefined) ?? null;
				status =
					(editorSelect.getEditedPostAttribute('status') as
						| string
						| undefined) ?? null;
				slug =
					(editorSelect.getEditedPostAttribute('slug') as
						| string
						| undefined) ?? null;
				link =
					(editorSelect.getCurrentPostAttribute('link') as
						| string
						| undefined) ?? null;

				// Fallback to current post object
				if (!title || !status || !slug) {
					const currentPost = editorSelect.getCurrentPost() as
						| EntityRecordWithTitle
						| undefined;
					if (currentPost) {
						const postTitle = currentPost.title;
						title =
							title ??
							(typeof postTitle === 'string'
								? postTitle
								: (postTitle?.rendered ?? null));
						status = status ?? currentPost.status ?? null;
						slug = slug ?? currentPost.slug ?? null;
						link = link ?? currentPost.link ?? null;
						record = currentPost;
					}
				}
			}

			// For non-current documents or as fallback, use core-data store
			if (!isCurrentDocument || !title) {
				try {
					// First check for edited entity record (unsaved changes in other tabs)
					const editedRecord = coreSelect.getEditedEntityRecord(
						'postType',
						postType,
						postId
					) as EntityRecordWithTitle | undefined;

					if (editedRecord) {
						// Extract title (can be string or object with rendered property)
						if (editedRecord.title) {
							const recordTitle = editedRecord.title;
							title =
								title ??
								(typeof recordTitle === 'string'
									? recordTitle
									: (recordTitle.rendered ?? ''));
						}
						status = status ?? editedRecord.status ?? null;
						slug = slug ?? editedRecord.slug ?? null;
						link = link ?? editedRecord.link ?? null;
						record = editedRecord;
					}

					// Fallback to saved entity record
					if (!title || !status || !slug) {
						const savedRecord = coreSelect.getEntityRecord(
							'postType',
							postType,
							postId
						) as EntityRecordWithTitle | undefined;

						if (savedRecord) {
							if (savedRecord.title && !title) {
								const recordTitle = savedRecord.title;
								title =
									typeof recordTitle === 'string'
										? recordTitle
										: (recordTitle.rendered ?? '');
							}
							status = status ?? savedRecord.status ?? null;
							slug = slug ?? savedRecord.slug ?? null;
							link = link ?? savedRecord.link ?? null;
							record = record ?? savedRecord;
						}
					}
				} catch {
					// Entity not loaded yet - values remain null
				}
			}

			// Get preview state (only meaningful for current document)
			let isSaveable = false;
			let isViewable = false;

			// Check if post type is viewable
			const postTypeObj = coreSelect.getPostType(postType) as
				| PostTypeConfig
				| undefined;
			isViewable = postTypeObj?.viewable ?? false;

			// For wp_template, consider it "viewable" for preview purposes
			// Templates can be previewed via generated URLs (search, 404, archive, etc.)
			// even though they don't have traditional permalinks
			const isTemplate = postType === TEMPLATE_POST_TYPE;
			if (isTemplate) {
				isViewable = true;
			}

			// Get saveable state for current document
			// For site editor types, check saveability even if not traditionally "viewable"
			if (isCurrentDocument && (isViewable || isTemplate)) {
				isSaveable = editorSelect.isEditedPostSaveable() ?? false;
			}

			return {
				// Entity data
				title,
				status,
				slug,
				link,
				record,

				// State flags
				dirty,
				isCurrentDocument,
				isLoading,
				hasResolved,

				// Preview state
				isSaveable,
				isViewable,
			};
		},
		[postType, postId]
	);

	// Memoize entity data with equality checking to prevent unnecessary object recreations
	// Only create a new object when fields that affect the UI have changed
	//
	// CRITICAL: We ignore transient loading states (isLoading, hasResolved, isViewable) because they
	// change frequently during data fetching but don't affect the tabs UI. This prevents
	// hundreds of unnecessary object recreations and cascading re-renders.
	//
	// IMPORTANT: Extract primitive values first to use as dependencies, preventing React from
	// re-running the effect when rawEntityData gets a new object reference but values haven't changed.
	const previousEntityDataStableRef = useRef(rawEntityData);
	const [stableEntityData, setStableEntityData] = useState(rawEntityData);

	// Extract primitive values for dependency comparison (prevents re-runs when only object reference changes)
	const title = rawEntityData.title;
	const status = rawEntityData.status;
	const slug = rawEntityData.slug;
	const link = rawEntityData.link;
	const dirty = rawEntityData.dirty;
	const isCurrentDocument = rawEntityData.isCurrentDocument;
	const isSaveable = rawEntityData.isSaveable;
	const recordId = rawEntityData.record?.id ?? null;

	// Update stable entity data only when meaningful values change
	// eslint-disable-next-line react-hooks/exhaustive-deps
	useEffect(() => {
		const prev = previousEntityDataStableRef.current;
		const curr = rawEntityData;

		// Compare record by ID rather than reference, since WordPress stores may return
		// new object references even when the data is unchanged
		const prevRecordId = prev.record?.id ?? null;
		const currRecordId = curr.record?.id ?? null;
		const recordChanged = prevRecordId !== currRecordId;

		// Only check fields that affect the UI (title, status, slug, link, dirty, current document)
		// CRITICAL: Completely ignore transient loading states (isLoading, hasResolved, isViewable) because
		// they change frequently during data fetching but don't affect the tabs UI. WordPress stores
		// handle loading gracefully, and we'll get the data when it's ready.
		// NOTE: isViewable is also ignored because it's derived from post type config and shouldn't change
		// for a given post type, but if the post type object reference changes, it might trigger false positives.
		const valuesChanged =
			prev.title !== curr.title ||
			prev.status !== curr.status ||
			prev.slug !== curr.slug ||
			prev.link !== curr.link ||
			prev.dirty !== curr.dirty ||
			prev.isCurrentDocument !== curr.isCurrentDocument ||
			prev.isSaveable !== curr.isSaveable ||
			recordChanged;

		if (!valuesChanged) {
			// No changes, keep previous stable object
			return; // Don't update state, keep previous reference
		}

		// Values changed, update ref and state
		previousEntityDataStableRef.current = curr;
		setStableEntityData(curr);
	}, [
		title,
		status,
		slug,
		link,
		dirty,
		isCurrentDocument,
		isSaveable,
		recordId,
		postType,
		postId,
	]);

	// Return stable entity data - this reference only changes when meaningful values change
	const entityData = stableEntityData;

	// Compute editor URL (stable - only depends on postType and postId)
	const editorUrl = useMemo((): string | null => {
		if (!postType || !postId) {
			return null;
		}
		return getEditorUrl(postType, postId);
	}, [postType, postId]);

	// Check if this is a site editor type
	const isSiteEditorType = useMemo(
		() => isSiteEditorPostType(postType),
		[postType]
	);

	// For wp_template post types, use the template preview URL hook
	// This generates appropriate frontend URLs based on template slug
	const { previewUrl: templatePreviewUrl } = useTemplatePreviewUrl(
		postType,
		entityData.slug
	);

	// Compute view URL from entity link or template preview URL
	// - For regular post types: use the entity's link property
	// - For wp_template: use the generated template preview URL
	// - For other site editor types (parts, nav, blocks): return null (not previewable)
	const viewUrl = useMemo((): string | null => {
		// Regular post types use their direct link
		if (!isSiteEditorType) {
			return entityData.link ?? null;
		}

		// wp_template uses generated preview URL based on template slug
		if (postType === TEMPLATE_POST_TYPE) {
			return templatePreviewUrl;
		}

		// Other site editor types (wp_template_part, wp_navigation, wp_block)
		// don't have a single frontend page to preview
		if (
			NON_PREVIEWABLE_POST_TYPES.includes(
				postType as (typeof NON_PREVIEWABLE_POST_TYPES)[number]
			)
		) {
			return null;
		}

		return null;
	}, [isSiteEditorType, postType, entityData.link, templatePreviewUrl]);

	// Validate view URL
	const hasValidViewUrl = useMemo(() => isValidUrl(viewUrl), [viewUrl]);

	const { __unstableSaveForPreview } = useDispatch(editorStore) as {
		__unstableSaveForPreview: (options?: {
			forceIsAutosaveable?: boolean;
		}) => Promise<string>;
	};

	/**
	 * Get the view/preview URL for this entity.
	 * If the post has unsaved changes (dirty), saves first and returns fresh URL.
	 * If not dirty, returns the current viewUrl directly.
	 * Only works for the current document.
	 *
	 * @return The view/preview URL, or null if not available.
	 */
	const getPreviewUrl = useCallback(async (): Promise<string | null> => {
		if (isSiteEditorType) {
			// Template autosave preview: persist edits as autosave (not publish) and
			// open the preview_link nonce URL. Only wp_template / wp_template_part
			// expose the autosave REST endpoint Blockera extends server-side.
			if (
				entityData.dirty &&
				entityData.isCurrentDocument &&
				postType &&
				postId &&
				isTemplateAutosavePreviewType(postType)
			) {
				const previewLink = await saveSiteEditorEntityForPreview(
					postType,
					postId
				);

				if (previewLink && isValidUrl(previewLink)) {
					return previewLink;
				}
			}
			return viewUrl;
		}

		// For regular posts/pages: save first if dirty, then get fresh URL
		if (entityData.dirty) {
			return await __unstableSaveForPreview();
		}

		// If not dirty, return current viewUrl
		return viewUrl;
	}, [
		entityData.dirty,
		entityData.isCurrentDocument,
		__unstableSaveForPreview,
		viewUrl,
		isSiteEditorType,
		postType,
		postId,
	]);

	/**
	 * Prefetch this entity to ensure it's loaded.
	 * Returns a promise that resolves with the entity record when loaded.
	 *
	 * @return Promise resolving to entity record or null.
	 */
	const prefetchEntity = useCallback(async (): Promise<Post | null> => {
		if (!postType || !postId) {
			return null;
		}

		try {
			// resolveSelect returns a Promise that resolves when the selector resolves
			// This triggers the resolution if not already cached, and waits for it
			const resolvedStore = resolveSelect(coreStore);
			const recordResult = await resolvedStore.getEntityRecord(
				'postType',
				postType,
				postId
			);

			return (recordResult as Post) ?? null;
		} catch {
			// Entity might not exist or be accessible
			return null;
		}
	}, [postType, postId]);

	// Return flat structure with all data
	// CRITICAL: Memoize the return object to prevent new references on every render
	// This ensures that components using useEntity don't re-render unnecessarily
	return useMemo(
		() => ({
			// Identifiers
			type: postType ?? null,
			id: postId ?? null,

			// Entity data
			title: entityData.title,
			status: entityData.status,
			slug: entityData.slug,
			link: entityData.link,
			record: entityData.record,

			// State flags
			dirty: entityData.dirty,
			isCurrentDocument: entityData.isCurrentDocument,
			isLoading: entityData.isLoading,
			hasResolved: entityData.hasResolved,
			isSiteEditorType,

			// URLs
			editorUrl,
			viewUrl,
			hasValidViewUrl,

			// Preview state (current document only)
			isSaveable: entityData.isSaveable,
			isViewable: entityData.isViewable,

			// Actions
			prefetchEntity,
			getPreviewUrl,
		}),
		[
			postType,
			postId,
			entityData,
			isSiteEditorType,
			editorUrl,
			viewUrl,
			hasValidViewUrl,
			prefetchEntity,
			getPreviewUrl,
		]
	);
}
