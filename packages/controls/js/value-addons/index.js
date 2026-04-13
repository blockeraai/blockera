// @flow

/**
 * External dependencies
 */
import type { MixedElement } from 'react';
import { select } from '@wordpress/data';
import { useState, useMemo, useRef } from '@wordpress/element';

/**
 * Blockera dependencies
 */
import { isObject, isUndefined } from '@blockera/utils';
import {
	getVariable,
	type VariableItem,
	type DynamicValueItem,
	STORE_NAME,
} from '@blockera/data';

/**
 * Internal dependencies
 */
import { isValid, extractCssVarValue } from './utils';
import { canUnlinkVariable } from './helpers';
import { ValueAddonControl, ValueAddonPointer } from './components';
import type { UseValueAddonProps, ValueAddonProps } from './types';
import type { ValueAddonControlProps } from './components/control/types';

export * from './types';
export type { ValueAddonControlProps } from './components/control/types';

export const useValueAddon = ({
	value,
	setValue,
	onChange,
	types = [],
	size = 'normal',
	pickerProps = {},
	pointerProps = {},
	variableTypes = [],
	dynamicValueTypes = [],
}: UseValueAddonProps): ValueAddonProps => {
	const [isOpen, setOpen] = useState('');

	const controlPropsRef = useRef<?ValueAddonControlProps>(null);
	const pointerPropsRef = useRef<Object>(pointerProps);
	const pickerPropsRef = useRef<Object>(pickerProps);

	pointerPropsRef.current = pointerProps;
	pickerPropsRef.current = pickerProps;

	const StableValueAddonPointer = useMemo(() => {
		function BoundValueAddonPointer(outerProps?: Object): MixedElement {
			const cp = controlPropsRef.current;

			if (!cp) {
				return <></>;
			}

			return (
				<ValueAddonPointer
					controlProps={cp}
					pointerProps={pointerPropsRef.current}
					pickerProps={pickerPropsRef.current}
					{...(outerProps || {})}
				/>
			);
		}

		BoundValueAddonPointer.displayName = 'useValueAddon(ValueAddonPointer)';

		return BoundValueAddonPointer;
	}, []);

	const StableValueAddonControl = useMemo(() => {
		function BoundValueAddonControl(outerProps?: Object): MixedElement {
			const cp = controlPropsRef.current;

			if (!cp) {
				return <></>;
			}

			return (
				<ValueAddonControl controlProps={cp} {...(outerProps || {})} />
			);
		}

		BoundValueAddonControl.displayName = 'useValueAddon(ValueAddonControl)';

		return BoundValueAddonControl;
	}, []);

	value = useMemo(() => {
		return isObject(value)
			? {
					isValueAddon: value?.isValueAddon || false,
					valueType: value?.valueType || '',
					id: value?.id || '',
					settings: value.settings || {},
				}
			: {
					isValueAddon: false,
					valueType: null,
					id: '',
					settings: {},
				};
	}, [value]);

	// type is empty
	if (isUndefined(types) || !types.length) {
		controlPropsRef.current = null;

		return {
			isSetValueAddon: () => false,
			valueAddonClassNames: '',
			ValueAddonPointer: StableValueAddonPointer,
			ValueAddonControl: StableValueAddonControl,
			valueAddonControlProps: {
				value,
				setValue,
				onChange,
				types,
				variableTypes:
					typeof variableTypes === 'string'
						? [variableTypes]
						: variableTypes,
				dynamicValueTypes:
					typeof dynamicValueTypes === 'string'
						? [dynamicValueTypes]
						: dynamicValueTypes,
				handleOnClickVar: () => {},
				handleOnUnlinkVar: () => {},
				handleOnClickDV: () => {},
				handleOnClickRemove: () => {},
				isOpen: '',
				setOpen: () => {},
				size,
				pickerProps: {},
				pointerProps: {},
				isDeletedVar: false,
				isDeletedDV: false,
			},
			handleOnClickVar: () => {},
			handleOnClickDV: () => {},
			handleOnUnlinkVar: () => {},
		};
	}

	const { getDynamicValue } = select(STORE_NAME);

	const valueAddonClassNames = types
		.map((type) => `blockera-value-addon-support-${type}`)
		.join(' ');

	const handleOnClickVar = (data: VariableItem): void => {
		const newValue = {
			settings: {
				...data,
			},
			name: data.name,
			isValueAddon: true,
			valueType: 'variable',
		};

		setValue(newValue);
		onChange(newValue);
		setOpen('');
	};

	const handleOnUnlinkVar = (): void => {
		if (canUnlinkVariable(value)) {
			setValue({
				isValueAddon: false,
				valueType: null,
				name: null,
				settings: {},
			});

			if (
				!isUndefined(value?.settings?.value) &&
				value?.settings?.value !== ''
			) {
				const processedValue = extractCssVarValue(
					value?.settings?.value
				);
				onChange(processedValue || value?.settings?.value);
			} else {
				const variable = getVariable(
					value.valueType,
					value.settings.id
				);

				if (!isUndefined(variable?.value) && variable?.value !== '') {
					const rawVarValue = variable?.value;
					const processedValue = extractCssVarValue(rawVarValue);
					const next =
						processedValue !== undefined && processedValue !== ''
							? processedValue
							: rawVarValue;
					if (next !== undefined && next !== '') {
						onChange(next);
					}
				}
			}

			setOpen('');
		}
	};

	const handleOnClickDV = (data: DynamicValueItem): void => {
		const newValue = {
			settings: {
				...data,
			},
			name: data.name,
			isValueAddon: true,
			valueType: 'dynamic-value',
		};

		setValue(newValue);
		onChange(newValue);
		setOpen('dv-settings');
	};

	const handleOnClickRemove = (): void => {
		onChange('');
		setValue({
			isValueAddon: false,
			valueType: null,
			name: null,
			settings: {},
		});
		setOpen('');
	};

	const controlProps: ValueAddonControlProps = {
		value,
		setValue,
		onChange,
		types,
		variableTypes:
			typeof variableTypes === 'string' ? [variableTypes] : variableTypes,
		dynamicValueTypes:
			typeof dynamicValueTypes === 'string'
				? [dynamicValueTypes]
				: dynamicValueTypes,
		handleOnClickVar,
		handleOnUnlinkVar,
		handleOnClickDV,
		handleOnClickRemove,
		isOpen,
		setOpen,
		size,
		pointerProps,
		pickerProps,
		isDeletedVar: false,
		isDeletedDV: false,
	};

	/**
	 * Detect and add is deleted items to controlProps
	 * we use it inside ValueAddonControl
	 * also we use it outside of component for advanced implementation (ex: BoxSpacingControl)
	 */
	if (isValid(controlProps.value)) {
		if (controlProps.value.valueType === 'variable') {
			const item: ?VariableItem = getVariable(
				controlProps.value?.settings?.type,
				controlProps.value?.settings?.id
			);

			// Bindings are by slug (`settings.id`). Renamed display names refresh via
			// live catalog reads; changed slugs do not fall back to `settings.name`.
			controlProps.isDeletedVar = !item || isUndefined(item.value);
		} else if (controlProps.value.valueType === 'dynamic-value') {
			const item = getDynamicValue(
				controlProps.value.settings.group,
				controlProps.value.settings.name
			);

			if (isUndefined(item?.name)) {
				controlProps.isDeletedDV = true;
			}
		}
	}

	controlPropsRef.current = controlProps;

	return {
		valueAddonClassNames,
		isSetValueAddon: () => isValid(value) || isOpen !== '',
		ValueAddonPointer: StableValueAddonPointer,
		ValueAddonControl: StableValueAddonControl,
		valueAddonControlProps: controlProps,
		handleOnClickVar,
		handleOnUnlinkVar,
		handleOnClickDV,
	};
};

export * from './utils';
export * from './helpers';
export {
	renderChangesetPreviewPart,
	CHANGESET_PREVIEW_VALUE_ADDON_CLASS,
} from './render-changeset-preview-part';
export {
	VAR_PICKER_PRESET_PANEL_FILTER,
	VAR_PICKER_GLOBAL_STYLES_PRESET_PANEL_FILTER,
	VAR_PICKER_FALLBACK_PRESET_PANEL_FILTER,
	VarPickerPresetContext,
	useVarPickerPresetContext,
	ValueAddonDisplay,
} from './components';
