// @flow

/**
 * External dependencies
 */
import type { ComponentType } from 'react';

/**
 * Internal dependencies
 */

/**
 * Internal dependencies
 */
import type {
	StateTypes,
	TBreakpoint,
	TStates,
} from '../../block-card/block-states/types';
import type { THandleOnChangeAttributes } from '../../types';
import type {
	InnerBlocks,
	InnerBlockType,
} from '../../block-card/inner-blocks/types';

export type Props = {
	name: string,
	clientId: string,
	supports: Object,
	currentTab: string,
	insideBlockInspector: boolean,
	setCurrentTab: (tab: string) => void,
	additional: Object,
	attributes: Object,
	currentAttributes: Object,
	defaultAttributes: Object,
	controllerProps: {
		currentTab: string,
		currentState: TStates,
		blockeraInnerBlocks: Object,
		currentBreakpoint: TBreakpoint,
		currentInnerBlockState: TStates,
		currentBlock: 'master' | InnerBlockType,
		handleOnChangeAttributes: THandleOnChangeAttributes,
	},
	children?: ComponentType<any>,
	currentStateAttributes: Object,
	blockeraInnerBlocks: InnerBlocks,
	setAttributes: (attributes: Object) => void,
	availableStates: { [key: TStates | string]: StateTypes },
};
