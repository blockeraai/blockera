// @flow
/**
 * External dependencies
 */
import type { Element } from 'react';

/**
 * Publisher dependencies
 */
import { controlInnerClassNames } from '@publisher/classnames';
import { Flex } from '@publisher/components';

export default function ({
	children,
	title,
	...props
}: {
	children: Element<any>,
	title: Element<any>,
}): Element<any> {
	return (
		<Flex
			className={controlInnerClassNames('picker-category')}
			direction="column"
			gap={'10px'}
			{...props}
		>
			<div
				className={controlInnerClassNames('picker-category-header')}
				{...props}
			>
				{title}
			</div>
			{children}
		</Flex>
	);
}
