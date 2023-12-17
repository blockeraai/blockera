// @flow
/**
 * External dependencies
 */
import type { Element } from 'react';
import { __ } from '@wordpress/i18n';

/**
 * Publisher dependencies
 */
import {
	controlClassNames,
	controlInnerClassNames,
} from '@publisher/classnames';
import { isUndefined } from '@publisher/utils';
import { getVariable, getDynamicValue } from '@publisher/core-data';
import { Tooltip } from '@publisher/components';

/**
 * Internal dependencies
 */
import type { ValueAddonControlProps } from './types';
import { ValueAddonPointer } from './index';
import { getDynamicValueIcon, getVariableIcon, isValid } from '../../helpers';
import EmptyIcon from '../../icons/empty';
import DeletedVariableIcon from '../../icons/deleted-variable';

export default function ({
	classNames,
	controlProps,
	...props
}: {
	classNames?: string,
	controlProps: ValueAddonControlProps,
}): Element<any> {
	let icon: Element<any> = <EmptyIcon />;
	let label = '';
	let isDeleted = false;

	if (isValid(controlProps.value)) {
		if (controlProps.value.valueType === 'variable') {
			const item = getVariable(
				controlProps.value?.settings?.type,
				controlProps.value?.settings?.slug
			);

			if (isUndefined(item?.value)) {
				isDeleted = true;
				label = __('Missing Variable', 'publisher-core');
				icon = <DeletedVariableIcon />;
			} else {
				label = !isUndefined(item?.name)
					? item?.name
					: controlProps.value?.settings?.name;
				icon = getVariableIcon({
					type: controlProps.value?.settings?.type,
					value: controlProps.value?.settings?.value,
				});
			}
		} else if (controlProps.value.valueType === 'dynamic-value') {
			const item = getDynamicValue(
				controlProps.value.settings.category,
				controlProps.value.id
			);

			if (isUndefined(item?.id)) {
				isDeleted = true;
				label = __('Missing Item', 'publisher-core');
				icon = <DeletedVariableIcon />;
			} else {
				label = !isUndefined(item?.name)
					? item?.name
					: controlProps.value?.settings?.name;
				icon = getDynamicValueIcon(controlProps.value?.settings?.type);
			}
		}
	}

	let isIconActive = true;
	if (controlProps.size === 'small') {
		isIconActive = !isValid(controlProps.value);
	}

	return (
		<>
			<Tooltip
				text={
					controlProps.value?.valueType === 'variable'
						? __('Change Variable', 'publisher-core')
						: __('Change Dynamic Value', 'publisher-core')
				}
			>
				<div
					className={controlClassNames(
						'value-addon',
						'type-' + (controlProps.value?.valueType || 'unknown'),
						'value-addon-size-' + controlProps.size,
						isIconActive && 'value-addon-with-icon',
						isDeleted && 'type-deleted',
						controlProps.isOpen.startsWith('var-') &&
							'open-value-addon type-variable',
						controlProps.isOpen.startsWith('dv-') &&
							'open-value-addon type-dynamic-value',
						classNames
					)}
					onClick={(event) => {
						switch (controlProps.value?.valueType) {
							case 'variable':
								controlProps.setOpen(
									isDeleted ? 'var-deleted' : 'var-picker'
								);
								event.preventDefault();
								break;
							case 'dynamic-value':
								controlProps.setOpen(
									isDeleted ? 'dv-deleted' : 'dv-settings'
								);
								event.preventDefault();
								break;
						}
					}}
					{...props}
				>
					{isIconActive && (
						<span className={controlInnerClassNames('item-icon')}>
							{icon}
						</span>
					)}

					<span className={controlClassNames('item-name')}>
						{label}
					</span>
				</div>
			</Tooltip>
			<ValueAddonPointer controlProps={controlProps} />
		</>
	);
}
