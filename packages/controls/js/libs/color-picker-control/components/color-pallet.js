// @flow
/**
 * External dependencies
 */
import { ColorPicker as WPColorPicker } from '@wordpress/components';
import type { MixedElement } from 'react';

/**
 * Blockera dependencies
 */
import { controlInnerClassNames } from '@blockera/classnames';

/**
 * Internal dependencies
 */
import type { ColorPalletProps } from '../types';

export const ColorPallet = ({
	className,
	...props
}: ColorPalletProps): MixedElement => {
	return (
		<div className={controlInnerClassNames('color-pallet', className)}>
			<WPColorPicker {...props} />
		</div>
	);
};
