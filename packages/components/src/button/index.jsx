/**
 * WordPress dependencies
 */
import { Button as WPButton } from '@wordpress/components';

/**
 * Internal dependencies
*/
import classnames from '@publisher/classnames';


export default function Button({ children, className = 'button-component', ...props }) {
	return (
		<WPButton
			className={classnames(
				'component',
				className
			)}
			{...props}
		>
			{children}
		</WPButton>
	);
}
