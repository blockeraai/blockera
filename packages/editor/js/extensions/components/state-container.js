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
import { VARIATION_SURFACE_SIZE } from '../../editor/global-styles/panel/variation-surfaces';

export const Container = ({
	activeColor,
	variationCssVars,
	children,
}: {
	activeColor: string,
	variationCssVars?: Object,
	children: Element<any>,
}): Element<any> => {
	return (
		<div
			className="blockera-state-colors-container"
			style={{
				color: 'inherit',
				'--blockera-controls-primary-color': activeColor,
				'--blockera-tab-panel-active-color': activeColor,
				...variationCssVars,
			}}
		>
			{children}
		</div>
	);
};

export default function StateContainer({
	name,
	clientId,
	children,
	availableStates,
	isGlobalStylesPanelRoot = false,
	blockeraUnsavedData,
	isGlobalStylesCardWrapper = false,
	insideBlockInspector = true,
	variationSurface,
}: Object): Element<any> {
	const { currentBlock, currentState, currentInnerBlockState } =
		useExtensionsStore({ name, clientId });
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
			!isGlobalStylesPanelRoot &&
			isInnerBlock(currentBlock) &&
			isNormalState(currentInnerBlockState)
		) {
			color = '#cc0000';
		} else if (
			(!insideBlockInspector || isGlobalStylesCardWrapper) &&
			isNormalState(currentState)
		) {
			color =
				variationSurface === VARIATION_SURFACE_SIZE
					? '#0516FF'
					: '#1ca120';
		}

		return color;
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [
		currentBlock,
		currentState,
		availableStates,
		blockeraUnsavedData,
		insideBlockInspector,
		currentInnerBlockState,
		variationSurface,
	]);

	const variationCssVars = useMemo(() => {
		if (!isGlobalStylesCardWrapper || !isNormalState(currentState)) {
			return undefined;
		}

		if (variationSurface === VARIATION_SURFACE_SIZE) {
			return {
				'--blockera-controls-variations-color': '#0516FF',
				'--blockera-controls-variations-color-bk': '#0414cc',
				'--blockera-controls-variations-color-darker-20':
					'color-mix(in srgb, #0414cc 100%, #000000 5%)',
			};
		}

		return {
			'--blockera-controls-variations-color': '#1ca120',
			'--blockera-controls-variations-color-bk': 'hsl(122, 70%, 37%)',
			'--blockera-controls-variations-color-darker-20':
				'color-mix(in srgb, hsl(122, 70%, 37%) 100%, #000000 5%)',
		};
	}, [isGlobalStylesCardWrapper, currentState, variationSurface]);

	return (
		<Container
			activeColor={activeColor}
			variationCssVars={variationCssVars}
		>
			{children}
		</Container>
	);
}
