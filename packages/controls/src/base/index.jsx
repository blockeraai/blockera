/**
 * WordPress dependencies
 */
import { BaseControl as WordPressBaseControl } from '@wordpress/components';

/**
 * External dependencies
 */
import classnames from '@publisher/classnames';

export default function BaseControl({
	className = 'base',
	...props
}) {
	return (
		<WordPressBaseControl
			className={classnames('control', className)}
			{...props}
		/>
	);
}
