// @flow
/**
 * External dependencies
 */
import type { Element } from 'react';
import { __ } from '@wordpress/i18n';

/**
 * Blockera dependencies
 */
import {
	controlClassNames,
	controlInnerClassNames,
} from '@blockera/classnames';
import { isUndefined } from '@blockera/utils';
import { getVariable } from '@blockera/data';

/**
 * Internal dependencies
 */
import { Tooltip } from '../../../';
import type { ValueAddonControlProps } from './types';
import { ValueAddonPointer } from './index';
import { getVariableIcon, isValid } from '../../helpers';
import { default as EmptyIcon } from '../../icons/empty.svg';
import { default as DeletedIcon } from '../../icons/deleted.svg';

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
		}
	}

	let isIconActive = true;
	if (controlProps.size === 'small') {
		isIconActive = !isValid(controlProps.value);
	}

	return (
		<>
			<Tooltip text={__('Change Variable', 'blockera')}>
				<button
					className={controlClassNames(
						'value-addon',
						'type-' + (controlProps.value?.valueType || 'unknown'),
						'value-addon-size-' + controlProps.size,
						isIconActive && 'value-addon-with-icon',
						isDeleted && 'type-deleted',
						controlProps.isOpen.startsWith('var-') &&
							'open-value-addon type-variable',
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
