// @flow

/**
 * External dependencies
 */
import type { MixedElement } from 'react';
import { dispatch, select } from '@wordpress/data';
import { createContext, useContext, useMemo } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { isInnerBlock } from '../components/utils';
import type { THandleOnChangeAttributes } from '../libs/types';
import type {
	TStates,
	TBreakpoint,
	BreakpointTypes,
} from '../libs/block-states/types';

const BlockEditContext: Object = createContext({});

const BlockEditContextProvider = ({
	children,
	...props
}: Object): MixedElement => {
	const {
		setBlockClientInnerState,
		setBlockClientMasterState,
		changeExtensionCurrentBlockState: setCurrentState,
		changeExtensionInnerBlockState: setCurrentInnerBlockState,
	} = dispatch('blockera/extensions') || {};
	const { updatePickedDeviceType, updateDeviceIndicator } =
		select('blockera/editor') || {};

	const memoizedValue: {
		currentTab: string,
		getBlockType: string,
		blockStateId: number,
		breakpointId: number,
		getAttributes: () => Object,
		isNormalState: () => boolean,
		getCurrentState: () => TStates,
		masterIsNormalState: () => boolean,
		getBreakpoint: () => BreakpointTypes,
		setCurrentTab: (tabName: string) => void,
		switchBlockState: (state: string) => void,
		handleOnChangeAttributes: THandleOnChangeAttributes,
	} = useMemo(() => {
		const {
			currentTab,
			getBlockType,
			blockStateId,
			breakpointId,
			getAttributes,
			setCurrentTab,
			isNormalState,
			currentBlock,
			currentState,
			currentBreakpoint,
			currentInnerBlockState,
			masterIsNormalState,
			blockeraInnerBlocks,
			handleOnChangeAttributes,
		} = props;

		return {
			currentTab,
			getBlockType,
			blockStateId,
			breakpointId,
			getAttributes,
			isNormalState,
			masterIsNormalState,
			blockeraInnerBlocks,
			handleOnChangeAttributes,
			switchBlockState: (
				state: TStates,
				breakpoint: TBreakpoint
			): void => {
				updatePickedDeviceType(breakpoint);
				updateDeviceIndicator(breakpoint);

				if (isInnerBlock(currentBlock)) {
					setBlockClientInnerState({
						currentState: state,
						innerBlockType: currentBlock,
						clientId: props?.block?.clientId,
					});
					return setCurrentInnerBlockState(state);
				}

				setBlockClientMasterState({
					currentState: state,
					name: props?.block?.blockName,
					clientId: props?.block?.clientId,
				});

				setCurrentState(state);
			},
			setCurrentTab: (tabName: string): void => {
				if (tabName === currentTab) {
					return;
				}

				setCurrentTab(tabName);
			},
			getBreakpoint(): BreakpointTypes {
				return currentBreakpoint;
			},
			getCurrentState(): TStates {
				if (isInnerBlock(currentBlock)) {
					return currentInnerBlockState;
				}

				return currentState;
			},
			...props,
		};
		// eslint-disable-next-line
	}, [props]);

	return (
		<BlockEditContext.Provider value={memoizedValue}>
			{children}
		</BlockEditContext.Provider>
	);
};

const useBlockContext = (): Object => {
	return useContext(BlockEditContext);
};

export { BlockEditContext, useBlockContext, BlockEditContextProvider };
