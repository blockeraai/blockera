// @flow
/**
 * External dependencies
 */
import type { Element } from 'react';

/**
 * Blockera dependencies
 */
import { controlInnerClassNames } from '@blockera/classnames';

/**
 * Internal dependencies
 */
import Flex from '../../../libs/flex';

export default function ({
	children,
	title,
	showTitle = true,
	...props
}: {
	children: Element<any>,
	title: Element<any>,
	/**
	 * When false, the category header is omitted (e.g. global-styles preset panels
	 * that bring their own section labels).
	 */
	showTitle?: boolean,
}): Element<any> {
	return (
		<Flex
			className={controlInnerClassNames('picker-category')}
			direction="column"
			gap={'10px'}
			{...props}
		>
			{showTitle ? (
				<div
					className={controlInnerClassNames('picker-category-header')}
				>
					{title}
				</div>
			) : null}
			{children}
		</Flex>
	);
}
