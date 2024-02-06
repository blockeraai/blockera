// @flow
/**
 * Publisher dependencies
 */
import type { FeatureConfig } from '@publisher/extensions/src/libs/base';

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
