// @flow
/**
 * External dependencies
 */
import type { Node } from 'react';

/**
 * Blockera dependencies
 */
import { FeatureWrapper } from '@blockera/controls';
import { isBoolean, isArray } from '@blockera/utils';

/**
 * Internal dependencies
 */
import type { EditorFeatureWrapperProps } from './types';
import { useExtensionsStore } from '../../hooks/use-extensions-store';
import type { TStates } from '../../extensions/libs/block-states/types';
import { getBaseBreakpoint, isBaseBreakpoint } from '../../canvas-editor';
import { isInnerBlock, isNormalState } from '../../extensions/components/utils';

export default function EditorFeatureWrapper({
	config,
	isActive = true,
	children,
	...props
}: EditorFeatureWrapperProps): Node {
	const {
		currentBlock,
		currentState,
		currentBreakpoint,
		currentInnerBlockState,
	} = useExtensionsStore();

	const {
		blockeraFeatureManager_1_0_0: { EditorFeatureWrapper: Wrapper },
	} = window;

	if (Wrapper) {
		return (
			<Wrapper
				{...{
					config,
					isActive,
					children,
					...props,
				}}
			/>
		);
	}

	const getCurrentState = (): TStates =>
		isInnerBlock(currentBlock) ? currentInnerBlockState : currentState;

	const feature = {
		isActiveOnFree: true,
		isActiveOnStates: true,
		isActiveOnStatesOnFree: true,
		isActiveOnBreakpoints: true,
		isActiveOnBreakpointsOnFree: true,
		isActiveOnInnerBlocks: true,
		isActiveOnInnerBlocksOnFree: false,
		...config,
	};

	if (!isActive) {
		return <></>;
	}

	if (!feature.isActiveOnFree) {
		return (
			<FeatureWrapper type="free" {...props}>
				{children}
			</FeatureWrapper>
		);
	}

	if (isInnerBlock(currentBlock)) {
		if (
			isBoolean(feature.isActiveOnInnerBlocks) &&
			!feature.isActiveOnInnerBlocks
		) {
			return (
				<FeatureWrapper type="inner-block" {...props}>
					{children}
				</FeatureWrapper>
			);
		} else if (
			isArray(feature.isActiveOnInnerBlocks) &&
			//$FlowFixMe
			!feature.isActiveOnInnerBlocks.includes(currentBlock)
		) {
			return (
				<FeatureWrapper type="inner-block" {...props}>
					{children}
				</FeatureWrapper>
			);
		}

		if (!feature.isActiveOnInnerBlocksOnFree) {
			return (
				<FeatureWrapper type="free" {...props}>
					{children}
				</FeatureWrapper>
			);
		}
	}

	if (!isNormalState(getCurrentState())) {
		if (isBoolean(feature.isActiveOnStates) && !feature.isActiveOnStates) {
			return (
				<FeatureWrapper type="state" typeName={'normal'} {...props}>
					{children}
				</FeatureWrapper>
			);
		} else if (
			isArray(feature.isActiveOnStates) &&
			//$FlowFixMe
			!feature.isActiveOnStates.includes(getCurrentState())
		) {
			return (
				<FeatureWrapper type="state" typeName={'normal'} {...props}>
					{children}
				</FeatureWrapper>
			);
		}

		if (!feature.isActiveOnStatesOnFree) {
			return (
				<FeatureWrapper type="free" {...props}>
					{children}
				</FeatureWrapper>
			);
		}
	}

	if (!isBaseBreakpoint(currentBreakpoint)) {
		if (
			isBoolean(feature.isActiveOnBreakpoints) &&
			!feature.isActiveOnBreakpoints
		) {
			return (
				<FeatureWrapper
					type="breakpoint"
					typeName={getBaseBreakpoint()}
					{...props}
				>
					{children}
				</FeatureWrapper>
			);
		} else if (
			isArray(feature.isActiveOnBreakpoints) &&
			//$FlowFixMe
			!feature.isActiveOnBreakpoints.includes(currentBreakpoint)
		) {
			return (
				<FeatureWrapper
					type="breakpoint"
					typeName={getBaseBreakpoint()}
					{...props}
				>
					{children}
				</FeatureWrapper>
			);
		}

		if (!feature.isActiveOnBreakpointsOnFree) {
			return (
				<FeatureWrapper type="free" {...props}>
					{children}
				</FeatureWrapper>
			);
		}
	}

	return <>{children}</>;
}
