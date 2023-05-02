/**
 * WordPress dependencies
 */
import { Button as WPButton } from '@wordpress/components';

/**
 * Internal dependencies
*/
import { componentClassNames } from '@publisher/classnames';


export default function Button({ children, className = 'button-component', ...props }) {
	return (
		<WPButton
			className={componentClassNames(
				className
			)}
			{...props}
		>
			{children}
		</WPButton>
	);
}
