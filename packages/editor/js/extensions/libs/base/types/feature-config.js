// @flow

/**
 * Internal dependencies
 */
import type { InnerBlockType } from '../../block-card/inner-blocks/types';

export type FeatureConfig = {
	/**
	 * if true is active, false is deactivated.
	 */
	status: boolean,
	/**
	 * The label to show on extension settings popup.
	 */
	label: string,
	/**
	 * if feature value is set ,so active and show on block extension.
	 */
	show: boolean,
	/**
	 * if value is truthy by default active and show on block extension.
	 */
	force: boolean,
	/**
	 * Configs for sub features.
	 */
	config?: Object,
	/**
	 * Show item in settings popover. Can be used to hide items from settings.
	 */
	showInSettings?: boolean,
	/**
	 * The css generator configuration for current feature.
	 */
	cssGenerators?: Object | {},
	/**
	 * on native blockera settings?
	 */
	onNative?: boolean,
	/**
	 * on blockera block states?
	 */
	onStates?: boolean | Array<string>,
	/**
	 * on native blockera on states?
	 */
	onNativeOnStates?: boolean | Array<string>,
	/**
	 * on blockera breakpoints?
	 */
	onBreakpoints?: boolean | Array<string>,
	/**
	 * on native blockera breakpoints?
	 */
	onNativeOnBreakpoints?: boolean | Array<string>,
	/**
	 * on blockera inner blocks?
	 */
	onInnerBlocks?: boolean | 'all' | Array<InnerBlockType>,
	/**
	 * on native blockera inner blocks?
	 */
	onNativeOnInnerBlocks?: boolean | Array<string>,
};
