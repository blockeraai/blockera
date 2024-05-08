// @flow
/**
 * External dependencies
 */
import { select } from '@wordpress/data';
import { useState, useMemo } from '@wordpress/element';

/**
 * Blockera dependencies
 */
import { isObject, isUndefined } from '@blockera/utils';
import { getVariable, type VariableItem, STORE_NAME } from '@blockera/data';

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
	value,
	setValue,
	variableTypes,
	onChange,
	size = 'normal',
	pointerProps = {},
	pickerProps = {},
}: UseValueAddonProps): {} | ValueAddonProps => {
	const [isOpen, setOpen] = useState('');
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
		return {
			isSetValueAddon: () => false,
			valueAddonClassNames: '',
			ValueAddonPointer: () => <></>,
			ValueAddonControl: () => <></>,
			valueAddonControlProps: {
				value,
				setValue,
				onChange,
				types,
				variableTypes:
					typeof variableTypes === 'string'
						? [variableTypes]
						: variableTypes,
				handleOnClickVar: () => {},
				handleOnUnlinkVar: () => {},
				handleOnClickRemove: () => {},
				isOpen: '',
				setOpen: () => {},
				size,
				pickerProps: {},
				pointerProps: {},
				isDeletedVar: false,
			},
			handleOnClickVar: () => {},
			handleOnUnlinkVar: () => {},
		};
	}

	const { getVariableType } = select(STORE_NAME);

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
				onChange(value?.settings?.value);
			} else {
				const variable = getVariable(
					value.valueType,
					value.settings.id
				);

				if (!isUndefined(variable?.value) && variable?.value !== '') {
					onChange(variable?.value);
				}
			}

			setOpen('');
		}
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
		handleOnClickVar,
		handleOnUnlinkVar,
		handleOnClickRemove,
		isOpen,
		setOpen,
		size,
		pointerProps,
		pickerProps,
		isDeletedVar: false,
	};

	/**
	 * Detect and add is deleted items to controlProps
	 * we use it inside ValueAddonControl
	 * also we use it outside of component for advanced implementation (ex: BoxSpacingControl)
	 */
	if (isValid(controlProps.value)) {
		if (controlProps.value.valueType === 'variable') {
			let item: VariableItem | null | void = getVariable(
				controlProps.value?.settings?.type,
				controlProps.value?.settings?.id
			);

			if (isUndefined(item?.value)) {
				item = getVariableType(
					controlProps.value?.settings?.type,
					controlProps.value?.settings?.name
				);

				controlProps.isDeletedVar = isUndefined(item?.value);
			}
		}
	}

	return {
		valueAddonClassNames,
		isSetValueAddon: () => isValid(value) || isOpen !== '',
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
	};
};

export * from './helpers';
