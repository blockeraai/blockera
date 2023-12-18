// @flow

/**
 * External dependencies
 */
import type { MixedElement } from 'react';
import {
	createContext,
	useContext,
	useMemo,
	useState,
} from '@wordpress/element';

/**
 * Internal dependencies
 */
import type { BreakpointTypes, TStates } from '../libs/block-states/types';

const BlockEditContext: Object = createContext({});

const BlockEditContextProvider = ({
	children,
	...props
}: Object): MixedElement => {
	const [currentTab, setCurrentTab] = useState('general');
	const memoizedValue: {
		currentTab: string,
		getBlockType: string,
		blockStateId: number,
		breakpointId: number,
		getAttributes: () => Object,
		isNormalState: () => boolean,
		getCurrentState: () => TStates,
		getBreakpoint: () => BreakpointTypes,
		setCurrentTab: (tabName: string) => void,
	} = useMemo(() => {
		const {
			getBlockType,
			blockStateId,
			breakpointId,
			getAttributes,
			isNormalState,
		} = props;

		return {
			currentTab,
			getBlockType,
			blockStateId,
			breakpointId,
			getAttributes,
			isNormalState,
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
				return getAttributes()?.publisherCurrentState;
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
