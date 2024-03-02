// @flow

/**
 * External dependencies
 */
import type { MixedElement } from 'react';
import { useDispatch, useSelect } from '@wordpress/data';
import { createContext, useEffect } from '@wordpress/element';

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
		onChange: null,
		attribute: null,
		blockName: null,
		description: null,
		valueCleanup: null,
		hasSideEffect: null,
		callback: () => {},
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

	const {
		callback,
		// onChange,
		// valueCleanup,
		hasSideEffect,
		value: currentValue,
	} = controlInfo;

	// Assume ControlContextProvider has side effect.
	// side effect: when changes currentBlock, currentState, and currentInnerBlockState it should fire useEffect callback
	// use cases for example: on StatesManager component when changed one of (currentBlock, currentState, and currentInnerBlockState),
	// because needs to update selected state to show that on UI.
	useEffect(() => {
		if (hasSideEffect && 'function' === typeof callback) {
			callback(controlInfo, value, modifyControlValue);
		}
		// eslint-disable-next-line
	}, [currentBlock, currentState, currentInnerBlockState, currentValue]);

	// FIXME: implements valueCleanup when unmounting control context provider!
	// useEffect(() => {
	// 	// Cleanup value when unmounting control ...
	// 	return () => {
	// 		if (isFunction(valueCleanup) && hasSideEffect) {
	// 			console.log(valueCleanup(value, true))
	// 			onChange(valueCleanup(value, true));
	// 		}
	// 	};
	// 	// eslint-disable-next-line
	// }, []);

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
