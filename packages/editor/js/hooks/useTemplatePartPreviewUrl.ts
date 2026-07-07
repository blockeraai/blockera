/**
 * Hook to generate isolated preview URLs for WordPress template parts.
 *
 * Template parts are previewed on a dedicated frontend page that renders only
 * the part content (no theme header, footer, or surrounding template).
 *
 * @package
 */

/**
 * WordPress dependencies
 */
import { useSelect } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';

/**
 * Internal dependencies
 */
import { buildTemplatePartPreviewUrl } from './urlUtils';
import { TEMPLATE_PART_POST_TYPE } from './constants';

/**
 * Site base data from WordPress core.
 */
interface SiteBaseData {
	home?: string;
}

/**
 * Return type for useTemplatePartPreviewUrl hook.
 */
export interface UseTemplatePartPreviewUrlReturn {
	/** The preview URL for this template part, or null if not available. */
	previewUrl: string | null;
	/** Whether the URL is still being resolved. */
	isLoading: boolean;
}

/**
 * Hook to generate preview URLs for site editor template parts.
 *
 * @param postType         Post type slug.
 * @param templatePartId   Template part id (theme//slug).
 * @return Object with previewUrl and isLoading state.
 */
const TEMPLATE_PART_PREVIEW_IDLE = {
	previewUrl: null,
	isLoading: false,
} as const;

export function useTemplatePartPreviewUrl(
	postType: string | null | undefined,
	templatePartId: string | number | null | undefined
): UseTemplatePartPreviewUrlReturn {
	return useSelect(
		(select) => {
			if (
				postType !== TEMPLATE_PART_POST_TYPE ||
				templatePartId === null ||
				templatePartId === undefined ||
				templatePartId === ''
			) {
				return TEMPLATE_PART_PREVIEW_IDLE;
			}

			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			const coreSelect = select(coreStore) as any;

			const siteData = coreSelect.getEntityRecord(
				'root',
				'__unstableBase'
			) as SiteBaseData | undefined;

			const isSiteDataLoading = coreSelect.isResolving(
				'getEntityRecord',
				['root', '__unstableBase']
			);

			const homeUrl = siteData?.home;
			if (!homeUrl) {
				return { previewUrl: null, isLoading: isSiteDataLoading };
			}

			const previewUrl = buildTemplatePartPreviewUrl(
				String(templatePartId),
				homeUrl
			);

			return { previewUrl, isLoading: false };
		},
		[postType, templatePartId]
	);
}
