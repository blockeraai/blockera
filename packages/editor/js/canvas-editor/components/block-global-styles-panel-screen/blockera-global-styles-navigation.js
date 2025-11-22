// @flow

/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import { type MixedElement } from 'react';
import {
	__experimentalNavigation as Navigation,
	__experimentalNavigationItem as NavigationItem,
	__experimentalNavigationMenu as NavigationMenu,
} from '@wordpress/components';
import { useEffect, useState, useCallback } from '@wordpress/element';

/**
 * Blockera dependencies
 */
import { extensionClassNames } from '@blockera/classnames';

/**
 * Internal dependencies
 */
import { OtherNavigation } from './navigation/other-navigation';
import { GeneralNavigation } from './navigation/general-navigation';
import { GlobalStylesNavigation } from './navigation/global-styles-navigation';
import { DesignSystemNavigation } from './navigation/design-system-navigation';

export const BlockeraGlobalStylesNavigation = (): MixedElement => {
	const [backButton, setBackButton] = useState(null);
	const [isOpenCustomCss, setIsOpenCustomCss] = useState(false);
	const openCallback = (action: 'open-custom-css-panel') => {
		setTimeout(() => {
			setBackButton(
				document.querySelector('.blockera-extension-back-navigation')
			);
		}, 100);
		document
			.querySelector('.edit-site-global-styles-screen-root')
			?.classList?.add('is-open-blockera-navigation');

		switch (action) {
			case 'open-custom-css-panel':
				setIsOpenCustomCss(true);
				break;
			default:
				break;
		}
	};
	const closeCallback = useCallback(() => {
		document
			.querySelector('.edit-site-global-styles-screen-root')
			?.classList?.remove('is-open-blockera-navigation');

		if (isOpenCustomCss) {
			setIsOpenCustomCss(false);
		}
	}, [isOpenCustomCss]);

	useEffect(() => {
		if (backButton) {
			backButton.addEventListener('click', closeCallback);
		}
	}, [backButton, closeCallback]);

	return (
		<div className="blockera-block-inspector-controls-wrapper">
			<Navigation className={extensionClassNames('navigation')}>
				<NavigationMenu
					className={extensionClassNames('navigation-category')}
				>
					<NavigationItem
						item="variations"
						onClick={() =>
							document
								.querySelector('button[id="/variations"]')
								?.click()
						}
						className={extensionClassNames('navigation-item')}
						navigateToMenu="variations"
						title={__('Browse styles', 'blockera')}
					/>
				</NavigationMenu>

				<DesignSystemNavigation />

				<GeneralNavigation />

				<GlobalStylesNavigation />

				<OtherNavigation
					openCallback={openCallback}
					isOpenCustomCss={isOpenCustomCss}
				/>
			</Navigation>
		</div>
	);
};
