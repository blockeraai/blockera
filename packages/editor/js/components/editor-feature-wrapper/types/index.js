// @flow
/**
 * Blockera dependencies
 */
import type { FeatureConfig } from '@blockera/editor/js/extensions/libs/base';

export type EditorFeatureWrapperProps = {
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
	/**
	 * The method of notice displaying
	 */
	showText?: 'on-hover' | 'always',
};
