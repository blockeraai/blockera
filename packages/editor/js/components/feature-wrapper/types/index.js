// @flow
/**
 * Blockera dependencies
 */
import type { FeatureConfig } from '@blockera/editor-extensions/js/libs/base';

export type FeatureWrapperProps = {
	/**
	 * CSS classes to apply to the tooltip.
	 */
	className?: string,
	/**
	 * The feature config.
	 */
	config: FeatureConfig,
	/**
	 * Inner items to display in the tooltip.
	 */
	children: any,
	/**
	 * The feature is active.
	 */
	isActive?: boolean,
};
