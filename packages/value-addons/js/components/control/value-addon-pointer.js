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

/**
 * Internal dependencies
 */
import { isValid } from '../../helpers';
import VariableIcon from '../../icons/variable';
import RemoveIcon from '../../icons/remove';
import { VarPicker, VarDeleted } from '../index';
import type { ValueAddonControlProps } from './types';

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

	const MappedPointers = ({ handleVariableModal }: Object): Element<any> => {
		const pointers = [];

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

			<MappedPointers
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
