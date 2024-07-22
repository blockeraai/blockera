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

/**
 * Internal dependencies
 */
import { useBlocksStore } from '../../hooks';
import type { BlockStyleProps } from './types';
import {
	// MediaQuery,
	StateStyle,
} from '../';
import { getExtensionConfig } from '../../extensions';

export const BlockStyle = (props: BlockStyleProps): MixedElement => {
	const {
		config,
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
		} = select('blockera/extensions');

		return {
			config: getExtensionConfig(
				props.blockName,
				getExtensionCurrentBlock()
			),
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
					config,
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
