// @flow

/**
 * External dependencies
 */
import type { MixedElement } from 'react';
import { useSelect } from '@wordpress/data';

/**
 * Publisher dependencies
 */
import { isFunction } from '@publisher/utils';
import { useBlocksStore } from '@publisher/extensions/src/hooks';

/**
 * Internal dependencies
 */
import type { BlockStyleProps } from './types';
import { MediaQuery, InnerBlockStyle, StateStyle } from '../';

export const BlockStyle = (props: BlockStyleProps): MixedElement => {
	const {
		// currentBlock,
		currentState,
		// currentInnerBlockState,
		currentBreakpoint,
	} = useSelect((select) => {
		const {
			getExtensionCurrentBlock,
			getExtensionInnerBlockState,
			getExtensionCurrentBlockState,
			getExtensionCurrentBlockStateBreakpoint,
		} = select('publisher-core/extensions');

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
			<MediaQuery breakpoint={currentBreakpoint}>
				<StateStyle
					{...{
						...props,
						selectors,
						currentState,
						currentBreakpoint,
						currentBlock: 'master',
					}}
				/>
				<InnerBlockStyle
					{...{
						...props,
						currentState,
						currentBreakpoint,
					}}
				/>
			</MediaQuery>
		</style>
	);
};
