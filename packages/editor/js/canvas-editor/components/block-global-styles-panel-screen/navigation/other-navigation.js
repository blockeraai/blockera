// @flow

/**
 * External dependencies
 */
import { __, sprintf } from '@wordpress/i18n';
import { select } from '@wordpress/data';
import { type MixedElement } from 'react';
import {
	__experimentalNavigationMenu as NavigationMenu,
	__experimentalNavigationItem as NavigationItem,
} from '@wordpress/components';
import { useEntityProp } from '@wordpress/core-data';

/**
 * Blockera dependencies
 */
import { Icon } from '@blockera/icons';
import { mergeObject } from '@blockera/utils';
import { extensionClassNames } from '@blockera/classnames';
import {
	ControlContextProvider,
	CodeControl,
	DynamicHtmlFormatter,
} from '@blockera/controls';

export const OtherNavigation = ({
	openCallback,
	isOpenCustomCss,
}: {
	openCallback: (action: 'open-custom-css-panel') => void,
	isOpenCustomCss: boolean,
}): MixedElement => {
	const { __experimentalGetCurrentGlobalStylesId } = select('core');
	const postId = __experimentalGetCurrentGlobalStylesId();
	const [globalStyles, setGlobalStyles] = useEntityProp(
		'root',
		'globalStyles',
		'styles',
		postId
	);

	return (
		<>
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
						'hide-caret': true,
					})}
					navigateToMenu="css"
					title={__('Custom CSS', 'blockera')}
					icon={<Icon icon="custom-css" size={20} />}
				/>
				<NavigationItem
					item="css"
					className={extensionClassNames('navigation-item', {
						'coming-soon': true,
						'hide-caret': true,
					})}
					navigateToMenu="css"
					title={
						<>
							<span>{__('HTML & JS Codes', 'blockera')}</span>
							<span className="coming-soon">
								{__('Soon', 'blockera')}
							</span>
						</>
					}
					icon={<Icon icon="javascript-codes" size={20} />}
				/>
				<NavigationItem
					item="css"
					className={extensionClassNames('navigation-item', {
						'coming-soon': true,
						'hide-caret': true,
					})}
					navigateToMenu="css"
					title={
						<>
							<span>{__('Back To Top Button', 'blockera')}</span>
							<span className="coming-soon">
								{__('Soon', 'blockera')}
							</span>
						</>
					}
					icon={<Icon icon="back-to-top" size={20} />}
				/>
			</NavigationMenu>

			<NavigationMenu
				menu="css"
				parentMenu="root"
				className={extensionClassNames('back-navigation')}
				backButtonLabel={__('Custom CSS', 'blockera')}
			/>

			{isOpenCustomCss && (
				<>
					<p className="edit-site-global-styles-header__description">
						{__(
							'Add your own CSS to customize the appearance and layout of your site.',
							'blockera'
						)}
						<br />
						<a
							className="components-external-link edit-site-global-styles-screen-css-help-link"
							href="https://developer.wordpress.org/advanced-administration/wordpress/css/"
							target="_blank"
							rel="external noreferrer noopener"
						>
							<span className="components-external-link__contents">
								{__('Learn more about CSS', 'blockera')}
							</span>

							<span
								className="components-external-link__icon"
								aria-label={__(
									'(opens in a new tab)',
									'blockera'
								)}
							>
								↗
							</span>
						</a>
					</p>

					<ControlContextProvider
						value={{
							name: 'custom-css',
							value: globalStyles?.css || '',
						}}
					>
						<CodeControl
							label={__('Additional CSS Code', 'blockera')}
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
							onChange={(newValue: string): void => {
								setGlobalStyles(
									mergeObject(globalStyles, {
										css: newValue,
									})
								);
							}}
							editable={true}
							defaultValue={''}
							height={400}
							suggestionsType="site"
							placeholder={
								<>
									body {'{'}
									<br />
									&nbsp;&nbsp;&nbsp;{'/* Your CSS here */'}
									<br />
									{'}'}
								</>
							}
							description={
								<p>
									<DynamicHtmlFormatter
										text={sprintf(
											/* translators: $1%s is a CSS selector, $2%s is ID. */
											__(
												'Use %1$s to target the body element or %2$s to target the group block.',
												'blockera'
											),
											'{body}',
											'{group}'
										)}
										replacements={{
											body: <code>body</code>,
											group: <code>.wp-block-group</code>,
										}}
									/>
								</p>
							}
						/>
					</ControlContextProvider>
				</>
			)}
		</>
	);
};
