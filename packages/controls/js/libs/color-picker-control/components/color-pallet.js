// @flow
/**
 * External dependencies
 */
import { ColorPicker as WPColorPicker } from '@wordpress/components';

/**
 * Blockera dependencies
 */
import { controlInnerClassNames } from '@blockera/classnames';

export const ColorPallet = ({ className, ...props }) => {
	return (
		<div className={controlInnerClassNames('color-pallet', className)}>
			<WPColorPicker {...props} />
		</div>
	);
};
