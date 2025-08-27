// @flow
/**
 * External dependencies
 */
import type { Element } from 'react';
import { useMemo } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { isInnerBlock, isNormalState } from './utils';
import { useEditorStore, useExtensionsStore } from '../../hooks';

export default function StateContainer({
	children,
	availableStates,
	blockeraUnsavedData,
	insideBlockInspector = true,
}: Object): Element<any> {
	const { currentBlock, currentState, currentInnerBlockState } =
		useExtensionsStore();
	const { getState, getInnerState } = useEditorStore();

	const activeColor = useMemo(() => {
		const selectedState = isInnerBlock(currentBlock)
			? currentInnerBlockState
			: currentState;

		const state = getState(selectedState) || getInnerState(selectedState);
		const fallbackState =
			availableStates && availableStates.hasOwnProperty(selectedState)
				? availableStates[selectedState]
				: blockeraUnsavedData?.states[selectedState];
		let color = state
			? state?.settings?.color
			: fallbackState?.settings?.color;

		if (
			isInnerBlock(currentBlock) &&
			isNormalState(currentInnerBlockState)
		) {
			color = '#cc0000';
		} else if (!insideBlockInspector) {
			color = '#1ca120';
		}

		return color;
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [
		currentBlock,
		currentState,
		availableStates,
		blockeraUnsavedData,
		currentInnerBlockState,
	]);

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
