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
import { isUndefined } from '@publisher/utils';
import { getVariable } from '@publisher/core-data';

/**
 * Internal dependencies
 */
import type { ValueAddonControlProps } from './types';
import { ValueAddonPointer } from './index';
import { getDynamicValueIcon, getVariableIcon, isValid } from '../../helpers';
import EmptyIcon from '../../icons/empty';
import { VarDeleted } from '../index';

export default function ({
	classNames,
	controlProps,
	...props
}: {
	classNames?: string,
	controlProps: ValueAddonControlProps,
}): Element<any> {
	// Variable is deleted
	if (isValid(controlProps.value)) {
		if (controlProps.value.valueType === 'variable') {
			let isDeleted = false;

			const variable = getVariable(
				controlProps.value?.settings?.type,
				controlProps.value?.settings?.slug
			);

			if (isUndefined(variable?.value)) {
				isDeleted = true;
			}

			if (isDeleted) {
				return (
					<VarDeleted
						controlProps={controlProps}
						value={controlProps.value}
						classNames={controlProps}
					/>
				);
			}
		}
	}

	let icon: Element<any> = <></>;

	if (isValid(controlProps.value)) {
		if (controlProps.value.valueType === 'variable') {
			icon = getVariableIcon({
				type: controlProps.value?.settings?.type,
				value: controlProps.value?.settings?.value,
			});
		} else if (controlProps.value.valueType === 'dynamic-value') {
			icon = getDynamicValueIcon(controlProps.value?.settings?.type);
		} else {
			icon = <EmptyIcon />;
		}
	} else {
		icon = <EmptyIcon />;
	}

	return (
		<>
			<div
				className={controlClassNames(
					'value-addon',
					'type-' + (controlProps.value?.valueType || 'unknown'),
					['var', 'var-deleted'].includes(controlProps.isOpen) &&
						'open-value-addon type-variable',
					['dv', 'dv-settings'].includes(controlProps.isOpen) &&
						'open-value-addon type-dynamic-value',
					classNames
				)}
				onClick={(event) => {
					switch (controlProps.value?.valueType) {
						case 'variable':
							controlProps.setOpen('var');
							event.preventDefault();
							break;
						case 'dynamic-value':
							controlProps.setOpen('dv');
							event.preventDefault();
							break;
					}
				}}
				{...props}
			>
				{icon && (
					<span className={controlInnerClassNames('item-icon')}>
						{icon}
					</span>
				)}

				<span className={controlClassNames('item-name')}>
					<>{controlProps.value?.settings?.name || ''}</>
				</span>
			</div>
			<ValueAddonPointer controlProps={controlProps} />
		</>
	);
}
