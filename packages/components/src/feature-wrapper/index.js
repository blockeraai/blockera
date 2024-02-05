// @flow
/**
 * External dependencies
 */
import type { Node } from 'react';

/**
 * Publisher dependencies
 */
import { useBlockContext } from '@publisher/extensions/src/hooks';

/**
 * Internal dependencies
 */
import type { FeatureWrapperProps } from './types';
import { Wrapper } from './components/wrapper';

export default function FeatureWrapper({
	isActive = true,
	isActiveOnFree = true,
	isActiveOnFreeText = '',
	isActiveOnStates = 'all',
	isActiveOnStatesText = '',
	isActiveOnBreakpoints = 'all',
	isActiveOnBreakpointsText = '',
	children,
	...props
}: FeatureWrapperProps): Node {
	const { getCurrentState, getBreakpoint } = useBlockContext();

	if (!isActive) {
		return <></>;
	}

	// todo add free version detection
	const isFree = true;

	if (isFree && !isActiveOnFree) {
		return (
			<Wrapper type="free" text={isActiveOnFreeText} {...props}>
				{children}
			</Wrapper>
		);
	}

	if (
		isActiveOnStates !== 'all' &&
		!isActiveOnStates.includes(getCurrentState())
	) {
		return (
			<Wrapper
				type="state"
				typeName={
					isActiveOnStates.length === 1 ? isActiveOnStates[0] : ''
				}
				text={isActiveOnStatesText}
				{...props}
			>
				{children}
			</Wrapper>
		);
	}

	if (
		isActiveOnBreakpoints !== 'all' &&
		!isActiveOnBreakpoints.includes(getBreakpoint()?.type)
	) {
		return (
			<Wrapper
				type="breakpoint"
				typeName={
					isActiveOnBreakpoints.length === 1
						? isActiveOnBreakpoints[0]
						: ''
				}
				text={isActiveOnBreakpointsText}
				{...props}
			>
				{children}
			</Wrapper>
		);
	}

	return <>{children}</>;
}
