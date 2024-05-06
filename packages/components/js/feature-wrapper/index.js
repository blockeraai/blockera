// @flow
/**
 * External dependencies
 */
import type { Node } from 'react';
import { useSelect } from '@wordpress/data';

/**
 * Blockera dependencies
 */
import { isLaptopBreakpoint } from '@blockera/editor';
import {
	isInnerBlock,
	isNormalState,
} from '@blockera/editor-extensions/js/components/utils';

/**
 * Internal dependencies
 */
import { Wrapper } from './components/wrapper';
import type { FeatureWrapperProps } from './types';

export default function FeatureWrapper({
	config,
	isActive = true,
	children,
	...props
}: FeatureWrapperProps): Node {
	const { blockera, currentBlock, getCurrentState, currentBreakpoint } =
		useSelect((select) => {
			const {
				getExtensionCurrentBlock,
				getExtensionInnerBlockState,
				getExtensionCurrentBlockState,
				getExtensionCurrentBlockStateBreakpoint,
			} = select('blockera-core/extensions');
			const { getEntity } = select('blockera-core/data');

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
		isActiveOnStatesOnFree: false,
		isActiveOnBreakpoints: true,
		isActiveOnBreakpointsOnFree: false,
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
			<Wrapper type="free" {...props}>
				{children}
			</Wrapper>
		);
	}

	if (
		isInnerBlock(currentBlock) &&
		feature.isActiveOnInnerBlocks &&
		!feature.isActiveOnInnerBlocksOnFree
	) {
		return (
			<Wrapper type="inner-block" typeName={'Parent!'} {...props}>
				{children}
			</Wrapper>
		);
	}

	if (
		!isNormalState(getCurrentState()) &&
		feature.isActiveOnStates &&
		!feature.isActiveOnStatesOnFree
	) {
		return (
			<Wrapper type="state" typeName={'Normal!'} {...props}>
				{children}
			</Wrapper>
		);
	}

	if (
		!isLaptopBreakpoint(currentBreakpoint) &&
		feature.isActiveOnBreakpoints &&
		!feature.isActiveOnBreakpointsOnFree
	) {
		return (
			<Wrapper type="breakpoint" typeName={'Laptop!'} {...props}>
				{children}
			</Wrapper>
		);
	}

	return <>{children}</>;
}
