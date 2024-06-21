// @flow
/**
 * External dependencies
 */
import type { Element } from 'react';

/**
 * Blockera dependencies
 */
import {
	controlClassNames,
	controlInnerClassNames,
} from '@blockera/classnames';
import { Icon } from '@blockera/icons';
import { experimental } from '@blockera/env';

/**
 * Internal dependencies
 */
import {
	DVPicker,
	DVDeleted,
	VarPicker,
	DVSettings,
	VarDeleted,
	DVSettingsAdvanced,
} from '../index';
import { isValid } from '../../helpers';
import RemoveIcon from '../../icons/remove';
import type { ValueAddonControlProps } from './types';
import DynamicValueIcon from '../../icons/dynamic-value';

export default function ({
	controlProps,
	pointerProps = {},
	pickerProps = {},
}: {
	controlProps: ValueAddonControlProps,
	pointerProps: Object,
	pickerProps: Object,
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

		if (
			controlProps.types.includes('dynamic-value') &&
			experimental().get('data.dynamicValue')
		) {
			pointers.push(
				<div
					className={controlInnerClassNames(
						'value-addon-pointer',
						'dv-pointer',
						isDVActive && 'active-value-addon',
						controlProps.isOpen.startsWith('dv-') &&
							'open-value-addon',
						controlProps.isDeletedDV && 'is-value-addon-deleted'
					)}
					onClick={handleDynamicValueModal}
					{...pointerProps}
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
						controlProps.isOpen.startsWith('var-') &&
							'open-value-addon',
						controlProps.isDeletedVar && 'is-value-addon-deleted'
					)}
					onClick={handleVariableModal}
					{...pointerProps}
				>
					<Icon
						icon="variable"
						iconSize="16"
						data-cy="value-addon-btn-open"
						className={controlInnerClassNames('var-pointer-icon')}
					/>

					<Icon
						icon="close-small"
						data-cy="value-addon-btn-remove"
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
							(isVarActive || controlProps.isOpen) &&
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
					<VarPicker controlProps={controlProps} {...pickerProps} />
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

			{controlProps.isOpen === 'dv-deleted' &&
				controlProps.types.includes('dynamic-value') && (
					<DVDeleted controlProps={controlProps} />
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
						if (pickerProps.onShown) pickerProps.onShown();
					}

					e.stopPropagation();
				}}
				handleVariableModal={(e: SyntheticMouseEvent<EventTarget>) => {
					if (isValid(controlProps.value)) {
						controlProps.setOpen('');
						controlProps.handleOnClickRemove(e);
					} else {
						controlProps.setOpen('var-picker');
						if (pickerProps.onShown) pickerProps.onShown();
					}

					e.stopPropagation();
				}}
			/>
		</>
	);
}
