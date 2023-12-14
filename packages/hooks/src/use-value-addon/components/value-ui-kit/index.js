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
import type { PointerProps } from '../pointer/types';
import Pointer from '../pointer';
import { getDynamicValueIcon, getVariableIcon, isValid } from '../../helpers';
import EmptyIcon from '../../icons/empty';
import DeletedVariableUI from '../variable-picker/deleted-variable';

export default function ({
	classNames,
	pointerProps,
	...props
}: {
	classNames?: string,
	pointerProps: PointerProps,
}): Element<any> {
	// Variable is deleted
	if (isValid(pointerProps.value)) {
		if (pointerProps.value.valueType === 'variable') {
			let isDeleted = false;

			const variable = getVariable(
				pointerProps.value?.settings?.type,
				pointerProps.value?.settings?.slug
			);

			if (isUndefined(variable?.value)) {
				isDeleted = true;
			}

			if (isDeleted) {
				return (
					<DeletedVariableUI
						pointerProps={pointerProps}
						value={pointerProps.value}
						classNames={classNames}
					/>
				);
			}
		}
	}

	let icon: Element<any> = <></>;

	if (isValid(pointerProps.value)) {
		if (pointerProps.value.valueType === 'variable') {
			icon = getVariableIcon({
				type: pointerProps.value?.settings?.type,
				value: pointerProps.value?.settings?.value,
			});
		} else if (pointerProps.value.valueType === 'dynamic-value') {
			icon = getDynamicValueIcon(pointerProps.value?.settings?.type);
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
					'value-addon-wrapper',
					'type-' + (pointerProps.value?.valueType || 'unknown'),
					['var', 'var-deleted'].includes(pointerProps.isOpen) &&
						'open-value-addon type-variable',
					['dv', 'dv-settings'].includes(pointerProps.isOpen) &&
						'open-value-addon type-dynamic-value',
					classNames
				)}
				onClick={(event) => {
					switch (pointerProps.value?.valueType) {
						case 'variable':
							pointerProps.setOpen(
								pointerProps.isOpen === 'var' ? '' : 'var'
							);
							event.preventDefault();
							break;
						case 'dynamic-value':
							pointerProps.setOpen(
								!pointerProps.isOpen === 'dv' ? '' : ' dv'
							);
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
					<>{pointerProps.value?.settings?.name || ''}</>
				</span>
			</div>
			<Pointer pointerProps={pointerProps} />
		</>
	);
}
