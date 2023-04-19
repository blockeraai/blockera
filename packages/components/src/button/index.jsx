/**
 * WordPress dependencies
 */
import { Button as WPButton } from '@wordpress/components';

/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * Internal dependencies
 */
import { getBaseClassNames } from '../global-helpers';

export default function Button({ children, className = 'button-component', ...props }) {
	return (
		<WPButton
			className={classnames(
				getBaseClassNames(),
				className
			)}
			{...props}
		>
			{children}
		</WPButton>
	);
}
