// @flow
/**
 * External dependencies
 */
import { ColorPicker as WPColorPicker } from '@wordpress/components';

/**
 * Publisher dependencies
 */
import { controlInnerClassNames } from '@publisher/classnames';

export const ColorPallet = ({ className, ...props }) => {
	return (
		<div className={controlInnerClassNames('color-pallet', className)}>
			<WPColorPicker {...props} />
		</div>
	);
};
