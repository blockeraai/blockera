/**
 * WordPress dependencies
 */
import { __experimentalHStack as WordPressHStack } from '@wordpress/components';

/**
 * Internal dependencies
*/
import classnames from '@publisher/classnames';

export default function HStack({ children, className = 'horizontal-stack-component', ...props }) {
	return (
		<WordPressHStack
			{...props}
			className={classnames('component', className)}
		>
			{children}
		</WordPressHStack>
	)
}
