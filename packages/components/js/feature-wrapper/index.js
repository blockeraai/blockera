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
			<Wrapper type="free" {...props}>
				{children}
			</Wrapper>
		);
	}

	if (isInnerBlock(currentBlock)) {
		if (!feature.isActiveOnInnerBlocks) {
			return (
				<Wrapper type="inner-block" {...props}>
					{children}
				</Wrapper>
			);
		}

		if (!isLocked && !feature.isActiveOnInnerBlocksOnFree) {
			return (
				<Wrapper type="free" {...props}>
					{children}
				</Wrapper>
			);
		}
	}

	if (!isNormalState(getCurrentState())) {
		if (!feature.isActiveOnStates) {
			return (
				<Wrapper type="state" typeName={'normal'} {...props}>
					{children}
				</Wrapper>
			);
		}

		if (!isLocked && !feature.isActiveOnStatesOnFree) {
			return (
				<Wrapper type="free" {...props}>
					{children}
				</Wrapper>
			);
		}
	}

	if (!isLaptopBreakpoint(currentBreakpoint)) {
		if (!feature.isActiveOnBreakpoints) {
			return (
				<Wrapper type="breakpoint" typeName={'laptop'} {...props}>
					{children}
				</Wrapper>
			);
		}

		if (!isLocked && !feature.isActiveOnBreakpointsOnFree) {
			return (
				<Wrapper type="free" {...props}>
					{children}
				</Wrapper>
			);
		}
	}

	return <>{children}</>;
}
