// @flow

/**
 * External dependencies
 */
import type { MixedElement } from 'react';
import { MenuGroup as WPMenuGroup } from '@wordpress/components';

/**
 * Blockera dependencies
 */
import { controlClassNames } from '@blockera/classnames';

/**
 * Internal dependencies
 */
import type { MenuGroupProps } from '../types/menu-group';

const MenuGroup = ({
	className,
	children,
	...props
}: MenuGroupProps): MixedElement => {
	return (
		<WPMenuGroup
			className={controlClassNames('blockera-menu-group', className)}
			{...props}
		>
			{children}
		</WPMenuGroup>
	);
};

export default MenuGroup;
