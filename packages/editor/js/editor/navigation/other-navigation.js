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
					<Icon icon="extension-advanced" iconSize={22} />
					{__('Other', 'blockera')}
				</Flex>
			</h2>
			<NavItemButton
				className={navItemClassName({
					'custom-css-button': true,
				})}
				id={'custom-css-button'}
				path={'css'}
				icon={
					<Flex
						alignItems="center"
						justifyContent="center"
						style={{ width: '22px', height: '22px' }}
					>
						<Icon icon="custom-css" iconSize={22} />
					</Flex>
				}
				label={__('Custom CSS', 'blockera')}
			/>
			<NavItemButton
				className={navItemClassName({ 'coming-soon': true })}
				id={'html-js-codes-button'}
				path={'html-js-codes'}
				icon={
					<Flex
						alignItems="center"
						justifyContent="center"
						style={{ width: '22px', height: '22px' }}
					>
						<Icon icon="javascript-codes" iconSize={22} />
					</Flex>
				}
				label={__('HTML & JS Codes', 'blockera')}
				isComingSoon={true}
			/>
			<NavItemButton
				className={navItemClassName({ 'coming-soon': true })}
				id={'back-to-top-button'}
				path={'back-to-top'}
				icon={
					<Flex
						alignItems="center"
						justifyContent="center"
						style={{ width: '22px', height: '22px' }}
					>
						<Icon icon="back-to-top" iconSize={22} />
					</Flex>
				}
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
					backLabel={__('Custom CSS', 'blockera')}
					closeCallback={closeCallback}
				/>
			</div>

			<Flex direction="column" gap="20px">
				<Flex
					gap="4px"
					direction="column"
					className="edit-site-global-styles-header__description"
					style={{ marginTop: '10px' }}
				>
					<p style={{ marginBottom: '0' }}>
						{__(
							'Add your own CSS to customize the appearance and layout of your site.',
							'blockera'
						)}
					</p>

					<a
						href="https://developer.wordpress.org/advanced-administration/wordpress/css/"
						target="_blank"
						rel="external noreferrer noopener"
					>
						<Flex alignItems="center" gap="4px">
							{__('Learn more about CSS', 'blockera')}
							<Icon
								library={'ui'}
								icon={'arrow-new-tab'}
								iconSize={22}
								style={{
									fill: 'currentColor',
								}}
							/>
						</Flex>
					</a>
				</Flex>

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
			</Flex>
		</NavItemScreen>
	);
};

OtherNavigation.Screens = Screens;
