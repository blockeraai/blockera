/**
 * WordPress dependencies
 */
import { ToggleControl as WordPressToggleControl } from '@wordpress/components';

/**
 * Internal dependencies
*/
import classnames from '@publisher/classnames';


export default function ToggleControl({
	className = 'toggle-control',
	...props
}) {
	return (
		<WordPressToggleControl
			className={classnames('control', className)}
			{...props}
		/>
	);
}
