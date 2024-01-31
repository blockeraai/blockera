// @flow

export type MoreFeaturesProps = {
	/**
	 * CSS classes to apply to the tooltip.
	 */
	className?: string,
	/**
	 * Inner items to display in the tooltip.
	 */
	children: any,
	/**
	 * The features are shown or not.
	 */
	isOpen?: boolean,
	/**
	 * The features are changed or not indicator.
	 */
	isChanged?: boolean,
};
