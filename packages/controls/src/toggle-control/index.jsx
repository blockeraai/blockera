/**
 * WordPress dependencies
 */
import { ToggleControl as WordPressToggleControl } from '@wordpress/components';

/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * Internal dependencies
 */
import { getBaseClassNames } from '../global-helpers';

export default function ToggleControl({
	className = 'toggle-control',
	...props
}) {
	return (
		<WordPressToggleControl
			className={classnames(getBaseClassNames(), className)}
			{...props}
		/>
	);
}
