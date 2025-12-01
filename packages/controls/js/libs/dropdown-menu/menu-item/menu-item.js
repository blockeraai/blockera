// @flow
/**
 * External dependencies
 */
import { MenuItem as WPMenuItem } from '@wordpress/components';

/**
 * Blockera dependencies
 */
import { controlClassNames } from '@blockera/classnames';

/**
 * Internal dependencies
 */
import type { MenuItemProps } from '../types/menu-item';

const MenuItem = ({
	className,
	...props
}: MenuItemProps): React$Element<typeof WPMenuItem> => {
	return (
		<WPMenuItem
			className={controlClassNames('menu-item', className)}
			{...props}
		/>
	);
};

export default MenuItem;
