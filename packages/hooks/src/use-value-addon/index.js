// @flow
/**
 * External dependencies
 */
import { useState } from '@wordpress/element';

/**
 * Publisher dependencies
 */
import { isObject, isUndefined } from '@publisher/utils';
import {
	getVariable,
	type VariableItem,
	type DynamicValueItem,
	getDynamicValue,
} from '@publisher/core-data';

/**
 * Internal dependencies
 */
import { canUnlinkVariable, isValid } from './helpers';
import { ValueAddonControl, ValueAddonPointer } from './components';
import type { UseValueAddonProps, ValueAddonProps } from './types';
import type { ValueAddonControlProps } from './components/control/types';

export type { ValueAddonControlProps } from './components/control/types';

export const useValueAddon = ({
	types,
	value: _value,
	variableTypes,
	dynamicValueTypes,
	onChange,
	size = 'normal',
	pointerProps = {},
	pickerProps = {},
}: UseValueAddonProps): {} | ValueAddonProps => {
	// type is empty
	if (isUndefined(types) || !types.length) {
		return {
			isSetValueAddon: () => false,
			valueAddonClassNames: '',
			ValueAddonPointer: () => <></>,
			ValueAddonControl: () => <></>,
			valueAddonControlProps: {
				value: {
					isValueAddon: false,
					id: '',
					settings: {},
				},
				setValue: () => {},
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

	const initialState = isObject(_value)
		? {
				isValueAddon: _value?.isValueAddon || false,
				valueType: _value?.valueType || '',
				id: _value?.id || '',
				settings: _value.settings || {},
		  }
		: {
				isValueAddon: false,
				valueType: null,
				id: '',
				settings: {},
		  };

	// eslint-disable-next-line react-hooks/rules-of-hooks
	const [value, setValue] = useState(initialState);
	// eslint-disable-next-line react-hooks/rules-of-hooks
	const [isOpen, setOpen] = useState('');

	const valueAddonClassNames = types
		.map((type) => `publisher-value-addon-support-${type}`)
		.join(' ');

	const handleOnClickVar = (data: VariableItem): void => {
		const newValue = {
			settings: {
				...data,
			},
			id: data.slug,
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
				id: null,
				settings: {},
			});

			if (
				!isUndefined(value?.settings?.value) &&
				value?.settings?.value !== ''
			) {
				onChange(value?.settings?.value);
			} else {
				const variable = getVariable(
					value.valueType,
					value.settings.slug
				);

				if (!isUndefined(variable?.value) && variable?.value !== '') {
					onChange(variable?.value);
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
			id: data.id,
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
			id: null,
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
			const item = getVariable(
				controlProps.value?.settings?.type,
				controlProps.value?.settings?.slug
			);

			if (isUndefined(item?.value)) {
				controlProps.isDeletedVar = true;
			}
		} else if (controlProps.value.valueType === 'dynamic-value') {
			const item = getDynamicValue(
				controlProps.value.settings.category,
				controlProps.value.id
			);

			if (isUndefined(item?.id)) {
				controlProps.isDeletedDV = true;
			}
		}
	}

	return {
		valueAddonClassNames,
		isSetValueAddon: () => isValid(value) || isOpen,
		ValueAddonPointer: () => (
			<ValueAddonPointer
				controlProps={controlProps}
				pointerProps={pointerProps}
				pickerProps={pickerProps}
			/>
		),
		ValueAddonControl: ({ ...props }) => (
			<ValueAddonControl controlProps={controlProps} {...props} />
		),
		valueAddonControlProps: controlProps,
		handleOnClickVar,
		handleOnUnlinkVar,
		handleOnClickDV,
	};
};
