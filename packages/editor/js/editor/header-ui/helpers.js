// @flow

/**
 * Blockera dependencies
 */
import { getGlobalStylesPanelTargets } from '@blockera/global-styles-ui/panel-override/selectors';

/**
 * Internal dependencies
 */
import type { GetTarget } from './types';

/**
 * Version-aware DOM selectors for WordPress Global Styles panel integration.
 * Delegates to `@blockera/global-styles-ui/panel-override` for WP 7.0+ support.
 */
export const getTargets = (version: string): GetTarget => ({
	globalStylesPanel: getGlobalStylesPanelTargets(version),
});
