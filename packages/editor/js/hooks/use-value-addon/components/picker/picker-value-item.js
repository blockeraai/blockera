// @flow
/**
 * External dependencies
 */
import type { MixedElement } from 'react';
import { __ } from '@wordpress/i18n';

/**
 * Blockera dependencies
 */
import {
	controlClassNames,
	controlInnerClassNames,
} from '@blockera/classnames';
import { isUndefined, isNumber } from '@blockera/utils';
import { Tooltip, ConditionalWrapper } from '@blockera/components';
import type {
	VariableItem,
	DynamicValueItem,
	ValueAddonItemStatus,
} from '@blockera/data';

/**
 * Internal dependencies
 */
import type { AddonTypesItem, ValueAddon } from '../../types';

export default function ({
	value,
	name,
	icon,
	type,
	valueType,
	data,
	onClick,
	isCurrent = false,
	status = 'core-pro',
	showValue = true,
	...props
}: {
	value: ValueAddon,
	name: string | MixedElement,
	icon: string | MixedElement,
	type: string,
	status: ValueAddonItemStatus,
	valueType: AddonTypesItem,
	data: VariableItem | DynamicValueItem,
	onClick: (data: VariableItem | DynamicValueItem) => void,
	isCurrent: boolean,
	showValue: boolean,
}): MixedElement {
	let itemValue = '';

	if (status === 'core') {
		status = 'active';
	}

	if (showValue && valueType === 'variable') {
		switch (type) {
			case 'font-size':
				if (
					!isUndefined(data?.fluid?.min) &&
					!isUndefined(data?.fluid?.max)
				) {
					// $FlowFixMe
					itemValue = `${data.fluid.min} → ${data.fluid.max}`;
				} else if (isNumber(data.value)) {
					// $FlowFixMe
					itemValue = data.value + 'px';
				} else {
					// $FlowFixMe
					itemValue = data.value;
				}

				break;

			case 'radial-gradient':
			case 'linear-gradient':
				itemValue = '';
				break;

			default:
				// $FlowFixMe
				itemValue = data.value;
				break;
		}
	}

	return (
		<ConditionalWrapper
			condition={status !== 'active'}
			wrapper={(children) => (
				<Tooltip
					text={
						status === 'soon'
							? __('Coming soon…', 'blockera')
							: __('Pro Feature', 'blockera')
					}
					{...props}
				>
					{children}
				</Tooltip>
			)}
		>
			<button
				className={controlClassNames(
					'value-addon-popover-item',
					'item-status-' + status,
					'item-type-' + type,
					'item-value-type-' + valueType,
					isCurrent && 'is-active-item'
				)}
				onClick={() => {
					if (status === 'active') onClick(data);
				}}
				data-cy={'va-item-' + data.id}
				{...props}
			>
				{icon && (
					<span className={controlInnerClassNames('item-icon')}>
						{icon}
					</span>
				)}
				<span className={controlInnerClassNames('item-name')}>
					{name !== '' && !isUndefined(name) ? name : data.id}
				</span>

				{itemValue && (
					<span className={controlInnerClassNames('item-value')}>
						{itemValue}
					</span>
				)}
			</button>
		</ConditionalWrapper>
	);
}
