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
import {
	useExtensionsStore,
	getExtensionConfig,
} from '../../hooks/use-extensions-store';

export const BlockStyle = ({
	customCss,
	isGlobalStylesWrapper = false,
	...props
}: BlockStyleProps): MixedElement => {
	const {
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

	const config = getExtensionConfig(props.blockName, currentBlock);

	return (
		<>
			{'undefined' !== typeof customCss &&
			/#block*(?:-.*)\n\s+\}/gm.test(customCss) ? (
				''
			) : (
				<style id={props.clientId}>{customCss}</style>
			)}
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
