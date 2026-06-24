// @flow
/**
 * External dependencies
 */
import { useEffect, useRef } from '@wordpress/element';

/**
 * Internal dependencies
 */
import type { ValueAddonControlProps } from '../control/types';
import {
	areVarPickerCustomAddActionsEqual,
	type VarPickerCustomAddAction,
} from './var-picker-custom-add-context';
import { useVarPickerSingleTypeCustomAddAction } from './use-var-picker-single-type-custom-add-action';

type VarPickerAddActionRefBridgeProps = {
	controlProps: ValueAddonControlProps,
	onCustomAddActionChange: (action: VarPickerCustomAddAction) => void,
};

/**
 * Publishes the latest single-type custom-add action for deferred add-after-search-clear.
 */
export function VarPickerAddActionRefBridge({
	controlProps,
	onCustomAddActionChange,
}: VarPickerAddActionRefBridgeProps): null {
	const customAddAction = useVarPickerSingleTypeCustomAddAction(controlProps);
	const previousActionRef = useRef<?VarPickerCustomAddAction>(null);

	useEffect(() => {
		if (
			areVarPickerCustomAddActionsEqual(
				previousActionRef.current,
				customAddAction
			)
		) {
			return;
		}

		previousActionRef.current = customAddAction;
		onCustomAddActionChange(customAddAction);
	}, [customAddAction, onCustomAddActionChange]);

	return null;
}
