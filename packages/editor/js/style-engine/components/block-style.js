// @flow

/**
 * External dependencies
 */
import type { MixedElement } from 'react';
import { useSelect } from '@wordpress/data';

/**
 * Blockera dependencies
 */
import { isFunction } from '@blockera/utils';
import { useBlocksStore } from '@blockera/editor';

/**
 * Internal dependencies
 */
import type { BlockStyleProps } from './types';
import {
	// MediaQuery,
	StateStyle,
} from '../';

export const BlockStyle = (props: BlockStyleProps): MixedElement => {
	const {
		currentBlock,
		currentState,
		currentBreakpoint,
		currentInnerBlockState,
	} = useSelect((select) => {
		const {
			getExtensionCurrentBlock,
			getExtensionInnerBlockState,
			getExtensionCurrentBlockState,
			getExtensionCurrentBlockStateBreakpoint,
		} = select('blockera-core/extensions');

		return {
			currentBlock: getExtensionCurrentBlock(),
			currentState: getExtensionCurrentBlockState(),
			currentInnerBlockState: getExtensionInnerBlockState(),
			currentBreakpoint: getExtensionCurrentBlockStateBreakpoint(),
		};
	});

	const { getBlockType } = useBlocksStore();
	let selectors = {};

	if (isFunction(getBlockType)) {
		const { selectors: blockSelectors } = getBlockType(props.blockName);
		selectors = blockSelectors;
	}

	return (
		<style>
			{/*<MediaQuery breakpoint={currentBreakpoint}>*/}
			<StateStyle
				{...{
					...props,
					selectors,
					currentState,
					currentBlock,
					currentBreakpoint,
					currentInnerBlockState,
				}}
			/>
			{/*</MediaQuery>*/}
		</style>
	);
};
