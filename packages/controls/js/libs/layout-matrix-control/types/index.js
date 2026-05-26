// @flow

/**
 * Internal dependencies
 */
import type { ControlGeneralTypes } from '../../../types';

export type Props = {
	...ControlGeneralTypes,
	defaultValue?: LayoutMatrix,
	/**
	 * is direction control active or not. if you disable it you have to pass 'defaultDirection' to set the direction of control
	 */
	isDirectionActive: boolean,
	/**
	 * default direction of control if it was not specified in the value or even if direcrion was disable
	 */
	defaultDirection: 'row' | 'column',
	/**
	 * is dense control active or not
	 */
	isDenseActive: boolean,
};

export type AlignItems = '' | 'flex-start' | 'center' | 'flex-end' | 'stretch';
export type JustifyContent =
	| ''
	| 'flex-start'
	| 'center'
	| 'flex-end'
	| 'space-between'
	| 'space-around';

export type LayoutMatrix = {
	alignItems: AlignItems,
	justifyContent: JustifyContent,
	direction: 'row' | 'column',
	dense?: boolean,
};
