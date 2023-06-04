/**
 * WordPress dependencies
 */
import { BaseControl as WordPressBaseControl } from '@wordpress/components';

/**
 * Publisher dependencies
 */
import { controlClassNames } from '@publisher/classnames';

export default function BaseControl({
	className,
	...props
}) {
	return (
		<WordPressBaseControl
			className={controlClassNames('base', className)}
			{...props}
		/>
	);
}
