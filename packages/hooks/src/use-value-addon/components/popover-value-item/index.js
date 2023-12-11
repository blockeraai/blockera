// @flow
/**
 * External dependencies
 */
import type { MixedElement } from 'react';

/**
 * Publisher dependencies
 */
import {
	controlClassNames,
	controlInnerClassNames,
} from '@publisher/classnames';
import { isUndefined, isNumber } from '@publisher/utils';

/**
 * Internal dependencies
 */
import type { AddonTypesItem, ValueAddon } from '../../types';
import { isValid } from '../../helpers';

export default function ({
	value,
	name,
	icon,
	type,
	valueType,
	data,
	onClick,
	...props
}: {
	value: ValueAddon,
	data: Object,
	onClick: (event: SyntheticMouseEvent<EventTarget>) => void,
	type: string,
	valueType: AddonTypesItem,
	name: string | MixedElement,
	icon: string | MixedElement,
}): MixedElement {
	let itemValue = '';

	if (valueType === 'variable') {
		switch (type) {
			case 'font-size':
				if (
					!isUndefined(data?.fluid?.min) &&
					!isUndefined(data?.fluid?.max)
				) {
					itemValue = `${data.fluid.min} → ${data.fluid.max}`;
				} else if (isNumber(data.value)) {
					itemValue = data.value + 'px';
				} else {
					itemValue = data.value;
				}

				break;

			case 'radial-gradient':
			case 'linear-gradient':
				itemValue = '';
				break;

			default:
				itemValue = data.value;
				break;
		}
	}

	return (
		<div
			className={controlClassNames(
				'value-addon-popover-item',
				'item-type-' + type,
				isValid(value) &&
					value.settings.type === type &&
					value.settings.slug === data.slug &&
					'is-active-item'
			)}
			data-item={JSON.stringify(data)}
			onClick={onClick}
			{...props}
		>
			{icon && (
				<span className={controlInnerClassNames('item-icon')}>
					{icon}
				</span>
			)}
			<span className={controlInnerClassNames('item-name')}>
				{name !== '' && !isUndefined(name) ? name : data.slug}
			</span>

			{itemValue && (
				<span className={controlInnerClassNames('item-value')}>
					{itemValue}
				</span>
			)}
		</div>
	);
}
