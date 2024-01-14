// @flow

/**
 * Internal dependencies
 */
import type { ControlGeneralTypes } from '../../../types';

export type Props = {
	...ControlGeneralTypes,
	defaultValue?: LayoutMatrix,
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
	dense?: '' | boolean,
};
