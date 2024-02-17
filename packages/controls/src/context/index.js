// @flow

/**
 * External dependencies
 */
import type { MixedElement } from 'react';
import { useDispatch, useSelect } from '@wordpress/data';
import { createContext, useEffect } from '@wordpress/element';

/**
 * Publisher dependencies
 */
import { isEquals } from '@publisher/utils';

/**
 * Internal dependencies
 */
import { STORE_NAME } from '../store';
import { registerControl } from '../api';
import type { ControlContextProviderProps } from './types';

export const ControlContext: Object = createContext({
	controlInfo: {
		name: null,
		value: null,
		attribute: null,
		blockName: null,
		description: null,
		hasSideEffect: false,
	},
	value: null,
	dispatch: null,
});

export const ControlContextProvider = ({
	value: controlInfo,
	children,
	storeName = STORE_NAME,
	...props
}: ControlContextProviderProps): MixedElement | null => {
	// $FlowFixMe
	registerControl({
		...controlInfo,
		type: storeName,
	});

	//Prepare control status and value!
	const { status, value } = useSelect(
		(select) => {
			const { getControl } = select(storeName);

			return getControl(controlInfo.name);
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[controlInfo]
	);
	//control dispatch for available actions
	const dispatch = useDispatch(storeName);

	const { modifyControlValue } = dispatch;

	const { currentBlock, currentState, currentInnerBlockState } = useSelect(
		(select) => {
			const {
				getExtensionCurrentBlock,
				getExtensionInnerBlockState,
				getExtensionCurrentBlockState,
			} = select('publisher-core/extensions');

			return {
				currentBlock: getExtensionCurrentBlock(),
				currentState: getExtensionCurrentBlockState(),
				currentInnerBlockState: getExtensionInnerBlockState(),
			};
		}
	);

	const { value: currentValue, name: controlId } = controlInfo;

	// Assume recieved control value from outside isn't equals with current value.
	// exclude control with has side effect because modified control value inside callback of that. so prevent re-rendering with this way!
	useEffect(() => {
		if (!isEquals(currentValue, value) && !controlInfo.hasSideEffect) {
			modifyControlValue({
				controlId,
				value: currentValue,
			});
		}
		// eslint-disable-next-line
	}, [currentValue]);

	// Assume ControlContextProvider has side effect.
	// side effect: when changes currentBlock, currentState, and currentInnerBlockState it should fire useEffect callback
	// use cases for example: on StatesManager component when changed one of (currentBlock, currentState, and currentInnerBlockState),
	// because needs to update selected state to show that on UI.
	useEffect(() => {
		if (
			controlInfo.hasSideEffect &&
			'undefined' !== typeof controlInfo?.callback
		) {
			controlInfo.callback(controlInfo, value, modifyControlValue);
		}
		// eslint-disable-next-line
	}, [currentBlock, currentState, currentInnerBlockState, currentValue]);

	//You can to enable||disable current control with status column!
	if (!status) {
		return null;
	}

	return (
		<ControlContext.Provider
			{...props}
			value={{ controlInfo, value, dispatch }}
		>
			{children}
		</ControlContext.Provider>
	);
};

export { useControlContext, useControlEffect } from './hooks';
