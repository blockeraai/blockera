// @flow

/**
 * External dependencies
 */
import type { MixedElement } from 'react';
import { useSelect } from '@wordpress/data';

/**
 * Internal dependencies
 */
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

	return (
		<style>
			{/*<MediaQuery breakpoint={currentBreakpoint}>*/}
			<StateStyle
				{...{
					...props,
					config,
					currentState,
					currentBlock,
					currentBreakpoint,
					currentInnerBlockState,
					styleEngineConfig: props.supports?.blockeraStyleEngine,
				}}
			/>
			{/*</MediaQuery>*/}
		</style>
	);
};
