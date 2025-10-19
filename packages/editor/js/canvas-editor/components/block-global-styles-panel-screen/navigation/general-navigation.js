// @flow

/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import { type MixedElement } from 'react';
import {
	__experimentalNavigationMenu as NavigationMenu,
	__experimentalNavigationItem as NavigationItem,
} from '@wordpress/components';

/**
 * Blockera dependencies
 */
import { Icon } from '@blockera/icons';
import { extensionClassNames } from '@blockera/classnames';

export const GeneralNavigation = (): MixedElement => {
	return (
		<NavigationMenu
			title={
				<>
					<Icon icon="general-category" size={20} />
					{__('General', 'blockera')}
				</>
			}
			className={extensionClassNames('navigation-category')}
		>
			<NavigationItem
				item="layout"
				onClick={() =>
					document.querySelector('button[id="/layout"]')?.click()
				}
				className={extensionClassNames('navigation-item', 'hide-caret')}
				navigateToMenu="layout"
				title={__('Layout', 'blockera')}
				icon={<Icon icon="wp-layout" size={20} />}
			/>
		</NavigationMenu>
	);
};
