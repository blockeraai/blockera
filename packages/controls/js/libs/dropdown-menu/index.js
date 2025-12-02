// @flow

/**
 * External dependencies
 */
import { DropdownMenu as WPDropdownMenu } from '@wordpress/components';

/**
 * Blockera dependencies
 */
import { controlClassNames } from '@blockera/classnames';

/**
 * Internal dependencies
 */
import type { DropdownMenuProps } from './types';

const DropdownMenu = ({
	className,
	popoverProps = {},
	toggleProps = {},
	...props
}: DropdownMenuProps): React$Element<typeof WPDropdownMenu> => {
	return (
		<WPDropdownMenu
			className={controlClassNames('dropdown-menu', className)}
			popoverProps={{
				className: controlClassNames('dropdown-menu-popover'),
				...popoverProps,
			}}
			toggleProps={{
				tooltipPosition: 'top',
				...toggleProps,
			}}
			{...props}
		/>
	);
};

export default DropdownMenu;
export { default as MenuItem } from './menu-item/menu-item';
export { default as MenuGroup } from './menu-item/menu-group';
