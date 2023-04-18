/**
 * WordPress dependencies
 */
import { Button as WPButton } from '@wordpress/components';

export default function Button({ children, ...props }) {
	return <WPButton {...props}>{children}</WPButton>;
}
