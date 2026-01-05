/**
 * Hook to generate preview URLs for WordPress template types.
 *
 * This hook parses template slugs and generates appropriate frontend preview URLs
 * by fetching relevant entities (posts, terms, authors) from WordPress core-data.
 *
 * @package
 */

/**
 * WordPress dependencies
 */
import { useSelect } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';
import { useMemo } from '@wordpress/element';
import { addQueryArgs } from '@wordpress/url';

/**
 * Internal dependencies
 */
import { parseTemplateSlug } from './urlUtils';
import {
	NON_PREVIEWABLE_POST_TYPES,
	TEMPLATE_POST_TYPE,
	type ParsedTemplateSlug,
} from './constants';

/**
 * Site base data from WordPress core.
 * Using the unstable base entity which contains home URL and site info.
 */
interface SiteBaseData {
	home?: string;
	name?: string;
}

/**
 * Entity record with link property.
 */
interface EntityWithLink {
	link?: string;
	slug?: string;
	[key: string]: unknown;
}

/**
 * Post type object from WordPress.
 */
interface PostTypeObject {
	slug: string;
	rest_base?: string;
	has_archive?: boolean | string;
	viewable?: boolean;
}

/**
 * Return type for useTemplatePreviewUrl hook.
 */
export interface UseTemplatePreviewUrlReturn {
	/** The preview URL for this template, or null if not available. */
	previewUrl: string | null;
	/** Whether the URL is still being resolved. */
	isLoading: boolean;
	/** Parsed template slug information. */
	parsedSlug: ParsedTemplateSlug | null;
}

/**
 * Hook to generate preview URLs for site editor templates.
 *
 * Handles different template types:
 * - Home templates (index, home, front-page): Uses site home URL
 * - Search template: Uses home URL with search query
 * - 404 template: Uses a non-existent path
 * - Single/page templates: Fetches first published post/page
 * - Archive templates: Uses post type archive or fetches first term
 * - Taxonomy templates: Fetches first term of the taxonomy
 * - Author templates: Fetches first author
 *
 * @param postType - The post type (should be 'wp_template' for templates).
 * @param templateSlug - The template slug (e.g., 'single-post', 'category').
 * @return Object with previewUrl, isLoading state, and parsed slug info.
 */
export function useTemplatePreviewUrl(
	postType: string | null | undefined,
	templateSlug: string | null | undefined
): UseTemplatePreviewUrlReturn {
	// Parse the template slug to understand what type of template this is
	const parsedSlug = useMemo(
		() => parseTemplateSlug(templateSlug),
		[templateSlug]
	);

	// Main selector to get all data needed for URL generation
	const { previewUrl, isLoading } = useSelect(
		(select) => {
			// Early return for non-template post types or non-previewable types
			if (postType !== TEMPLATE_POST_TYPE) {
				// Check if it's a non-previewable site editor type
				if (
					NON_PREVIEWABLE_POST_TYPES.includes(
						postType as (typeof NON_PREVIEWABLE_POST_TYPES)[number]
					)
				) {
					return { previewUrl: null, isLoading: false };
				}
				return { previewUrl: null, isLoading: false };
			}

			if (!parsedSlug) {
				return { previewUrl: null, isLoading: false };
			}

			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			const coreSelect = select(coreStore) as any;

			// Get site base data (home URL, site name)
			const siteData = coreSelect.getEntityRecord(
				'root',
				'__unstableBase'
			) as SiteBaseData | undefined;

			const homeUrl = siteData?.home;
			const siteName = siteData?.name ?? '';

			// Check if site data is still loading
			const isSiteDataLoading = coreSelect.isResolving(
				'getEntityRecord',
				['root', '__unstableBase']
			);

			if (!homeUrl) {
				return { previewUrl: null, isLoading: isSiteDataLoading };
			}

			// Generate URL based on template type
			switch (parsedSlug.type) {
				// Home/front-page templates use the home URL directly
				case 'home': {
					return { previewUrl: homeUrl, isLoading: false };
				}

				// Search template uses home URL with a search query
				// Use first word of site name to ensure results exist
				case 'search': {
					const firstWord = siteName.trim().split(/\s+/)[0] || 'test';
					return {
						previewUrl: addQueryArgs(homeUrl, { s: firstWord }),
						isLoading: false,
					};
				}

				// 404 template uses a non-existent path
				case '404': {
					const notFoundPath =
						'/this-is-a-404-page-' + Date.now() + '/';
					return {
						previewUrl: homeUrl.replace(/\/$/, '') + notFoundPath,
						isLoading: false,
					};
				}

				// Date archive uses current year
				case 'date': {
					const currentYear = new Date().getFullYear();
					return {
						previewUrl:
							homeUrl.replace(/\/$/, '') +
							'/' +
							currentYear +
							'/',
						isLoading: false,
					};
				}

				// Privacy policy - try to get from site settings
				case 'privacy-policy': {
					// WordPress stores privacy policy page ID in site settings
					// For now, use a fallback approach with ?page_id
					const siteSettings = coreSelect.getEntityRecord(
						'root',
						'site'
					) as { page_for_privacy_policy?: number } | undefined;
					if (siteSettings?.page_for_privacy_policy) {
						const privacyPage = coreSelect.getEntityRecord(
							'postType',
							'page',
							siteSettings.page_for_privacy_policy
						) as EntityWithLink | undefined;
						if (privacyPage?.link) {
							return {
								previewUrl: privacyPage.link,
								isLoading: false,
							};
						}
					}
					// Fallback to home URL if no privacy page set
					return { previewUrl: homeUrl, isLoading: false };
				}

				// Single/singular templates - fetch latest edited published post
				case 'single': {
					const targetPostType = parsedSlug.postType ?? 'post';

					// If we have a specific entity slug, try to find that post
					if (parsedSlug.entitySlug) {
						const posts = coreSelect.getEntityRecords(
							'postType',
							targetPostType,
							{
								slug: parsedSlug.entitySlug,
								status: 'publish',
								per_page: 1,
							}
						) as EntityWithLink[] | null;

						const isPostsLoading = coreSelect.isResolving(
							'getEntityRecords',
							[
								'postType',
								targetPostType,
								{
									slug: parsedSlug.entitySlug,
									status: 'publish',
									per_page: 1,
								},
							]
						);

						if (posts?.[0]?.link) {
							return {
								previewUrl: posts[0].link,
								isLoading: false,
							};
						}
						return { previewUrl: null, isLoading: isPostsLoading };
					}

					// Get latest edited published post of this type
					const posts = coreSelect.getEntityRecords(
						'postType',
						targetPostType,
						{
							status: 'publish',
							per_page: 1,
							orderby: 'modified',
							order: 'desc',
						}
					) as EntityWithLink[] | null;

					const isPostsLoading = coreSelect.isResolving(
						'getEntityRecords',
						[
							'postType',
							targetPostType,
							{
								status: 'publish',
								per_page: 1,
								orderby: 'modified',
								order: 'desc',
							},
						]
					);

					if (posts?.[0]?.link) {
						return { previewUrl: posts[0].link, isLoading: false };
					}
					return { previewUrl: null, isLoading: isPostsLoading };
				}

				// Page templates - fetch latest edited published page or specific page by slug
				case 'page': {
					// If we have a specific page slug, try to find it
					if (parsedSlug.entitySlug) {
						const pages = coreSelect.getEntityRecords(
							'postType',
							'page',
							{
								slug: parsedSlug.entitySlug,
								status: 'publish',
								per_page: 1,
							}
						) as EntityWithLink[] | null;

						const isPagesLoading = coreSelect.isResolving(
							'getEntityRecords',
							[
								'postType',
								'page',
								{
									slug: parsedSlug.entitySlug,
									status: 'publish',
									per_page: 1,
								},
							]
						);

						if (pages?.[0]?.link) {
							return {
								previewUrl: pages[0].link,
								isLoading: false,
							};
						}
						return { previewUrl: null, isLoading: isPagesLoading };
					}

					// Get latest edited published page
					const pages = coreSelect.getEntityRecords(
						'postType',
						'page',
						{
							status: 'publish',
							per_page: 1,
							orderby: 'modified',
							order: 'desc',
						}
					) as EntityWithLink[] | null;

					const isPagesLoading = coreSelect.isResolving(
						'getEntityRecords',
						[
							'postType',
							'page',
							{
								status: 'publish',
								per_page: 1,
								orderby: 'modified',
								order: 'desc',
							},
						]
					);

					if (pages?.[0]?.link) {
						return { previewUrl: pages[0].link, isLoading: false };
					}
					return { previewUrl: null, isLoading: isPagesLoading };
				}

				// Archive templates - use post type archive link or home for default
				case 'archive': {
					// If specific post type, get its archive link
					if (parsedSlug.postType) {
						const postTypeObj = coreSelect.getPostType(
							parsedSlug.postType
						) as PostTypeObject | undefined;

						if (postTypeObj?.has_archive) {
							// Archive URL is typically home/{post_type}/
							const archiveSlug =
								typeof postTypeObj.has_archive === 'string'
									? postTypeObj.has_archive
									: postTypeObj.slug;
							return {
								previewUrl:
									homeUrl.replace(/\/$/, '') +
									'/' +
									archiveSlug +
									'/',
								isLoading: false,
							};
						}
					}

					// Default archive (posts) - use home URL
					return { previewUrl: homeUrl, isLoading: false };
				}

				// Category templates - fetch first or specific category
				case 'category': {
					const queryArgs = parsedSlug.entitySlug
						? { slug: parsedSlug.entitySlug, per_page: 1 }
						: {
								per_page: 1,
								orderby: 'count',
								order: 'desc' as const,
						  };

					const categories = coreSelect.getEntityRecords(
						'taxonomy',
						'category',
						queryArgs
					) as EntityWithLink[] | null;

					const isCategoriesLoading = coreSelect.isResolving(
						'getEntityRecords',
						['taxonomy', 'category', queryArgs]
					);

					if (categories?.[0]?.link) {
						return {
							previewUrl: categories[0].link,
							isLoading: false,
						};
					}
					return { previewUrl: null, isLoading: isCategoriesLoading };
				}

				// Tag templates - fetch first or specific tag
				case 'tag': {
					const queryArgs = parsedSlug.entitySlug
						? { slug: parsedSlug.entitySlug, per_page: 1 }
						: {
								per_page: 1,
								orderby: 'count',
								order: 'desc' as const,
						  };

					const tags = coreSelect.getEntityRecords(
						'taxonomy',
						'post_tag',
						queryArgs
					) as EntityWithLink[] | null;

					const isTagsLoading = coreSelect.isResolving(
						'getEntityRecords',
						['taxonomy', 'post_tag', queryArgs]
					);

					if (tags?.[0]?.link) {
						return { previewUrl: tags[0].link, isLoading: false };
					}
					return { previewUrl: null, isLoading: isTagsLoading };
				}

				// Author templates - fetch first or specific author
				// Note: REST API orderby for users supports: id, include, name,
				// registered_date, slug, include_slugs, email, url (not post_count)
				case 'author': {
					const queryArgs = parsedSlug.entitySlug
						? {
								slug: parsedSlug.entitySlug,
								per_page: 1,
								who: 'authors',
						  }
						: {
								per_page: 1,
								orderby: 'registered_date',
								order: 'desc' as const,
								who: 'authors',
						  };

					const authors = coreSelect.getEntityRecords(
						'root',
						'user',
						queryArgs
					) as EntityWithLink[] | null;

					const isAuthorsLoading = coreSelect.isResolving(
						'getEntityRecords',
						['root', 'user', queryArgs]
					);

					if (authors?.[0]?.link) {
						return {
							previewUrl: authors[0].link,
							isLoading: false,
						};
					}
					return { previewUrl: null, isLoading: isAuthorsLoading };
				}

				// Generic taxonomy templates
				case 'taxonomy': {
					const taxonomySlug = parsedSlug.taxonomy;

					if (!taxonomySlug) {
						// No specific taxonomy - can't generate URL
						return { previewUrl: null, isLoading: false };
					}

					const queryArgs = parsedSlug.entitySlug
						? { slug: parsedSlug.entitySlug, per_page: 1 }
						: {
								per_page: 1,
								orderby: 'count',
								order: 'desc' as const,
						  };

					const terms = coreSelect.getEntityRecords(
						'taxonomy',
						taxonomySlug,
						queryArgs
					) as EntityWithLink[] | null;

					const isTermsLoading = coreSelect.isResolving(
						'getEntityRecords',
						['taxonomy', taxonomySlug, queryArgs]
					);

					if (terms?.[0]?.link) {
						return { previewUrl: terms[0].link, isLoading: false };
					}
					return { previewUrl: null, isLoading: isTermsLoading };
				}

				// Attachment templates - try to get latest edited attachment
				case 'attachment': {
					const attachments = coreSelect.getEntityRecords(
						'postType',
						'attachment',
						{
							status: 'inherit',
							per_page: 1,
							orderby: 'modified',
							order: 'desc',
						}
					) as EntityWithLink[] | null;

					const isAttachmentsLoading = coreSelect.isResolving(
						'getEntityRecords',
						[
							'postType',
							'attachment',
							{
								status: 'inherit',
								per_page: 1,
								orderby: 'modified',
								order: 'desc',
							},
						]
					);

					if (attachments?.[0]?.link) {
						return {
							previewUrl: attachments[0].link,
							isLoading: false,
						};
					}
					return {
						previewUrl: null,
						isLoading: isAttachmentsLoading,
					};
				}

				// Unknown template types - fallback to home URL
				case 'unknown':
				default:
					return { previewUrl: homeUrl, isLoading: false };
			}
		},
		[postType, parsedSlug]
	);

	return {
		previewUrl,
		isLoading,
		parsedSlug,
	};
}
