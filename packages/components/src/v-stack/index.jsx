/**
 * WordPress dependencies
 */
import { __experimentalVStack as WordPressVStack } from '@wordpress/components';

/**
 * Internal dependencies
*/
import { componentClassNames } from '@publisher/classnames';


export default function VStack({ children, className, ...props }) {
	return (
		<WordPressVStack
			{...props}
			className={componentClassNames('vertical-stack', className)}
		>
			{children}
		</WordPressVStack>
	)
}
