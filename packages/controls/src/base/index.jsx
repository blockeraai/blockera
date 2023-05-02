/**
 * WordPress dependencies
 */
import { BaseControl as WordPressBaseControl } from '@wordpress/components';

/**
 * External dependencies
 */
import { controlClassNames } from '@publisher/classnames';

export default function BaseControl({
	className = 'base',
	...props
}) {
	return (
		<WordPressBaseControl
			className={controlClassNames(className)}
			{...props}
		/>
	);
}
