/**
 * WordPress dependencies
 */
import { ToggleControl as WordPressToggleControl } from '@wordpress/components';

/**
 * Internal dependencies
*/
import { controlClassNames } from '@publisher/classnames';


export default function ToggleControl({
	className,
	...props
}) {
	return (
		<WordPressToggleControl
			className={controlClassNames('toggle-control', className)}
			{...props}
		/>
	);
}
