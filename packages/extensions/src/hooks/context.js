// @flow

/**
 * External dependencies
 */
import type { MixedElement } from 'react';
import { dispatch } from '@wordpress/data';
import { createContext, useContext, useMemo } from '@wordpress/element';

/**
 * Publisher dependencies
 */
import { isFunction } from '@publisher/utils';

/**
 * Internal dependencies
 */
import { generateExtensionId } from '../libs';
import type { THandleOnChangeAttributes } from '../libs/types';
import type { BreakpointTypes, TStates } from '../libs/block-states/types';

const BlockEditContext: Object = createContext({});

const BlockEditContextProvider = ({
	children,
	...props
}: Object): MixedElement => {
	const memoizedValue: {
		currentTab: string,
		getBlockType: string,
		blockStateId: number,
		breakpointId: number,
		isOpenGridBuilder: boolean,
		getAttributes: () => Object,
		isNormalState: () => boolean,
		getCurrentState: () => TStates,
		getBreakpoint: () => BreakpointTypes,
		setCurrentTab: (tabName: string) => void,
		switchBlockState: (state: string) => void,
		setOpenGridBuilder: (isOpen: boolean) => void,
		handleOnChangeAttributes: THandleOnChangeAttributes,
	} = useMemo(() => {
		const {
			block,
			currentTab,
			getBlockType,
			blockStateId,
			breakpointId,
			getAttributes,
			setCurrentTab,
			isNormalState,
			isOpenGridBuilder,
			setOpenGridBuilder,
			handleOnChangeAttributes,
		} = props;

		return {
			currentTab,
			getBlockType,
			blockStateId,
			breakpointId,
			getAttributes,
			isNormalState,
			handleOnChangeAttributes,
			switchBlockState: (state: string) => {
				const newValue = getAttributes().publisherBlockStates.map(
					(s: Object) => {
						if (state === s?.type) {
							return {
								...s,
								isSelected: true,
							};
						}

						return {
							...s,
							isSelected: false,
						};
					}
				);

				handleOnChangeAttributes('publisherBlockStates', newValue, {
					addOrModifyRootItems: {
						publisherCurrentState: state,
					},
				});

				const { modifyControlValue } = dispatch(
					'publisher-core/controls/repeater'
				);

				if (!isFunction(modifyControlValue)) {
					return;
				}

				const controlId = generateExtensionId(block, 'block-states');

				modifyControlValue({
					controlId,
					value: newValue,
				});
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
				return getAttributes()?.publisherCurrentState;
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
