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
	 * Is active on free settings.
	 */
	isActiveOnFree?: boolean,
};
