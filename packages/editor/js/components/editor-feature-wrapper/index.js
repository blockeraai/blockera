// @flow
/**
 * External dependencies
 */
import type { Node } from 'react';
import { applyFilters } from '@wordpress/hooks';

/**
 * Blockera dependencies
 */
import { FeatureWrapper } from '@blockera/controls';
import { isBoolean, isArray } from '@blockera/utils';

/**
 * Internal dependencies
 */
import type { EditorFeatureWrapperProps } from './types';
import { useExtensionsStore, useEditorStore } from '../../hooks';
import { getBaseBreakpoint, isBaseBreakpoint } from '../../canvas-editor';
import { isInnerBlock, isNormalState } from '../../extensions/components/utils';
import type { TStates } from '../../extensions/libs/block-card/block-states/types';

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
	const { availableStates, availableBreakpoints, availableInnerStates } =
		useEditorStore(
			applyFilters(
				'blockera.editor.components.editorFeatureWrapper.editorStoreParams',
				{}
			)
		);

	if (window?.blockeraFeatureManager_1_0_0?.EditorFeatureWrapper) {
		const WrapperComponent =
			window.blockeraFeatureManager_1_0_0.EditorFeatureWrapper;

		return (
			<WrapperComponent
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
		onStates: true,
		onNative: false,
		onBreakpoints: true,
		onInnerBlocks: true,
		onNativeOnInnerBlocks: true,
		onNativeOnBreakpoints: availableBreakpoints,
		onNativeOnStates: availableStates.concat(availableInnerStates),
		...config,
	};

	if (!isActive) {
		return <></>;
	}

	if (feature.onNative) {
		return (
			<FeatureWrapper type="native" {...props}>
				{children}
			</FeatureWrapper>
		);
	}

	if (isInnerBlock(currentBlock)) {
		if (isBoolean(feature.onInnerBlocks) && !feature.onInnerBlocks) {
			return (
				<FeatureWrapper type="inner-block" {...props}>
					{children}
				</FeatureWrapper>
			);
		} else if (
			isArray(feature.onInnerBlocks) &&
			//$FlowFixMe
			!feature.onInnerBlocks.includes(currentBlock)
		) {
			return (
				<FeatureWrapper type="inner-block" {...props}>
					{children}
				</FeatureWrapper>
			);
		}

		if (
			isBoolean(feature.onNativeOnInnerBlocks) &&
			feature.onNativeOnInnerBlocks
		) {
			return (
				<FeatureWrapper type="native" {...props}>
					{children}
				</FeatureWrapper>
			);
		} else if (
			isArray(feature.onNativeOnInnerBlocks) &&
			//$FlowFixMe
			!feature.onNativeOnInnerBlocks.includes(currentBlock)
		) {
			return (
				<FeatureWrapper type="native" {...props}>
					{children}
				</FeatureWrapper>
			);
		}
	}

	if (!isNormalState(getCurrentState())) {
		if (isBoolean(feature.onStates) && !feature.onStates) {
			return (
				<FeatureWrapper type="state" typeName={'normal'} {...props}>
					{children}
				</FeatureWrapper>
			);
		} else if (
			isArray(feature.onStates) &&
			//$FlowFixMe
			!feature.onStates.includes(getCurrentState())
		) {
			return (
				<FeatureWrapper
					type="state"
					typeName={availableStates.join(', ')}
					{...props}
				>
					{children}
				</FeatureWrapper>
			);
		}

		if (isBoolean(feature.onNativeOnStates) && feature.onNativeOnStates) {
			return (
				<FeatureWrapper type="native" {...props}>
					{children}
				</FeatureWrapper>
			);
		} else if (
			isArray(feature.onNativeOnStates) &&
			//$FlowFixMe
			!feature.onNativeOnStates.includes(getCurrentState())
		) {
			return (
				<FeatureWrapper type="native" {...props}>
					{children}
				</FeatureWrapper>
			);
		}
	}

	if (!isBaseBreakpoint(currentBreakpoint)) {
		if (isBoolean(feature.onBreakpoints) && !feature.onBreakpoints) {
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
			isArray(feature.onBreakpoints) &&
			//$FlowFixMe
			!feature.onBreakpoints.includes(currentBreakpoint)
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

		if (
			isBoolean(feature.onNativeOnBreakpoints) &&
			feature.onNativeOnBreakpoints
		) {
			return (
				<FeatureWrapper type="native" {...props}>
					{children}
				</FeatureWrapper>
			);
		} else if (
			isArray(feature.onNativeOnBreakpoints) &&
			//$FlowFixMe
			!feature.onNativeOnBreakpoints.includes(currentBreakpoint)
		) {
			return (
				<FeatureWrapper type="native" {...props}>
					{children}
				</FeatureWrapper>
			);
		}
	}

	return <>{children}</>;
}
