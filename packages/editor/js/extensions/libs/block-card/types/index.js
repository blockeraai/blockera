// @flow

/**
 * External dependencies
 */
import type { MixedElement } from 'react';

/**
 * Internal dependencies
 */
import type {
	THandleOnChangeAttributes,
	UpdateBlockEditorSettings,
} from '../../types';
import type { InnerBlockType } from '../inner-blocks/types';
import type { TBreakpoint, TStates } from '../block-states/types';

export type PropTypes = {
	supports: Object,
	clientId: string,
	blockName: string,
	attributes: Object,
	setAttributes: (attributes: Object) => void,
	handleOnChangeAttributes: THandleOnChangeAttributes,
};

export type TStyleVariationBlockCardProps = {
	clientId: string,
	isActive: boolean,
	blockName: string,
	supports: Object,
	currentStateAttributes: Object,
	additional: Object,
	availableStates: Object,
	children?: MixedElement,
	currentBlockStyleVariation: {
		name: string,
		label: string,
		isDefault?: boolean,
	},
	setCurrentBlockStyleVariation: (style: {
		name: string,
		label: string,
	}) => void,
	currentBlock: 'master' | InnerBlockType | string,
	currentState: TStates,
	currentBreakpoint: TBreakpoint,
	currentInnerBlockState: TStates,
	insideBlockInspector: boolean,
	handleOnChangeAttributes: (
		attribute: string,
		value: any,
		options?: Object
	) => void,
	setAttributes: (attributes: Object) => void,
	handleOnClick: UpdateBlockEditorSettings,
};
