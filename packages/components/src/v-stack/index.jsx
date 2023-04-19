/**
 * WordPress dependencies
 */
import { __experimentalVStack as WordPressVStack } from '@wordpress/components';

/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * Internal dependencies
 */
import { getBaseClassNames } from '../global-helpers';

export default function VStack({ children, className = 'vertical-stack-component', ...props }) {
	return (
		<WordPressVStack
			{...props}
			className={classnames(getBaseClassNames(), className)}
		>
			{children}
		</WordPressVStack>
	)
}
