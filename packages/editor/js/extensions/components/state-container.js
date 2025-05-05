// @flow
/**
 * External dependencies
 */
import type { Element } from 'react';

/**
 * Internal dependencies
 */
import { isInnerBlock, isNormalState } from './utils';
import { useEditorStore, useExtensionsStore } from '../../hooks';

export default function StateContainer({
	children,
	availableStates,
	blockeraUnsavedData,
}: Object): Element<any> {
	const { currentBlock, currentState, currentInnerBlockState } =
		useExtensionsStore();
	const { getState } = useEditorStore();

	const selectedState = isInnerBlock(currentBlock)
		? currentInnerBlockState
		: currentState;

	const state = getState(selectedState);
	const fallbackState =
		availableStates && availableStates.hasOwnProperty(selectedState)
			? availableStates[selectedState]
			: blockeraUnsavedData?.states[selectedState];
	let activeColor = state
		? state?.settings?.color
		: fallbackState?.settings?.color;

	if (isInnerBlock(currentBlock) && isNormalState(currentInnerBlockState)) {
		activeColor = '#cc0000';
	}

	return (
		<div
			className="blockera-state-colors-container"
			style={{
				color: 'inherit',
				'--blockera-controls-primary-color': activeColor,
				'--blockera-tab-panel-active-color': activeColor,
			}}
		>
			{children}
		</div>
	);
}
