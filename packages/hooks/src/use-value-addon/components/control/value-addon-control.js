// @flow
/**
 * External dependencies
 */
import type { Element } from 'react';
import { __ } from '@wordpress/i18n';
import { select } from '@wordpress/data';

/**
 * Blockera dependencies
 */
import {
	controlClassNames,
	controlInnerClassNames,
} from '@blockera/classnames';
import { isUndefined } from '@blockera/utils';
import { getVariable, STORE_NAME } from '@blockera/core-data';
import { Tooltip } from '@blockera/components';

/**
 * Internal dependencies
 */
import type { ValueAddonControlProps } from './types';
import { ValueAddonPointer } from './index';
import { getDynamicValueIcon, getVariableIcon, isValid } from '../../helpers';
import EmptyIcon from '../../icons/empty';
import DeletedIcon from '../../icons/deleted';

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

	const { getDynamicValue } = select(STORE_NAME);

	if (isValid(controlProps.value)) {
		if (controlProps.value.valueType === 'variable') {
			if (controlProps.isDeletedVar) {
				isDeleted = true;
				label = __('Missing Variable', 'blockera');
				icon = <DeletedIcon />;
			} else {
				const item = getVariable(
					controlProps.value?.settings?.type,
					controlProps.value?.settings?.id
				);

				label = !isUndefined(item?.name)
					? item?.name
					: controlProps.value?.settings?.name;
				icon = getVariableIcon({
					type: controlProps.value?.settings?.type,
					value: controlProps.value?.settings?.value,
				});
			}
		} else if (controlProps.value.valueType === 'dynamic-value') {
			if (controlProps.isDeletedDV) {
				isDeleted = true;
				label = __('Missing Item', 'blockera');
				icon = <DeletedIcon />;
			} else {
				const item = getDynamicValue(
					controlProps.value.settings.group,
					controlProps.value.name
				);

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
						? __('Change Variable', 'blockera')
						: __('Change Dynamic Value', 'blockera')
				}
			>
				<button
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
					data-cy="value-addon-btn"
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
				</button>
			</Tooltip>
			<ValueAddonPointer controlProps={controlProps} />
		</>
	);
}
