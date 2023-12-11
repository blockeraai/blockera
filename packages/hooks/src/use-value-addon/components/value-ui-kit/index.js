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

/**
 * Internal dependencies
 */
import Pointer from '../pointer';
import { getVariableIcon } from '../../helpers';
import type { PointerProps } from '../pointer/types';
import type { ValueAddon } from '../../types';
import EmptyIcon from '../../icons/empty';

export default function ({
	value,
	classNames,
	pointerProps,
}: {
	value: ValueAddon,
	classNames?: string,
	pointerProps: PointerProps,
}): Element<any> {
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
