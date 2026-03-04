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
import { OtherNavigation } from './other-navigation';
import { GeneralNavigation } from './general-navigation';
import { GlobalStylesNavigation } from './global-styles-navigation';
import { DesignSystemNavigation } from './design-system-navigation';

const wpRootClassname = '.edit-site-global-styles-screen-root';
const overrideClassname = 'is-open-blockera-navigation-override';
const blockeraNavPanelClassname = 'is-open-blockera-navigation-panel';

export const BlockeraGlobalStylesNavigation = ({
	className,
}: {
	className: string,
}): MixedElement => {
	const [backButton, setBackButton] = useState(null);
	const [isOpenCustomCss, setIsOpenCustomCss] = useState(false);
	const openCallback = (
		action: 'open-custom-css-panel' | 'default' = 'default'
	) => {
		setTimeout(() => {
			setBackButton(
				document.querySelector('.blockera-extension-back-navigation')
			);
		}, 100);

		switch (action) {
			case 'open-custom-css-panel':
				document
					.querySelector(wpRootClassname)
					?.classList?.add(overrideClassname);
				setIsOpenCustomCss(true);
				break;
			default:
				document
					.querySelector(wpRootClassname)
					?.classList.add(blockeraNavPanelClassname);
				break;
		}
	};
	const closeCallback = useCallback(() => {
		document
			.querySelector(wpRootClassname)
			?.classList?.remove(overrideClassname);
		document
			.querySelector(wpRootClassname)
			?.classList?.remove(blockeraNavPanelClassname);

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

				<DesignSystemNavigation openCallback={openCallback} />

				<GeneralNavigation />

				<GlobalStylesNavigation className={className} />

				<OtherNavigation
					openCallback={openCallback}
					isOpenCustomCss={isOpenCustomCss}
				/>
			</Navigation>
		</div>
	);
};
