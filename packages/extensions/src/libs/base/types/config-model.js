// @flow

export type ConfigModel = {
	/**
	 * if true is active, false is deactivated.
	 */
	status: boolean,
	/**
	 * The label to show on extension settings popup.
	 */
	label: string,
	/**
	 * if feature value is set ,so active and show on block extension.
	 */
	show: boolean,
	/**
	 * if value is truthy by default active and show on block extension.
	 */
	force: boolean,
	/**
	 * The css generator configuration for current feature.
	 */
	cssGenerators?: Object | {},
};
