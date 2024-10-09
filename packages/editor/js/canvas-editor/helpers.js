// @flow

/**
 * Blockera dependencies
 */
import { isLoadedSiteEditor } from '@blockera/utils';

/**
 * Internal dependencies
 */
import type { GetTarget } from './types';

// Compatibility for WordPress supported versions.
export const getTarget = (version: string): GetTarget => {
	// Regular expression to detect wp all alpha or beta versioning pattern.
	const regexp = /(\d+\.\d+\.\d+)-.*/gi;
	const matches = regexp.exec(version);

	if (matches && matches.length > 1) {
		// Extract next stable version.
		version = matches[1];
	}

	// For WordPress version equals or bigger than 6.6.1 version.
	if (Number(version?.replace(/\./g, '')) >= 661) {
		return {
			header: '.editor-header__center',
			previewDropdown:
				'.editor-preview-dropdown, a.components-button[aria-label="View Post"], a.components-button[aria-label="View Page"]',
			postPreviewElement: 'a[aria-label="View Post"]',
		};
	}

	// For less than WordPress 6.6.1 versions.
	return {
		header: isLoadedSiteEditor()
			? '.edit-site-header-edit-mode__center'
			: '.edit-post-header__center',
		postPreviewElement:
			'a[aria-label="View Post"], a[aria-label="View Page"]',
		previewDropdown: 'div.edit-site-header-edit-mode__preview-options',
	};
};
