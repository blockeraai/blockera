// @flow

/**
 * External dependencies
 */
import type { MixedElement } from 'react';
import { dispatch } from '@wordpress/data';
import { createContext, useContext, useMemo } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { isInnerBlock } from '../components/utils';
import type { THandleOnChangeAttributes } from '../libs/types';
import type { BreakpointTypes, TStates } from '../libs/block-states/types';

const BlockEditContext: Object = createContext({});

const BlockEditContextProvider = ({
	children,
	...props
}: Object): MixedElement => {
	const {
		changeExtensionCurrentBlockState: setCurrentState,
		changeExtensionInnerBlockState: setCurrentInnerBlockState,
	} = dispatch('publisher-core/extensions') || {};

	const memoizedValue: {
		currentTab: string,
		getBlockType: string,
		blockStateId: number,
		breakpointId: number,
		isOpenGridBuilder: boolean,
		getAttributes: () => Object,
		isNormalState: () => boolean,
		getCurrentState: () => TStates,
		masterIsNormalState: () => boolean,
		getBreakpoint: () => BreakpointTypes,
		setCurrentTab: (tabName: string) => void,
		switchBlockState: (state: string) => void,
		setOpenGridBuilder: (isOpen: boolean) => void,
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
			currentInnerBlockState,
			isOpenGridBuilder,
			setOpenGridBuilder,
			masterIsNormalState,
			publisherInnerBlocks,
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
			publisherInnerBlocks,
			handleOnChangeAttributes,
			switchBlockState: (state: TStates): void => {
				if (isInnerBlock(currentBlock)) {
					return setCurrentInnerBlockState(state);
				}

				setCurrentState(state);
			},
			setCurrentTab: (tabName: string): void => {
				if (tabName === currentTab) {
					return;
				}

				setCurrentTab(tabName);
			},
			getBreakpoint(): BreakpointTypes {
				return getAttributes()?.publisherBlockStates[blockStateId]
					?.breakpoints[breakpointId];
			},
			getCurrentState(): TStates {
				if (isInnerBlock(currentBlock)) {
					return currentInnerBlockState;
				}

				return currentState;
			},
			isOpenGridBuilder,
			setOpenGridBuilder,
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
