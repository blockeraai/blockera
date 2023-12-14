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
import DeletedVariableIcon from '../../icons/deleted-variable';
import { __ } from '@wordpress/i18n';

export default function ({
	classNames,
	controlProps,
	...props
}: {
	classNames?: string,
	controlProps: ValueAddonControlProps,
}): Element<any> {
	let icon: Element<any> = <></>;
	let label = '';
	let isDeleted = false;

	if (isValid(controlProps.value)) {
		if (controlProps.value.valueType === 'variable') {
			const variable = getVariable(
				controlProps.value?.settings?.type,
				controlProps.value?.settings?.slug
			);

			if (isUndefined(variable?.value)) {
				isDeleted = true;
				label = __('Deleted Variable', 'publisher-core');
				icon = <DeletedVariableIcon />;
			} else {
				label = controlProps.value?.settings?.name;
				icon = getVariableIcon({
					type: controlProps.value?.settings?.type,
					value: controlProps.value?.settings?.value,
				});
			}
		} else if (controlProps.value.valueType === 'dynamic-value') {
			label = controlProps.value?.settings?.name;
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
					isDeleted && 'type-variable-deleted',
					['var', 'var-deleted'].includes(controlProps.isOpen) &&
						'open-value-addon type-variable',
					['dv', 'dv-settings'].includes(controlProps.isOpen) &&
						'open-value-addon type-dynamic-value',
					classNames
				)}
				onClick={(event) => {
					switch (controlProps.value?.valueType) {
						case 'variable':
							if (isDeleted) {
								controlProps.setOpen('var-deleted');
							} else {
								controlProps.setOpen('var');
							}
							event.preventDefault();
							break;
						case 'dynamic-value':
							controlProps.setOpen('dv-settings');
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

				<span className={controlClassNames('item-name')}>{label}</span>
			</div>
			<ValueAddonPointer controlProps={controlProps} />
		</>
	);
}
