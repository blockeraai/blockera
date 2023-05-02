/**
 * WordPress dependencies
 */
import { ToggleControl as WordPressToggleControl } from '@wordpress/components';

/**
 * Internal dependencies
*/
import { controlClassNames } from '@publisher/classnames';


export default function ToggleControl({
	className = 'toggle-control',
	...props
}) {
	return (
		<WordPressToggleControl
			className={controlClassNames(className)}
			{...props}
		/>
	);
}
