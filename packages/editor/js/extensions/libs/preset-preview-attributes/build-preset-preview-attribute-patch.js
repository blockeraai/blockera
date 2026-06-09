// @flow

/**
 * Internal dependencies
 */
import { isInnerBlock, isNormalState } from '../../components/utils';
import { getBaseBreakpoint } from '../../../editor/header-ui';

export type PresetPreviewAttributePatchContext = {|
	currentBlock: string,
	currentState: string,
	currentBreakpoint: string,
	currentInnerBlockState: string,
|};

const blockStateBreakpointAttributes = (
	state: string,
	breakpoint: string,
	attributes: Object
): Object => ({
	blockeraBlockStates: {
		[state]: {
			breakpoints: {
				[breakpoint]: {
					attributes,
				},
			},
			isVisible: true,
		},
	},
});

const innerBlockAttributes = (
	innerBlock: string,
	attributes: Object
): Object => ({
	blockeraInnerBlocks: {
		[innerBlock]: {
			attributes,
		},
	},
});

/**
 * Maps flat Blockera style attributes from global-styles preset helpers into the
 * nested attribute shape expected by the style engine (blockeraBlockStates /
 * blockeraInnerBlocks), matching the active block / state / breakpoint context.
 *
 * @param {Object} flatAttributes Partial attributes from preset preview helpers.
 * @param {PresetPreviewAttributePatchContext} context Active editor context.
 * @return {Object} Attribute patch for PresetCanvasPreviewContext.
 */
export function buildPresetPreviewAttributePatch(
	flatAttributes: Object,
	{
		currentBlock,
		currentState,
		currentBreakpoint,
		currentInnerBlockState,
	}: PresetPreviewAttributePatchContext
): Object {
	if (!flatAttributes || !Object.keys(flatAttributes).length) {
		return {};
	}

	const isEditingInnerBlock = isInnerBlock(currentBlock);
	const isBaseBreakpoint = getBaseBreakpoint() === currentBreakpoint;
	const isMasterNormalOnBase =
		isNormalState(currentState) && isBaseBreakpoint;
	const isInnerNormalOnBase =
		isNormalState(currentInnerBlockState) && isBaseBreakpoint;

	if (!isEditingInnerBlock && isMasterNormalOnBase) {
		return flatAttributes;
	}

	if (isEditingInnerBlock && isMasterNormalOnBase && isInnerNormalOnBase) {
		return innerBlockAttributes(currentBlock, flatAttributes);
	}

	if (isEditingInnerBlock && isMasterNormalOnBase && !isInnerNormalOnBase) {
		return innerBlockAttributes(currentBlock, {
			...blockStateBreakpointAttributes(
				currentInnerBlockState,
				currentBreakpoint,
				flatAttributes
			),
		});
	}

	if (isEditingInnerBlock && !isMasterNormalOnBase && isInnerNormalOnBase) {
		return blockStateBreakpointAttributes(currentState, currentBreakpoint, {
			...innerBlockAttributes(currentBlock, flatAttributes),
		});
	}

	if (isEditingInnerBlock && !isMasterNormalOnBase && !isInnerNormalOnBase) {
		return blockStateBreakpointAttributes(currentState, currentBreakpoint, {
			...innerBlockAttributes(currentBlock, {
				...blockStateBreakpointAttributes(
					currentInnerBlockState,
					currentBreakpoint,
					flatAttributes
				),
			}),
		});
	}

	return blockStateBreakpointAttributes(
		currentState,
		currentBreakpoint,
		flatAttributes
	);
}
