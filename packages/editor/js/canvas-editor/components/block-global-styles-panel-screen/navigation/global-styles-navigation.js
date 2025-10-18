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
import {
	extensionClassNames,
	extensionInnerClassNames,
} from '@blockera/classnames';

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
			<p
				className={extensionInnerClassNames(
					'navigation-category-description'
				)}
			>
				{__(
					'Customize the appearance of specific blocks for the whole site.',
					'blockera'
				)}
			</p>

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
				icon={<Icon icon="style-variations" size={20} />}
			/>
		</NavigationMenu>
	);
};
