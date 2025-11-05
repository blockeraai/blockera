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

export const DesignSystemNavigation = (): MixedElement => {
	return (
		<NavigationMenu
			title={
				<>
					<Icon icon="extension-typography" iconSize={20} />
					{__('Design system', 'blockera')}
				</>
			}
			className={extensionClassNames('navigation-category')}
		>
			<NavigationItem
				item="typography"
				onClick={() =>
					document.querySelector('button[id="/typography"]')?.click()
				}
				className={extensionClassNames('navigation-item', 'hide-caret')}
				navigateToMenu="typography"
				title={__('Typography', 'blockera')}
				icon={<Icon icon="wp-typography" iconSize={20} />}
			/>
			<NavigationItem
				item="colors"
				onClick={() =>
					document.querySelector('button[id="/colors"]')?.click()
				}
				className={extensionClassNames('navigation-item', 'hide-caret')}
				navigateToMenu="colors"
				title={__('Colors', 'blockera')}
				icon={<Icon icon="wp-colors" iconSize={20} />}
			/>
			<NavigationItem
				item="background"
				onClick={() =>
					document.querySelector('button[id="/background"]')?.click()
				}
				className={extensionClassNames('navigation-item', 'hide-caret')}
				navigateToMenu="background"
				title={__('Background', 'blockera')}
				icon={<Icon icon="wp-background" iconSize={20} />}
			/>
			<NavigationItem
				item="shadows"
				onClick={() =>
					document.querySelector('button[id="/shadows"]')?.click()
				}
				className={extensionClassNames('navigation-item', 'hide-caret')}
				navigateToMenu="shadows"
				title={__('Shadows', 'blockera')}
				icon={<Icon icon="wp-shadows" iconSize={20} />}
			/>
		</NavigationMenu>
	);
};
