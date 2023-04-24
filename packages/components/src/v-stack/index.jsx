/**
 * WordPress dependencies
 */
import { __experimentalVStack as WordPressVStack } from '@wordpress/components';

/**
 * Internal dependencies
*/
import classnames from '@publisher/classnames';


export default function VStack({ children, className = 'vertical-stack-component', ...props }) {
	return (
		<WordPressVStack
			{...props}
			className={classnames('component', className)}
		>
			{children}
		</WordPressVStack>
	)
}
