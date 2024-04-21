// @flow
/**
 * External dependencies
 */
import type { Element } from 'react';

/**
 * Blockera dependencies
 */
import { controlInnerClassNames } from '@blockera/classnames';
import { Flex } from '@blockera/components';

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
			<div className={controlInnerClassNames('picker-category-header')}>
				{title}
			</div>
			{children}
		</Flex>
	);
}
