// @flow

/**
 * Internal dependencies
 */
import { isInnerBlock, isNormalState } from './utils';
import { VARIATION_SURFACE_SIZE } from '../../editor/global-styles/panel/variation-surfaces';

export const BLOCKERA_ACTIVE_COLOR_CSS_PROPERTIES = [
	'--blockera-controls-primary-color',
	'--blockera-tab-panel-active-color',
	'--blockera-controls-variations-color',
	'--blockera-controls-variations-color-bk',
	'--blockera-controls-variations-color-darker-20',
];

type ActiveColorScopeFlags = {
	insideBlockInspector: boolean,
	isGlobalStylesPanelRoot: boolean,
	isGlobalStylesCardWrapper: boolean,
	variationSurface: string | void,
};

/**
 * Normalizes StateContainer / preview-provider active-color scope flags.
 *
 * Global-styles surfaces pass `variationSurface` only when `!insideBlockInspector`.
 * Card-wrapper defaults to the same unless overridden (panel root sets root explicitly).
 *
 * @param {Object} options Scope inputs from callers.
 * @return {ActiveColorScopeFlags} Flags for {@see useBlockeraActiveColor}.
 */
export function getBlockeraActiveColorScopeFlags({
	insideBlockInspector = true,
	isGlobalStylesPanelRoot = false,
	isGlobalStylesCardWrapper,
	variationSurface,
}: {
	insideBlockInspector?: boolean,
	isGlobalStylesPanelRoot?: boolean,
	isGlobalStylesCardWrapper?: boolean,
	variationSurface?: string,
}): ActiveColorScopeFlags {
	const inGlobalStyles = !insideBlockInspector;

	return {
		insideBlockInspector,
		isGlobalStylesPanelRoot,
		isGlobalStylesCardWrapper: isGlobalStylesCardWrapper ?? inGlobalStyles,
		variationSurface: inGlobalStyles ? variationSurface : undefined,
	};
}

type ActiveColorContext = {
	currentBlock: string,
	currentState: string,
	currentInnerBlockState: string,
	getState: (state: string) => Object | void,
	getInnerState: (state: string) => Object | void,
	availableStates?: Object,
	blockeraUnsavedData?: Object,
	insideBlockInspector?: boolean,
	isGlobalStylesPanelRoot?: boolean,
	isGlobalStylesCardWrapper?: boolean,
	variationSurface?: string,
};

/**
 * Resolves the active Blockera state color (same rules as StateContainer).
 *
 * @param {ActiveColorContext} context State + block context.
 * @return {string|void} CSS color value.
 */
export const computeBlockeraActiveColor = (
	context: ActiveColorContext
): string | void => {
	const {
		currentBlock,
		currentState,
		currentInnerBlockState,
		getState,
		getInnerState,
		availableStates,
		blockeraUnsavedData,
		insideBlockInspector = true,
		isGlobalStylesPanelRoot = false,
		isGlobalStylesCardWrapper = false,
		variationSurface,
	} = context;

	// GS panel root wraps master + inner cards: always resolve master colors here.
	// Inner block colors are scoped by InnerBlockCard's own StateContainer.
	const colorContextBlock = isGlobalStylesPanelRoot ? 'master' : currentBlock;

	const selectedState = isInnerBlock(colorContextBlock)
		? currentInnerBlockState
		: currentState;

	const state = getState(selectedState) || getInnerState(selectedState);
	const fallbackState =
		availableStates && availableStates.hasOwnProperty(selectedState)
			? availableStates[selectedState]
			: blockeraUnsavedData?.states?.[selectedState];

	let color = state ? state?.settings?.color : fallbackState?.settings?.color;

	if (
		!isGlobalStylesPanelRoot &&
		isInnerBlock(currentBlock) &&
		isNormalState(currentInnerBlockState)
	) {
		color = '#cc0000';
	} else if (
		!isInnerBlock(colorContextBlock) &&
		(!insideBlockInspector || isGlobalStylesCardWrapper) &&
		isNormalState(currentState)
	) {
		color =
			variationSurface === VARIATION_SURFACE_SIZE
				? 'var(--blockera-controls-block-variations-size)'
				: 'var(--blockera-controls-block-variations-style)';
	}

	return color;
};

const GLOBAL_STYLES_SIZE_VARIATION_CSS_VARS: Object = {
	'--blockera-controls-variations-color':
		'var(--blockera-controls-block-variations-size)',
	'--blockera-controls-variations-color-bk':
		'var(--blockera-controls-block-variations-size-bk)',
	'--blockera-controls-variations-color-darker-20':
		'var(--blockera-controls-block-variations-size-darker-20)',
};

const GLOBAL_STYLES_STYLE_VARIATION_CSS_VARS: Object = {
	'--blockera-controls-variations-color':
		'var(--blockera-controls-block-variations-style)',
	'--blockera-controls-variations-color-bk':
		'var(--blockera-controls-block-variations-style-bk)',
	'--blockera-controls-variations-color-darker-20':
		'var(--blockera-controls-block-variations-style-darker-20)',
};

/**
 * Variation surface CSS variables for global styles card wrapper.
 *
 * @param {Object} options
 * @param {boolean} options.isGlobalStylesCardWrapper Whether the card is the GS wrapper.
 * @param {string} options.currentBlock Current Blockera block target (`master` or inner block).
 * @param {boolean} [options.isGlobalStylesPanelRoot=false] GS root wrapper (master scope only).
 * @param {string} options.currentState Current master block state id.
 * @param {string} options.variationSurface Active variation surface id.
 * @return {Object|void} Custom properties map.
 */
export const computeBlockeraVariationCssVars = ({
	isGlobalStylesCardWrapper,
	currentBlock = 'master',
	isGlobalStylesPanelRoot = false,
	currentState,
	variationSurface,
}: {
	isGlobalStylesCardWrapper: boolean,
	currentBlock?: string,
	isGlobalStylesPanelRoot?: boolean,
	currentState: string,
	variationSurface?: string,
}): Object | void => {
	const colorContextBlock = isGlobalStylesPanelRoot ? 'master' : currentBlock;

	if (
		!isGlobalStylesCardWrapper ||
		isInnerBlock(colorContextBlock) ||
		!isNormalState(currentState)
	) {
		return undefined;
	}

	if (variationSurface === VARIATION_SURFACE_SIZE) {
		return GLOBAL_STYLES_SIZE_VARIATION_CSS_VARS;
	}

	return GLOBAL_STYLES_STYLE_VARIATION_CSS_VARS;
};

/**
 * Inline style object for StateContainer / inspector roots.
 *
 * @param {string|void} activeColor Active state color.
 * @param {Object|void} variationCssVars Optional variation custom properties.
 * @return {Object} React-compatible style object.
 */
export const getBlockeraActiveColorStyleProperties = (
	activeColor: string | void,
	variationCssVars?: Object
): Object => {
	if (!activeColor) {
		return {};
	}

	return {
		color: 'inherit',
		'--blockera-controls-primary-color': activeColor,
		'--blockera-tab-panel-active-color': activeColor,
		...variationCssVars,
	};
};

/**
 * Applies Blockera active color CSS variables on a DOM node (e.g. core inspector tabs root).
 *
 * @param {HTMLElement|null|undefined} element Target element.
 * @param {string|void} activeColor Active state color.
 * @param {Object|void} variationCssVars Optional variation custom properties.
 */
export const applyBlockeraActiveColorStyle = (
	element: HTMLElement | null | void,
	activeColor: string | void,
	variationCssVars?: Object
): void => {
	if (!element || !activeColor) {
		return;
	}

	element.style.setProperty('--blockera-controls-primary-color', activeColor);
	element.style.setProperty('--blockera-tab-panel-active-color', activeColor);

	if (variationCssVars) {
		Object.keys(variationCssVars).forEach((propertyName) => {
			element.style.setProperty(
				propertyName,
				variationCssVars[propertyName]
			);
		});
	}
};

/**
 * Removes Blockera active color CSS variables from a DOM node.
 *
 * @param {HTMLElement|null|undefined} element Target element.
 */
export const clearBlockeraActiveColorStyle = (
	element: HTMLElement | null | void
): void => {
	if (!element) {
		return;
	}

	BLOCKERA_ACTIVE_COLOR_CSS_PROPERTIES.forEach((propertyName) => {
		element.style.removeProperty(propertyName);
	});
};
