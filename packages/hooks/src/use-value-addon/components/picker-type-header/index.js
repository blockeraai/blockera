// @flow
/**
 * External dependencies
 */
import type { Element } from 'react';

/**
 * Publisher dependencies
 */
import { controlInnerClassNames } from '@publisher/classnames';

export default function ({
	children,
	...props
}: {
	children: Element<any>,
}): Element<any> {
	return (
		<div
			className={controlInnerClassNames('picker-type-header')}
			{...props}
		>
			{children}
		</div>
	);
}
