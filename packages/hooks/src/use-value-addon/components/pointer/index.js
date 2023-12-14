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
import DynamicValueSettingsUI from '../dynamic-value-picker/dynamic-value-settings';

export default function ({
	pointerProps,
}: {
	pointerProps: PointerProps,
}): Element<any> {
	const isVarActive =
		isValid(pointerProps.value) &&
		pointerProps.value?.valueType === 'variable';

	const isDVActive =
		isValid(pointerProps.value) &&
		pointerProps.value?.valueType === 'dynamic-value';

	const MappedPointers = ({
		handleVariableModal,
		handleDynamicValueModal,
	}: Object): Element<any> => {
		const pointers = [];

		if (pointerProps.types.includes('dynamic-value')) {
			pointers.push(
				<div
					className={controlInnerClassNames(
						'value-addon-pointer',
						'dv-pointer',
						isDVActive && 'active-value-addon',
						(pointerProps.isOpenDV ||
							pointerProps.isOpenDVSettings) &&
							'open-value-addon'
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

		if (pointerProps.types.includes('variable')) {
			pointers.push(
				<div
					className={controlInnerClassNames(
						'value-addon-pointer',
						'var-pointer',
						isVarActive && 'active-value-addon',
						pointerProps.isOpenVar && 'open-value-addon'
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

		if (pointers.length) {
			return (
				<div
					className={controlClassNames(
						'value-addon-pointers',
						(isVarActive ||
							pointerProps.isOpenVar ||
							isDVActive ||
							pointerProps.isOpenDV ||
							pointerProps.isOpenDVSettings) &&
							'active-addon-pointers'
					)}
				>
					{pointers}
				</div>
			);
		}

		return <></>;
	};

	return (
		<>
			{pointerProps.isOpenVar &&
				pointerProps.types.includes('variable') && (
					<VariablePicker pointerProps={pointerProps} />
				)}

			{pointerProps.isOpenDV &&
				pointerProps.types.includes('dynamic-value') && (
					<DynamicValuePicker pointerProps={pointerProps} />
				)}

			{pointerProps.isOpenDVSettings &&
				pointerProps.types.includes('dynamic-value') && (
					<DynamicValueSettingsUI pointerProps={pointerProps} />
				)}

			<MappedPointers
				handleDynamicValueModal={(
					e: SyntheticMouseEvent<EventTarget>
				) => {
					if (isValid(pointerProps.value)) {
						pointerProps.setOpenDV(false);
						pointerProps.handleOnClickRemove(e);
					} else {
						pointerProps.setOpenDV(true);
					}

					e.stopPropagation();
				}}
				handleVariableModal={(e: SyntheticMouseEvent<EventTarget>) => {
					if (isValid(pointerProps.value)) {
						pointerProps.setOpenVar(false);
						pointerProps.handleOnClickRemove(e);
					} else {
						pointerProps.setOpenVar(true);
					}

					e.stopPropagation();
				}}
			/>
		</>
	);
}
