/**
 * WordPress dependencies
 */
import { Button as WPButton } from '@wordpress/components';

/**
 * Internal dependencies
*/
import { componentClassNames } from '@publisher/classnames';


export default function Button({ children, className, ...props }) {
	return (
		<WPButton
			className={componentClassNames('button', className)}
			{...props}
		>
			{children}
		</WPButton>
	);
}
