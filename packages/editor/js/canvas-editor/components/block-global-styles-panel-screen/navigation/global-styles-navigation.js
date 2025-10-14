// @flow

/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import { type MixedElement } from 'react';
import {
	__experimentalSpacer as Spacer,
	__experimentalNavigationMenu as NavigationMenu,
	__experimentalNavigationItem as NavigationItem,
} from '@wordpress/components';

/**
 * Blockera dependencies
 */
import { Icon } from '@blockera/icons';
import { extensionClassNames } from '@blockera/classnames';

export const GlobalStylesNavigation = (): MixedElement => {
	return (
		<NavigationMenu
			title={
				<>
					<Icon icon="global-styles-category" size={20} />
					{__('Global Styles', 'blockera')}
				</>
			}
			className={extensionClassNames('navigation-category')}
		>
			<Spacer
				className={extensionClassNames('navigation-category', {
					description: true,
				})}
			>
				{__(
					'Customize the appearance of specific blocks for the whole site.',
					'blockera'
				)}
			</Spacer>
			<NavigationItem
				item="blocks"
				onClick={() =>
					document.querySelector('button[id="/blocks"]')?.click()
				}
				className={extensionClassNames('navigation-item', {
					inRoot: true,
				})}
				navigateToMenu="blocks"
				title={__('Block Style Variations', 'blockera')}
				icon={<Icon icon="style-variations-animated" size={20} />}
			/>
		</NavigationMenu>
	);
};
