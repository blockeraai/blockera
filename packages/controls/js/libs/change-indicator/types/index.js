//@flow

export type IndicatorComponentProps = {
	/**
	 * Is changed on primary?
	 *
	 * @default false
	 */
	isChanged?: boolean,
	/**
	 * Is changed on other states?
	 *
	 * @default false
	 */
	isChangedOnStates?: boolean,
	className?: string,
};
