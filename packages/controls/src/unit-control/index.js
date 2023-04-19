/**
 * WordPress dependencies
 */
import { __experimentalUnitControl as WordPressUnitControl } from '@wordpress/block-editor';

/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * Internal dependencies
 */
import { getBaseClassNames } from '../global-helpers';

export default function UnitControl({ className, ...props }) {
	return (
		<WordPressUnitControl
			className={classnames(getBaseClassNames(), 'uni-control')}
			{...props}
		/>
	);
}
