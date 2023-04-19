/**
 * WordPress dependencies
 */
import { BaseControl as WordPressBaseControl } from '@wordpress/components';

/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * Internal dependencies
 */
import { getBaseClassNames } from '../global-helpers';

export default function BaseControl({
	className = 'base-control',
	...props
}) {
	return (
		<WordPressBaseControl
			className={classnames(getBaseClassNames(), className)}
			{...props}
		/>
	);
}
