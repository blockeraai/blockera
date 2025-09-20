// @flow

/**
 * External dependencies
 */
import type { MixedElement } from 'react';

/**
 * Internal dependencies
 */
import type { BlockStyleProps } from './types';
import { StateStyle } from '../';
import { useExtensionsStore } from '../../hooks/use-extensions-store';

export const BlockStyle = ({
	customCss,
	isGlobalStylesWrapper = false,
	...props
}: BlockStyleProps): MixedElement => {
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
		<>
			{/#block*(?:-.*)\n\s+\}/gm.test(customCss) ? '' : <>{customCss}</>}
			<StateStyle
				{...{
					...props,
					config,
					currentState,
					currentBlock,
					currentBreakpoint,
					isGlobalStylesWrapper,
					currentInnerBlockState,
					styleEngineConfig: props.supports?.blockeraStyleEngine,
				}}
			/>
		</>
	);
};
