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

export default function ({
	value,
	classNames,
	pointerProps,
}: {
	value: ValueAddon,
	classNames?: string,
	pointerProps: PointerProps,
}): Element<any> {
	const icon = getVariableIcon({
		type: value?.settings?.type,
		value: value?.settings?.value,
	});

	return (
		<>
			<div
				className={controlClassNames(
					'value-addon-wrapper',
					'type-' + (value?.valueType || 'unknown'),
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
					<>{value?.settings?.name || 'Value Addon'}</>
				</span>
			</div>
			<Pointer {...pointerProps} />
		</>
	);
}
