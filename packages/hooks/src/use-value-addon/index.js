// @flow
/**
 * External dependencies
 */
import { useState, useEffect } from '@wordpress/element';

/**
 * Publisher dependencies
 */
import { isObject } from '@publisher/utils';

/**
 * Internal dependencies
 */
import { isValid } from './helpers';
import { ValueUIKit, Pointer } from './components';
import type { PointerProps } from './components/pointer/types';
import type { UseValueAddonProps, ValueAddonProps } from './types';

export const useValueAddon = ({
	types,
	value: _value,
	variableType,
	dynamicValueType,
	onChange,
}: UseValueAddonProps): {} | ValueAddonProps => {
	// type is empty
	if (!types.length) {
		return {};
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
	useEffect(() => {
		if (isValid(value)) {
			onChange(value);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [value]);

	const classNames = types
		.map((type) => `publisher-support-${type}`)
		.join(' ');
	const handleOnClickVariable = (
		event: SyntheticMouseEvent<EventTarget>
	): void => {
		// $FlowFixMe
		const variable = JSON.parse(event.target.getAttribute('data-variable'));

		setValue({
			settings: {
				...variable,
			},
			id: variable.slug,
			isValueAddon: true,
			valueType: 'variable',
		});
	};
	const handleOnClickDynamicValue = (
		event: SyntheticMouseEvent<EventTarget>
	): void => {
		/**
		 * TODO: please complete this handler after final implements DynamicValuePicker component.
		 */
		console.log(event);
	};

	const pointerProps: PointerProps = {
		types,
		variableType,
		dynamicValueType,
		handleOnClickVariable,
		handleOnClickDynamicValue,
	};

	return {
		classNames,
		ValueAddonPointer: () => <Pointer {...pointerProps} />,
		issetValueAddon: () => isValid(value),
		ValueAddonUI: () => (
			<ValueUIKit
				pointerProps={pointerProps}
				{...{
					value,
					types,
				}}
			/>
		),
		handleOnClickVariable,
		/**
		 * TODO: please uncomment below property after final implements DynamicValuePicker component.
		 */
		// handleOnClickDynamicValue,
	};
};
