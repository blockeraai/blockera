/**
 * WordPress dependencies
 */
import { __experimentalHStack as WordPressHStack } from '@wordpress/components';

/**
 * Internal dependencies
*/
import { componentClassNames } from '@publisher/classnames';

export default function HStack({ children, className, ...props }) {
	return (
		<WordPressHStack
			{...props}
			className={componentClassNames('horizontal-stack', className)}
		>
			{children}
		</WordPressHStack>
	)
}
