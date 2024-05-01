// @flow
/**
 * External dependencies
 */
import type { Node } from 'react';

/**
 * Blockera dependencies
 */
import { useBlockContext } from '@blockera/editor-extensions/js/hooks/context';

/**
 * Internal dependencies
 */
import type { FeatureWrapperProps } from './types';
import { Wrapper } from './components/wrapper';

export default function FeatureWrapper({
	config,
	isActive = true,
	children,
	...props
}: FeatureWrapperProps): Node {
	const { getCurrentState, getBreakpoint } = useBlockContext();

	const feature = {
		isActiveOnFree: true,
		isActiveOnStates: 'all',
		isActiveOnBreakpoints: 'all',
		isActiveOnInnerBlocks: true,
		isActiveOnInnerBlockOnFree: true,
		...config,
	};

	if (!isActive) {
		return <></>;
	}

	// todo add free version detection
	const isFree = true;

	if (isFree && !feature.isActiveOnFree) {
		return (
			<Wrapper type="free" {...props}>
				{children}
			</Wrapper>
		);
	}

	if (
		feature.isActiveOnStates !== 'all' &&
		!feature.isActiveOnStates.includes(getCurrentState())
	) {
		return (
			<Wrapper
				type="state"
				typeName={
					feature.isActiveOnStates.length === 1
						? feature.isActiveOnStates[0]
						: ''
				}
				{...props}
			>
				{children}
			</Wrapper>
		);
	}

	if (
		feature.isActiveOnBreakpoints !== 'all' &&
		!feature.isActiveOnBreakpoints.includes(getBreakpoint()?.type)
	) {
		return (
			<Wrapper
				type="breakpoint"
				typeName={
					feature.isActiveOnBreakpoints.length === 1
						? feature.isActiveOnBreakpoints[0]
						: ''
				}
				{...props}
			>
				{children}
			</Wrapper>
		);
	}

	return <>{children}</>;
}
