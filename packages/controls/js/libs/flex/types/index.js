//@flow

export type FlexDirectionsTypes =
	| 'column'
	| 'column-reverse'
	| 'row'
	| 'row-reverse';

export type FlexJustifyContentTypes =
	| 'flex-start'
	| 'center'
	| 'flex-end'
	| 'space-between'
	| 'space-around'
	| 'space-evenly';

export type FlexAlignItemsTypes =
	| 'flex-start'
	| 'center'
	| 'flex-end'
	| 'stretch';

export type FlexWrapTypes = 'nowrap' | 'wrap' | 'wrap-reverse';

export type FlexProps = {
	/**
	 * The flex-direction sets how flex items are placed in the flex container
	 * defining the main axis and the direction (normal or reversed).
	 */
	direction?: FlexDirectionsTypes,
	/**
	 * The amount of space between each child element.
	 * Spacing in between each child can be adjusted by using `gap`.
	 * You can use px or all other css units.
	 *
	 * @default 8px
	 */
	gap?: number | string,
	/**
	 * The justify-content defines how the browser distributes
	 * space between and around content items along the main-axis
	 * of a flex container, and the inline axis of a grid container.
	 */
	justifyContent?: FlexJustifyContentTypes,
	/**
	 * The justify-items defines the default justify-self for all items of the box,
	 * giving them all a default way of justifying each box along the appropriate axis.
	 */
	alignItems?: FlexAlignItemsTypes,
	/**
	 * The flex-wrap sets whether flex items are forced onto one line or can wrap onto multiple lines.
	 * If wrapping is allowed, it sets the direction that lines are stacked.
	 */
	flexWrap?: FlexWrapTypes,
	style?: Object,
	className?: string,
	children?: any,
	props?: Object,
};
