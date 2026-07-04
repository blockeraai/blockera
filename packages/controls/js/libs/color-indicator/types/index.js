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
	/**
	 * Native title (tooltip); contextual keywords set a default explanation unless overridden.
	 */
	title?: string,
	/**
	 * Accessible label; contextual keywords set a default unless overridden.
	 */
	'aria-label'?: string,
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
	/**
	 * Stack paint order. `normal` follows DOM order; `centered` peaks z-index
	 * at the middle item (left-middle when the count is even).
	 */
	displayMode?: 'normal' | 'centered',
	/**
	 * Overlap gap for stacked indicators (`--stack-space`). Numbers are treated
	 * as pixels (e.g. `-10` → `-10px`). When omitted, spacing is derived from
	 * the visible item count.
	 */
	space?: number | string,
};
