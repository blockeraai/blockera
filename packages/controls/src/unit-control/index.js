/**
 * WordPress dependencies
 */
import { __experimentalUnitControl as WordPressUnitControl } from '@wordpress/block-editor';

/**
 * Internal dependencies
 */
import { controlClassNames } from '@publisher/classnames';

export default function UnitControl({ className = 'unit-control', ...props }) {
	return (
		<WordPressUnitControl
			className={controlClassNames(className)}
			{...props}
		/>
	);
}
