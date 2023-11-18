// @flow
/**
 * External dependencies
 */
import type { Element } from 'react';
import { useState } from '@wordpress/element';

/**
 * Publisher dependencies
 */
import { Icon } from '@publisher/components';

/**
 * Internal dependencies
 */
import { IsValid } from './helpers';
import type { PropTypes, ControlAddon } from './types';
import { DynamicValuePicker, VariablePicker } from './components';

export const useControlAddon = ({
	types,
	value,
	variableType,
	dynamicValueType,
}: PropTypes): {} | ControlAddon => {
	if (!types) {
		return {};
	}

	// generating css class names
	const classNames = types
		.map((type) => `publisher-support-${type}`)
		.join(' ');

	//FIXME: property "event" type SyntheticEvent<HTMLButtonElement>
	const handleOnClickVariables = (
		// eslint-disable-next-line
		event: SyntheticEvent<HTMLButtonElement>
	): void => {
		// console.group('variable handler');
		// console.log(event);
		// console.groupEnd();
		console.log(event);
	};

	//FIXME: property "event" type SyntheticEvent<HTMLButtonElement>
	const handleOnClickDynamicValues = (
		// eslint-disable-next-line
		event: SyntheticEvent<HTMLButtonElement>
	): void => {
		// console.group('dynamic value handler');
		// console.log(event);
		// console.groupEnd();
		console.log(event);
	};

	const MappedPointers = ({
		handleVariableModal,
		handleDynamicValueModal,
	}: Object): Array<Element<any>> => {
		const pointers = [];
		if (types.includes('variable')) {
			pointers.push(
				<Icon
					onClick={handleVariableModal}
					library={'wp'}
					icon={'settings'}
				/>
			);
		}
		if (types.includes('dynamic-value')) {
			pointers.push(
				<Icon
					onClick={handleDynamicValueModal}
					library={'wp'}
					icon={'globe'}
				/>
			);
		}

		return pointers;
	};
	const ControlAddonPointer = () => {
		const [isOpenVariables, setOpenVariables] = useState(false);
		const [isOpenDynamicValues, setOpenDynamicValues] = useState(false);

		return (
			<>
				{isOpenVariables && types.includes('variable') && (
					<VariablePicker type={variableType} />
				)}
				{isOpenDynamicValues && types.includes('dynamic-value') && (
					<DynamicValuePicker type={dynamicValueType} />
				)}

				<MappedPointers
					handleDynamicValueModal={(e) => {
						setOpenDynamicValues(true);
						handleOnClickDynamicValues(e);
					}}
					handleVariableModal={(e) => {
						setOpenVariables(true);
						handleOnClickVariables(e);
					}}
				/>
			</>
		);
	};

	return {
		classNames,
		ControlAddonPointer,
		controlAddonHasValue: () => !IsValid(value),
		ControlAddonUI: () => {
			return (
				// eslint-disable-next-line react/no-unknown-property
				<div datatype={types} className={classNames}>
					<ControlAddonPointer />
					{value?.name || 'addon'}
				</div>
			);
		},
		handleOnClickVariables,
		handleOnClickDynamicValues,
	};
};
