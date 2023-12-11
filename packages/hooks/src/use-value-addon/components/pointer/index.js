// @flow
/**
 * External dependencies
 */
import type { Element } from 'react';

/**
 * Publisher dependencies
 */
import {
	controlClassNames,
	controlInnerClassNames,
} from '@publisher/classnames';

/**
 * Internal dependencies
 */
import { isValid } from '../../helpers';
import type { PointerProps } from './types';
import { DynamicValuePicker, VariablePicker } from '../index';
import VariableIcon from '../../icons/variable';
import DynamicValueIcon from '../../icons/dynamic-value';
import RemoveIcon from '../../icons/remove';

export default function ({
	value,
	types,
	variableTypes,
	dynamicValueTypes,
	handleOnClickVariable,
	handleOnClickDynamicValue,
	handleOnClickRemove,
	isOpenVariables,
	setOpenVariables,
	isOpenDynamicValues,
	setOpenDynamicValues,
}: PointerProps): Element<any> {
	const MappedPointers = ({
		handleVariableModal,
		handleDynamicValueModal,
	}: Object): Element<any> => {
		const pointers = [];

		if (types.includes('variable')) {
			const isVarActive =
				isValid(value) && value?.valueType === 'variable';

			pointers.push(
				<div
					className={controlInnerClassNames(
						'value-addon-pointer',
						'var-pointer',
						isVarActive && 'active-value-addon'
					)}
					onClick={handleVariableModal}
				>
					<VariableIcon
						className={controlInnerClassNames('var-pointer-icon')}
					/>
					<RemoveIcon
						className={controlInnerClassNames('remove-icon')}
					/>
				</div>
			);
		}

		if (types.includes('dynamic-value')) {
			const isDVActive =
				isValid(value) && value?.valueType === 'dynamic-value';

			pointers.push(
				<div
					className={controlInnerClassNames(
						'value-addon-pointer',
						'dv-pointer',
						isDVActive && 'active-value-addon'
					)}
					onClick={handleDynamicValueModal}
				>
					<DynamicValueIcon
						className={controlInnerClassNames('dv-pointer-icon')}
					/>
					<RemoveIcon
						className={controlInnerClassNames('remove-icon')}
					/>
				</div>
			);
		}

		if (pointers.length) {
			return (
				<div className={controlClassNames('value-addon-pointers')}>
					{pointers}
				</div>
			);
		}

		return <></>;
	};

	return (
		<>
			{isOpenVariables && types.includes('variable') && (
				<VariablePicker
					types={variableTypes}
					onChoice={handleOnClickVariable}
					value={value}
				/>
			)}

			{isOpenDynamicValues && types.includes('dynamic-value') && (
				<DynamicValuePicker
					types={dynamicValueTypes}
					onChoice={handleOnClickDynamicValue}
					value={value}
				/>
			)}

			<MappedPointers
				handleDynamicValueModal={(
					e: SyntheticMouseEvent<EventTarget>
				) => {
					if (isValid(value)) {
						setOpenDynamicValues(false);
						handleOnClickRemove(e);
					} else {
						setOpenDynamicValues(true);
					}

					e.stopPropagation();
				}}
				handleVariableModal={(e: SyntheticMouseEvent<EventTarget>) => {
					if (isValid(value)) {
						setOpenVariables(false);
						handleOnClickRemove(e);
					} else {
						setOpenVariables(true);
					}

					e.stopPropagation();
				}}
			/>
		</>
	);
}
