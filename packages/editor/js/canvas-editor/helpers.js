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
export const getTargets = (version: string): GetTarget => {
	// Regular expression to detect wp all alpha or beta versioning pattern.
	const regexp = /(\d+\.\d+(|\.\d+))-.*/gi;
	const matches = regexp.exec(version);

	if (matches && matches.length > 1) {
		// Extract next stable version.
		version = matches[1];
	}

	const dotsMatches = /\./g.exec(version);
	version = version?.replace(/\./g, '');

	const globalStylesPanel: Object = {
		blocksButton: `button[id="\/blocks"]`,
		screen: '.edit-site-global-styles-sidebar__navigator-screen',
		blockScreenListItem: `button[id^="\/blocks\/core%2F"]:not([id*="\/variations\/"])`,
		globalStylesScreen: '.edit-site-global-styles-screen',
	};

	const targets: {
		header: string,
		globalStylesPanel: Object,
	} = {
		header: '.editor-header__center',
		globalStylesPanel,
	};

	// For WordPress version equals or bigger than 6.6.1 version.
	if (dotsMatches) {
		if (dotsMatches.length > 2 && Number(version) >= 661) {
			return targets;
		} else if (Number(version) > 66) {
			return targets;
		}
	}

	// For less than WordPress 6.6.1 versions.
	return {
		header: isLoadedSiteEditor()
			? '.edit-site-header-edit-mode__center'
			: '.edit-post-header__center',
		globalStylesPanel,
	};
};
