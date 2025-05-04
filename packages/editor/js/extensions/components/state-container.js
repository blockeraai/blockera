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
	const state = getState(currentState);
	const fallbackState =
		availableStates && availableStates.hasOwnProperty(currentState)
			? availableStates[currentState]
			: blockeraUnsavedData?.states[currentState];
	let activeColor = state ? state?.color : fallbackState?.color;

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
