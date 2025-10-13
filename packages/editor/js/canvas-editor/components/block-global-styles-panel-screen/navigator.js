// @flow

/**
 * External dependencies
 */
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
import { Icon } from '@blockera/icons';
import { extensionClassNames } from '@blockera/classnames';
import { Flex, ControlContextProvider, CodeControl } from '@blockera/controls';

import { __ } from '@wordpress/i18n';

export const BlockeraGlobalStylesNavigator = ({
	className,
}: {
	className: string,
}): MixedElement => {
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
			<h2 className={className}>
				<Icon icon="other-category" size={20} />
				{__('Other', 'blockera')}
			</h2>
			<Navigation className={extensionClassNames('navigation')}>
				<NavigationMenu
					className={extensionClassNames('navigation-category')}
				>
					<NavigationItem
						item="css"
						onClick={() => openCallback('open-custom-css-panel')}
						className={extensionClassNames('navigation-item')}
						navigateToMenu="css"
						title={__('Custom Css', 'blockera')}
						icon={<Icon icon="custom-css" size={20} />}
					/>
					<NavigationItem
						item="css"
						className={extensionClassNames('navigation-item', {
							'coming-soon': true,
						})}
						navigateToMenu="css"
						title={
							<Flex
								className="full-width"
								justifyContent="space-between"
							>
								<span>
									{__('JavaScript Codes', 'blockera')}
								</span>
								<span className="coming-soon">
									{__('Coming soon', 'blockera')}
								</span>
							</Flex>
						}
						icon={<Icon icon="javascript-codes" size={20} />}
					/>
					<NavigationItem
						item="css"
						className={extensionClassNames('navigation-item', {
							'coming-soon': true,
						})}
						navigateToMenu="css"
						title={
							<Flex
								className="full-width"
								justifyContent="space-between"
							>
								<span>{__('Back to Top', 'blockera')}</span>
								<span className="coming-soon">
									{__('Coming soon', 'blockera')}
								</span>
							</Flex>
						}
						icon={<Icon icon="back-to-top" size={20} />}
					/>
					<NavigationItem
						item="css"
						className={extensionClassNames('navigation-item', {
							'coming-soon': true,
						})}
						navigateToMenu="css"
						title={
							<Flex
								className="full-width"
								justifyContent="space-between"
							>
								<span>{__('Website Frame', 'blockera')}</span>
								<span className="coming-soon">
									{__('Coming soon', 'blockera')}
								</span>
							</Flex>
						}
						icon={<Icon icon="website-frame" size={20} />}
					/>
					<NavigationItem
						item="css"
						className={extensionClassNames('navigation-item', {
							'coming-soon': true,
						})}
						navigateToMenu="css"
						title={
							<Flex
								className="full-width"
								justifyContent="space-between"
							>
								<span>{__('Cookie consent', 'blockera')}</span>
								<span className="coming-soon">
									{__('Coming soon', 'blockera')}
								</span>
							</Flex>
						}
						icon={<Icon icon="cookie-consent" size={20} />}
					/>
				</NavigationMenu>

				<NavigationMenu
					menu="css"
					parentMenu="root"
					className={extensionClassNames('back-navigation')}
					backButtonLabel={__('Back', 'blockera')}
				/>
				{isOpenCustomCss && (
					<Navigation>
						<p className="edit-site-global-styles-header__description">
							Add your own CSS to customize the appearance and
							layout of your site.
							<br />
							<a
								className="components-external-link edit-site-global-styles-screen-css-help-link"
								href="https://developer.wordpress.org/advanced-administration/wordpress/css/"
								target="_blank"
								rel="external noreferrer noopener"
							>
								<span className="components-external-link__contents">
									Learn more about CSS
								</span>
								<span
									className="components-external-link__icon"
									aria-label="(opens in a new tab)"
								>
									↗
								</span>
							</a>
						</p>
						<ControlContextProvider
							value={{
								name: 'custom-css',
								value: '',
							}}
						>
							<CodeControl
								label={__('Custom CSS Code', 'blockera')}
								labelDescription={
									<>
										<p>
											{__(
												'With this feature, you have the capability to apply custom CSS codes directly to this block, enabling you to tailor its style effortlessly.',
												'blockera'
											)}
										</p>
										<p>
											{__(
												'Once you input your CSS, the customization is automatically applied to the block.',
												'blockera'
											)}
										</p>
										<p>
											{__(
												'Simply use ".block" to target this specific block, and it will seamlessly convert to the correct selector for precise styling.',
												'blockera'
											)}
										</p>
									</>
								}
								onChange={() => {}}
								editable={true}
								defaultValue={''}
							/>
						</ControlContextProvider>
					</Navigation>
				)}
			</Navigation>
		</div>
	);
};
