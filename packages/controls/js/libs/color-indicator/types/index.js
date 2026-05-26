//@flow

export type ColorIndicatorProps = {
	/**
	 * Specifies the value type. It creates custom indicator for types and return empty tag for invalid types. Empty type will be treated as color.
	 */
	type?: 'color' | 'image' | 'gradient',
	/**
	 * Specifies the value of indicator. It's always string but the content of value can be differed by the `type` for example gradient or image url.
	 */
	value: string,
	/**
	 * Specifies the size of indicator.
	 */
	size: number,
	/**
	 * Specifies the className of indicator.
	 */
	className?: string,
	/**
	 * Specifies the style of indicator
	 */
	style?: Object,
	/**
	 * Check recieved value is value addon?
	 */
	checkIsValueAddon?: boolean,
};

export type ColorIndicatorStackProps = {
	/**
	 * Specifies the className
	 */
	className?: string,
	/**
	 * Specifies the value
	 */
	value?: Array<string | { value: string, type: string }>,
	/**
	 * Specifies the size of indicator
	 */
	size?: number,
	/**
	 * Specifies the max number of items in stack
	 */
	maxItems?: number,
};
