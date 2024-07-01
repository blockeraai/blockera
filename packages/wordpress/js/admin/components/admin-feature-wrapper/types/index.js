// @flow

export type FeatureConfig = {
	/**
	 * if true is active, false is deactivated.
	 */
	status: boolean,
	/**
	 * Configs for sub features.
	 */
	config?: Object,
	/**
	 * the parent feature.
	 */
	parent?: string,
	/**
	 * Is active on free settings.
	 */
	isActiveOnFree?: boolean,
	/**
	 * Is active on parent dependency settings.
	 */
	isParentActive?: boolean,
};
