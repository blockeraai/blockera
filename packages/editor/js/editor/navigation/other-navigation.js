// @flow

/**
 * External dependencies
 */
import { select } from '@wordpress/data';
import { type MixedElement } from 'react';
import { __, sprintf } from '@wordpress/i18n';
import { useEntityProp } from '@wordpress/core-data';

/**
 * Blockera dependencies
 */
import {
	Flex,
	CodeControl,
	DynamicHtmlFormatter,
	ControlContextProvider,
} from '@blockera/controls';
import { Icon } from '@blockera/icons';
import { mergeObject } from '@blockera/utils';
import { extensionClassNames } from '@blockera/classnames';

/**
 * Internal dependencies
 */
import { NavItemButton } from './nav-item-button';
import { NavItemScreen } from './nav-item-screen';
import { navItemClassName } from './nav-item-classname';
import { NavItemBackButton } from './nav-item-back-button';
import { initPath } from './blockera-global-styles-navigation';

export const OtherNavigation = (): MixedElement => {
	return (
		<div className={extensionClassNames('navigation-category')}>
			<h2>
				<Flex alignItems="center" justifyContent="flex-start">
					<Icon icon="extension-advanced" iconSize={20} />
					{__('Other', 'blockera')}
				</Flex>
			</h2>
			<NavItemButton
				className={navItemClassName({
					'custom-css-button': true,
				})}
				id={'custom-css-button'}
				path={'css'}
				icon={<Icon icon="custom-css" iconSize={20} />}
				label={__('Custom CSS', 'blockera')}
			/>
			<NavItemButton
				className={navItemClassName({ 'coming-soon': true })}
				id={'html-js-codes-button'}
				path={'html-js-codes'}
				icon={<Icon icon="javascript-codes" iconSize={20} />}
				label={__('HTML & JS Codes', 'blockera')}
				isComingSoon={true}
			/>
			<NavItemButton
				className={navItemClassName({ 'coming-soon': true })}
				id={'back-to-top-button'}
				path={'back-to-top'}
				icon={<Icon icon="back-to-top" iconSize={20} />}
				label={__('Back To Top Button', 'blockera')}
				isComingSoon={true}
			/>
		</div>
	);
};

const Screens = ({
	closeCallback,
}: {
	closeCallback: () => void,
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
		<NavItemScreen path={`${initPath}css`}>
			<div className="blockera-navigation-panel">
				<NavItemBackButton
					backLabel={__('Other', 'blockera')}
					closeCallback={closeCallback}
				/>
			</div>
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
						aria-label={__('(opens in a new tab)', 'blockera')}
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
									/* translators: %1$s: CSS selector placeholder for body element, %2$s: CSS selector placeholder for group block */
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
		</NavItemScreen>
	);
};

OtherNavigation.Screens = Screens;
