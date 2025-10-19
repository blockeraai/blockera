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
	/**
	 * Is changed indicator animated?
	 *
	 * @default true
	 */
	animated?: boolean,
	/**
	 * Class name
	 *
	 * @default ''
	 */
	className?: string,
	/**
	 * Primary color
	 *
	 * @default '#007cba'
	 */
	primaryColor?: string,
	/**
	 * States color
	 *
	 * @default '#d47c14'
	 */
	statesColor?: string,
	/**
	 * Size
	 *
	 * @default '6'
	 */
	size?: string,
	/**
	 * Outline size
	 *
	 * @default '1.5'
	 */
	outlineSize?: string,
};
