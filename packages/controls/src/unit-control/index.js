/**
 * WordPress dependencies
 */
import { __experimentalUnitControl as WordPressUnitControl } from '@wordpress/block-editor';

/**
 * Internal dependencies
 */
import { controlClassNames } from '@publisher/classnames';

export default function UnitControl({ className, ...props }) {
	return (
		<WordPressUnitControl
			className={controlClassNames('unit', className)}
			{...props}
		/>
	);
}
