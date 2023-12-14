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
import VariableIcon from '../../icons/variable';
import DynamicValueIcon from '../../icons/dynamic-value';
import RemoveIcon from '../../icons/remove';
import {
	DVPicker,
	DVSettings,
	VarPicker,
	VarDeleted,
	DVSettingsAdvanced,
} from '../index';
import type { ValueAddonControlProps } from './types';

export default function ({
	controlProps,
}: {
	controlProps: ValueAddonControlProps,
}): Element<any> {
	const isVarActive =
		isValid(controlProps.value) &&
		controlProps.value?.valueType === 'variable';

	const isDVActive =
		isValid(controlProps.value) &&
		controlProps.value?.valueType === 'dynamic-value';

	const MappedPointers = ({
		handleVariableModal,
		handleDynamicValueModal,
	}: Object): Element<any> => {
		const pointers = [];

		if (controlProps.types.includes('dynamic-value')) {
			pointers.push(
				<div
					className={controlInnerClassNames(
						'value-addon-pointer',
						'dv-pointer',
						isDVActive && 'active-value-addon',
						['dv-picker', 'dv-settings'].includes(
							controlProps.isOpen
						) && 'open-value-addon'
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

		if (controlProps.types.includes('variable')) {
			pointers.push(
				<div
					className={controlInnerClassNames(
						'value-addon-pointer',
						'var-pointer',
						isVarActive && 'active-value-addon',
						['var-picker', 'var-deleted'].includes(
							controlProps.isOpen
						) && 'open-value-addon'
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
						(isVarActive || controlProps.isOpen || isDVActive) &&
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
			{controlProps.isOpen === 'var-picker' &&
				controlProps.types.includes('variable') && (
					<VarPicker controlProps={controlProps} />
				)}

			{controlProps.isOpen === 'var-deleted' &&
				controlProps.types.includes('variable') && (
					<VarDeleted controlProps={controlProps} />
				)}

			{controlProps.isOpen === 'dv-picker' &&
				controlProps.types.includes('dynamic-value') && (
					<DVPicker controlProps={controlProps} />
				)}

			{controlProps.isOpen === 'dv-settings' &&
				controlProps.types.includes('dynamic-value') && (
					<DVSettings controlProps={controlProps} />
				)}

			{controlProps.isOpen === 'dv-settings-advanced' &&
				controlProps.types.includes('dynamic-value') && (
					<DVSettingsAdvanced controlProps={controlProps} />
				)}

			<MappedPointers
				handleDynamicValueModal={(
					e: SyntheticMouseEvent<EventTarget>
				) => {
					if (isValid(controlProps.value)) {
						controlProps.setOpen(
							controlProps.isOpen ? '' : 'dv-picker'
						);
						controlProps.handleOnClickRemove(e);
					} else {
						controlProps.setOpen('dv-picker');
					}

					e.stopPropagation();
				}}
				handleVariableModal={(e: SyntheticMouseEvent<EventTarget>) => {
					if (isValid(controlProps.value)) {
						controlProps.setOpen('');
						controlProps.handleOnClickRemove(e);
					} else {
						controlProps.setOpen('var-picker');
					}

					e.stopPropagation();
				}}
			/>
		</>
	);
}
