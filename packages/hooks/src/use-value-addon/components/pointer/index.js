// @flow
/**
 * External dependencies
 */
import type { Element } from 'react';
import { useState } from '@wordpress/element';

/**
 * Internal dependencies
 */
import type { PointerProps } from './types';
/**
 * TODO: please remove ignore eslint comment after final implements DynamicValuePicker component.
 */
// eslint-disable-next-line
import { DynamicValuePicker, VariablePicker } from '../index';
import { Icon } from '@publisher/components';

export default function ({
	types,
	variableType,
	/**
	 * TODO: please uncomment after final implements DynamicValuePicker component,
	 * and remove ignore eslint comment
	 */ // eslint-disable-next-line no-unused-vars
	dynamicValueType,
	handleOnClickVariable,
	/**
	 * TODO: please uncomment after final implements DynamicValuePicker component,
	 * and remove ignore eslint comment.
	 */ // eslint-disable-next-line no-unused-vars
	handleOnClickDynamicValue,
}: PointerProps): Element<any> {
	const [isOpenVariables, setOpenVariables] = useState(false);
	/**
	 * TODO: please uncomment after final implements DynamicValuePicker component,
	 * and remove ignore eslint comment.
	 */
	// eslint-disable-next-line no-unused-vars
	const [isOpenDynamicValues, setOpenDynamicValues] = useState(false);
	const MappedPointers = ({
		handleVariableModal,
		/**
		 * TODO: please uncomment after final implements DynamicValuePicker component,
		 * and remove ignore eslint comment.
		 */ // eslint-disable-next-line no-unused-vars
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
		// TODO: please uncomment after final implements DynamicValuePicker component.
		// if (types.includes('dynamic-value')) {
		// 	pointers.push(
		// 		<Icon
		// 			onClick={handleDynamicValueModal}
		// 			library={'wp'}
		// 			icon={'globe'}
		// 		/>
		// 	);
		// }

		return pointers;
	};

	return (
		<>
			{isOpenVariables && types.includes('variable') && (
				<VariablePicker
					type={variableType}
					onChoice={handleOnClickVariable}
				/>
			)}
			{/*TODO: please uncomment after final implements DynamicValuePicker component.*/}
			{/*{isOpenDynamicValues && types.includes('dynamic-value') && (*/}
			{/*	<DynamicValuePicker type={dynamicValueType} />*/}
			{/*)}*/}

			<MappedPointers
				handleDynamicValueModal={(
					e: SyntheticMouseEvent<EventTarget>
				) => {
					setOpenDynamicValues(true);
					console.log(e);
					// handleOnClickDynamicValue(e);
				}}
				handleVariableModal={(e: SyntheticMouseEvent<EventTarget>) => {
					setOpenVariables(true);
					console.log(e);
					// handleOnClickVariable(e);
				}}
			/>
		</>
	);
}
