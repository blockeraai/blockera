// @flow

/**
 * External dependencies
 */
import type { MixedElement } from 'react';

/**
 * Internal dependencies
 */
import type { BlockStyleProps } from './types';
import {
	// MediaQuery,
	StateStyle,
} from '../';
import { useExtensionsStore } from '../../hooks/use-extensions-store';

export const BlockStyle = (props: BlockStyleProps): MixedElement => {
	const {
		config,
		currentBlock,
		currentState,
		currentBreakpoint,
		currentInnerBlockState,
	} = useExtensionsStore({
		name: props.blockName,
		clientId: props.clientId,
	});

	// We should not generate styles for no blockera blocks.
	if (!props?.attributes?.blockeraPropsId) {
		return <></>;
	}

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
