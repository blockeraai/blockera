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
import type { ValueAddon } from '../../types';
import Pointer from '../pointer';
import { getVariableIcon, isValid } from '../../helpers';
import EmptyIcon from '../../icons/empty';
import DeletedVariableUI from './deleted-variable';

export default function ({
	value,
	classNames,
	pointerProps,
	...props
}: {
	value: ValueAddon,
	classNames?: string,
	pointerProps: PointerProps,
}): Element<any> {
	// Variable is deleted
	if (isValid(value) && value.valueType === 'variable') {
		let isDeleted = false;

		const variable = getVariable(
			value?.settings?.type,
			value?.settings?.slug
		);

		if (isUndefined(variable?.value)) {
			isDeleted = true;
		}

		if (isDeleted) {
			return (
				<DeletedVariableUI
					pointerProps={pointerProps}
					value={value}
					classNames={classNames}
				/>
			);
		}
	}

	let icon = getVariableIcon({
		type: value?.settings?.type,
		value: value?.settings?.value,
	});

	if (
		icon === '' &&
		(pointerProps.isOpenDynamicValues || pointerProps.isOpenVariables)
	) {
		icon = <EmptyIcon />;
	}

	return (
		<>
			<div
				className={controlClassNames(
					'value-addon-wrapper',
					'type-' + (value?.valueType || 'unknown'),
					pointerProps.isOpenVariables &&
						'open-value-addon type-variable',
					pointerProps.isOpenDynamicValues &&
						'open-value-addon type-dynamic-value',
					classNames
				)}
				onClick={(event) => {
					switch (value?.valueType) {
						case 'variable':
							if (!pointerProps.isOpenVariables)
								event.preventDefault();

							pointerProps.setOpenVariables(
								!pointerProps.isOpenVariables
							);

							break;
						case 'dynamic-value':
							pointerProps.setOpenVariables(
								!pointerProps.isOpenDynamicValues
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
					<>{value?.settings?.name || ''}</>
				</span>
			</div>
			<Pointer {...pointerProps} />
		</>
	);
}
