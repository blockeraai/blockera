/**
 * WordPress dependencies
 */
import { __experimentalUnitControl as WordPressUnitControl } from '@wordpress/block-editor';

/**
 * Internal dependencies
 */
import classnames from '@publisher/classnames';

export default function UnitControl({ className = 'uni', ...props }) {
	return (
		<WordPressUnitControl
			className={classnames('control', className)}
			{...props}
		/>
	);
}
