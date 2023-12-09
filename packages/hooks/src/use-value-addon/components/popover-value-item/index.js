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
import { isUndefined } from '@publisher/utils';

export default function ({
	name,
	icon,
	type,
	data,
	onClick,
	...props
}: {
	data: Object,
	onClick: (event: SyntheticMouseEvent<EventTarget>) => void,
	type: string,
	name: string | MixedElement,
	icon: string | MixedElement,
}): MixedElement {
	return (
		<div
			className={controlClassNames(
				'value-addon-popover-item',
				'item-type-' + type
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
		</div>
	);
}
