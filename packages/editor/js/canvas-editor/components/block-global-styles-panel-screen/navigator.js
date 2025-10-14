// @flow

/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import { type MixedElement } from 'react';
import {
	__experimentalSpacer as Spacer,
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

export const BlockeraGlobalStylesNavigator = (): MixedElement => {
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
						className={extensionClassNames('navigation-item', {
							inRoot: true,
						})}
						navigateToMenu="variations"
						title={__('Browse Styles', 'blockera')}
					/>
				</NavigationMenu>
				<NavigationMenu
					title={
						<>
							<Icon icon="design-system-category" size={20} />
							{__('Design system', 'blockera')}
						</>
					}
					className={extensionClassNames('navigation-category')}
				>
					<NavigationItem
						item="typography"
						onClick={() =>
							document
								.querySelector('button[id="/typography"]')
								?.click()
						}
						className={extensionClassNames('navigation-item')}
						navigateToMenu="typography"
						title={__('Typography', 'blockera')}
						icon={<Icon icon="wp-typography" size={20} />}
					/>
					<NavigationItem
						item="colors"
						onClick={() =>
							document
								.querySelector('button[id="/colors"]')
								?.click()
						}
						className={extensionClassNames('navigation-item')}
						navigateToMenu="colors"
						title={__('Colors', 'blockera')}
						icon={<Icon icon="wp-colors" size={20} />}
					/>
					<NavigationItem
						item="background"
						onClick={() =>
							document
								.querySelector('button[id="/background"]')
								?.click()
						}
						className={extensionClassNames('navigation-item')}
						navigateToMenu="background"
						title={__('Background', 'blockera')}
						icon={<Icon icon="wp-background" size={20} />}
					/>
					<NavigationItem
						item="shadows"
						onClick={() =>
							document
								.querySelector('button[id="/shadows"]')
								?.click()
						}
						className={extensionClassNames('navigation-item')}
						navigateToMenu="shadows"
						title={__('Shadows', 'blockera')}
						icon={<Icon icon="wp-shadows" size={20} />}
					/>
				</NavigationMenu>
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
							document
								.querySelector('button[id="/layout"]')
								?.click()
						}
						className={extensionClassNames('navigation-item')}
						navigateToMenu="layout"
						title={__('Layout', 'blockera')}
						icon={<Icon icon="wp-layout" size={20} />}
					/>
				</NavigationMenu>
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
							document
								.querySelector('button[id="/blocks"]')
								?.click()
						}
						className={extensionClassNames('navigation-item', {
							inRoot: true,
						})}
						navigateToMenu="blocks"
						title={__('Block Style Variations', 'blockera')}
						icon={
							<Icon icon="style-variations-animated" size={20} />
						}
					/>
				</NavigationMenu>
				<NavigationMenu
					title={
						<>
							<Icon icon="other-category" size={20} />
							{__('Other', 'blockera')}
						</>
					}
					className={extensionClassNames('navigation-category')}
				>
					<NavigationItem
						item="css"
						onClick={() => openCallback('open-custom-css-panel')}
						className={extensionClassNames('navigation-item', {
							'custom-css-button': true,
						})}
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
					<div>
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
					</div>
				)}
			</Navigation>
		</div>
	);
};
