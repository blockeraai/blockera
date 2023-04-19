/**
 * WordPress dependencies
 */
import { __experimentalHStack as WordPressHStack } from '@wordpress/components';

/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * Internal dependencies
 */
import { getBaseClassNames } from '../global-helpers';

export default function HStack({ children, className = 'horizontal-stack-component', ...props }) {
	return (
		<WordPressHStack
			{...props}
			className={classnames(getBaseClassNames(), className)}
		>
			{children}
		</WordPressHStack>
	)
}
