// @flow
/**
 * External dependencies
 */
import { useState } from '@wordpress/element';

/**
 * Publisher dependencies
 */
import { isObject, isUndefined, useLateEffect } from '@publisher/utils';
import { getVariable } from '@publisher/core-data';

/**
 * Internal dependencies
 */
import { canUnlinkVariable, isValid } from './helpers';
import { ValueUIKit, Pointer } from './components';
import type { PointerProps } from './components/pointer/types';
import type { UseValueAddonProps, ValueAddonProps } from './types';

export const useValueAddon = ({
	types,
	value: _value,
	variableTypes,
	dynamicValueTypes,
	onChange,
}: UseValueAddonProps): {} | ValueAddonProps => {
	// type is empty
	if (isUndefined(types) || !types.length) {
		return {
			isSetValueAddon: () => false,
			valueAddonClassNames: '',
			ValueAddonPointer: () => <></>,
			ValueAddonUI: () => <></>,
			handleOnClickVariable: () => {},
			handleOnClickDynamicValue: () => {},
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
				id: null,
				settings: {},
		  };

	// eslint-disable-next-line react-hooks/rules-of-hooks
	const [value, setValue] = useState(initialState);
	// eslint-disable-next-line react-hooks/rules-of-hooks
	const [isOpenVariables, setOpenVariables] = useState(false);
	// eslint-disable-next-line react-hooks/rules-of-hooks
	const [isOpenDynamicValues, setOpenDynamicValues] = useState(false);
	// eslint-disable-next-line react-hooks/rules-of-hooks
	const [isOpenVariableDeleted, setIsOpenVariableDeleted] = useState(false);

	// eslint-disable-next-line react-hooks/rules-of-hooks
	useLateEffect(() => {
		if (isValid(value)) {
			onChange(value);
		} else {
			onChange('');
		}
	}, [value]);

	const valueAddonClassNames = types
		.map((type) => `publisher-value-addon-support-${type}`)
		.join(' ');

	const handleOnClickVariable = (
		event: SyntheticMouseEvent<EventTarget>
	): void => {
		if (event.target !== event.currentTarget) {
			return;
		}

		// $FlowFixMe
		const item = JSON.parse(event.target.getAttribute('data-item'));

		setValue({
			settings: {
				...item,
			},
			id: item.slug,
			isValueAddon: true,
			valueType: 'variable',
		});

		setOpenVariables(false);
	};

	const handleOnUnlinkVariable = (): void => {
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
			}

			const variable = getVariable(value.valueType, value.settings.slug);

			if (!isUndefined(variable?.value) && variable?.value !== '') {
				onChange(variable?.value);
			}

			setOpenVariables(false);
		}
	};

	const handleOnClickDynamicValue = (
		event: SyntheticMouseEvent<EventTarget>
	): void => {
		if (event.target !== event.currentTarget) {
			return;
		}

		// $FlowFixMe
		const item = JSON.parse(event.target.getAttribute('data-item'));

		setValue({
			settings: {
				...item,
			},
			id: item.slug,
			isValueAddon: true,
			valueType: 'dynamic-value',
		});

		setOpenDynamicValues(false);
	};

	const handleOnClickRemove = (): void => {
		onChange('');
		setValue({
			isValueAddon: false,
			valueType: null,
			id: null,
			settings: {},
		});
		setOpenVariables(false);
		setOpenDynamicValues(false);
	};

	if (typeof variableTypes === 'string') {
		variableTypes = [variableTypes];
	}

	const pointerProps: PointerProps = {
		value,
		types,
		variableTypes:
			typeof variableTypes === 'string' ? [variableTypes] : variableTypes,
		dynamicValueTypes:
			typeof dynamicValueTypes === 'string'
				? [dynamicValueTypes]
				: dynamicValueTypes,
		handleOnClickVariable,
		handleOnUnlinkVariable,
		handleOnClickDynamicValue,
		handleOnClickRemove,
		isOpenVariables,
		setOpenVariables,
		isOpenDynamicValues,
		setOpenDynamicValues,
		isOpenVariableDeleted,
		setIsOpenVariableDeleted,
	};

	return {
		valueAddonClassNames,
		ValueAddonPointer: () => <Pointer {...pointerProps} />,
		isSetValueAddon: () =>
			isValid(value) || isOpenVariables || isOpenDynamicValues,
		ValueAddonUI: ({ ...props }) => (
			<ValueUIKit pointerProps={pointerProps} value={value} {...props} />
		),
		handleOnClickVariable,
		handleOnUnlinkVariable,
		handleOnClickDynamicValue,
	};
};
