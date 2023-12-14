// @flow
/**
 * External dependencies
 */
import { useState } from '@wordpress/element';

/**
 * Publisher dependencies
 */
import { isObject, isUndefined } from '@publisher/utils';
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
				id: null,
				settings: {},
		  };

	// eslint-disable-next-line react-hooks/rules-of-hooks
	const [value, setValue] = useState(initialState);
	// eslint-disable-next-line react-hooks/rules-of-hooks
	const [isOpen, setOpen] = useState('');

	const valueAddonClassNames = types
		.map((type) => `publisher-value-addon-support-${type}`)
		.join(' ');

	const handleOnClickVar = (
		event: SyntheticMouseEvent<EventTarget>
	): void => {
		if (event.target !== event.currentTarget) {
			return;
		}

		// $FlowFixMe
		const item = JSON.parse(event.target.getAttribute('data-item'));

		const newValue = {
			settings: {
				...item,
			},
			id: item.slug,
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

	const handleOnClickDV = (event: SyntheticMouseEvent<EventTarget>): void => {
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

	if (typeof variableTypes === 'string') {
		variableTypes = [variableTypes];
	}

	const pointerProps: PointerProps = {
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
	};

	return {
		valueAddonClassNames,
		ValueAddonPointer: () => <Pointer pointerProps={pointerProps} />,
		isSetValueAddon: () => isValid(value) || isOpen,
		ValueAddonUI: ({ ...props }) => (
			<ValueUIKit pointerProps={pointerProps} {...props} />
		),
		handleOnClickVar,
		handleOnUnlinkVar,
		handleOnClickDV,
	};
};
