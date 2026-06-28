// @flow

/**
 * External dependencies
 */
import type { MixedElement } from 'react';
import { useDispatch, useSelect, select as dataSelect } from '@wordpress/data';
import { createContext, useRef } from '@wordpress/element';

/**
 * Blockera dependencies
 */
import { isEquals, isUndefined } from '@blockera/utils';

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
	},
	value: null,
	dispatch: null,
	type: 'simple',
});

export const ControlContextProvider = ({
	value: controlInfo,
	children,
	storeName = STORE_NAME,
	...props
}: ControlContextProviderProps): MixedElement | null => {
	const previousControlInfoValueRef = useRef(controlInfo.value);

	if (!dataSelect(storeName).getControl(controlInfo.name)) {
		// $FlowFixMe
		registerControl({
			...controlInfo,
			type: storeName,
		});
	}

	//Prepare control status and value!
	const { status, value } = useSelect(
		(select) => {
			const { getControl } = select(storeName);

			const control = getControl(controlInfo.name);
			const externalValueChanged = !isEquals(
				previousControlInfoValueRef.current,
				controlInfo.value
			);

			// Prefer an externally updated `controlInfo.value` (e.g. block switch),
			// but keep store updates from user interactions when the prop is unchanged.
			if (
				!isUndefined(controlInfo.value) &&
				externalValueChanged &&
				!isEquals(control?.value, controlInfo.value)
			) {
				return {
					...control,
					value: controlInfo.value,
				};
			}

			return control;
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[controlInfo]
	);

	previousControlInfoValueRef.current = controlInfo.value;
	//control dispatch for available actions
	const dispatch = useDispatch(storeName);

	//You can to enable||disable current control with status column!
	if (!status) {
		return null;
	}

	return (
		<ControlContext.Provider
			{...props}
			value={{ controlInfo, value, dispatch, STORE_NAME }}
		>
			{children}
		</ControlContext.Provider>
	);
};

export * from './types';
export { BaseControlContext } from './base-control-context';
export { useControlContext, useControlEffect } from './hooks';
export {
	PreviewInjectableStylesContext,
	usePreviewInjectableStyles,
} from './preview-injectable-styles-context';
export {
	BlockInjectedSlotContext,
	useBlockInjectedSlotClientId,
} from './block-injected-slot-context';
export {
	PresetCanvasPreviewContext,
	usePresetCanvasPreview,
} from './preset-canvas-preview-context';
export {
	PopoverActiveColorStyleContext,
	PopoverActiveColorStyleProvider,
	usePopoverActiveColorStyle,
} from './popover-active-color-style-context';
