// @flow
/**
 * External dependencies
 */
import type { Node } from 'react';
import { useSelect } from '@wordpress/data';

/**
 * Blockera dependencies
 */
import { FeatureWrapper } from '@blockera/controls';
import { isBoolean, isArray } from '@blockera/utils';

/**
 * Internal dependencies
 */
import type { EditorFeatureWrapperProps } from './types';
import { isBaseBreakpoint } from '../../canvas-editor';
import { isInnerBlock, isNormalState } from '../../extensions/components/utils';

export default function EditorFeatureWrapper({
	config,
	isActive = true,
	children,
	...props
}: EditorFeatureWrapperProps): Node {
	const { blockera, currentBlock, getCurrentState, currentBreakpoint } =
		useSelect((select) => {
			const {
				getExtensionCurrentBlock,
				getExtensionInnerBlockState,
				getExtensionCurrentBlockState,
				getExtensionCurrentBlockStateBreakpoint,
			} = select('blockera/extensions');
			const { getEntity } = select('blockera/data');

			return {
				blockera: getEntity('blockera'),
				getCurrentState: () =>
					isInnerBlock(getExtensionCurrentBlock())
						? getExtensionInnerBlockState()
						: getExtensionCurrentBlockState(),
				currentBlock: getExtensionCurrentBlock(),
				currentBreakpoint: getExtensionCurrentBlockStateBreakpoint(),
			};
		});

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

	const isLocked = /\w+-[orp]+/i.exec(blockera?.locked || '');

	if (!isLocked && !feature.isActiveOnFree) {
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

		if (!isLocked && !feature.isActiveOnInnerBlocksOnFree) {
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

		if (!isLocked && !feature.isActiveOnStatesOnFree) {
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
					typeName={'laptop'}
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
					typeName={'laptop'}
					{...props}
				>
					{children}
				</FeatureWrapper>
			);
		}

		if (!isLocked && !feature.isActiveOnBreakpointsOnFree) {
			return (
				<FeatureWrapper type="free" {...props}>
					{children}
				</FeatureWrapper>
			);
		}
	}

	return <>{children}</>;
}
