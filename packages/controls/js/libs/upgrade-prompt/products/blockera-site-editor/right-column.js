// @flow

/**
 * External dependencies
 */
import type { MixedElement } from 'react';
import { __, sprintf } from '@wordpress/i18n';

/**
 * Blockera dependencies
 */

import {
	componentClassNames,
	componentInnerClassNames,
} from '@blockera/classnames';
import { Icon } from '@blockera/icons';

/**
 * Internal dependencies
 */
import { Flex, DynamicHtmlFormatter } from '../../../index';
import AvatarAdem from './images/adem-bagci.png';
import AvatarDaniel from './images/daniel-weaver.png';
import Star from './icons/star.svg';
import Logo from './icons/logo.svg';

export function SiteEditorUpgradeRightColumn(): MixedElement {
	return (
		<div
			className={componentClassNames('upgrade-prompt-site-editor-right')}
		>
			<div
				className={componentInnerClassNames(
					'upgrade-prompt-site-editor-right__brand'
				)}
			>
				<Logo />
			</div>

			<Flex direction="column" gap="10px">
				<div
					className={componentInnerClassNames(
						'upgrade-prompt-site-editor-right__rating'
					)}
				>
					<span aria-hidden="true">
						<Star />
						<Star />
						<Star />
						<Star />
						<Star />
					</span>
					<span>
						<DynamicHtmlFormatter
							text={sprintf(
								/* translators: %1$s is the rating, %2$s is the wordpress.org link */
								__('%1$s on %2$s', 'blockera'),
								'{rating}',
								'{wordpress-org}'
							)}
							replacements={{
								rating: <strong>4.9</strong>,
								'wordpress-org': (
									<a
										href="https://wordpress.org/support/plugin/blockera/reviews/"
										target="_blank"
										rel="noopener noreferrer"
									>
										{__('WordPress.org', 'blockera')}
									</a>
								),
							}}
						/>
					</span>
				</div>

				<div
					className={componentInnerClassNames(
						'upgrade-prompt-site-editor-right__testimonials'
					)}
				>
					<div
						className={componentInnerClassNames(
							'upgrade-prompt-site-editor-right__card'
						)}
					>
						<Flex direction="column" gap="6px">
							<p
								className={componentInnerClassNames(
									'upgrade-prompt-site-editor-right__quote'
								)}
							>
								{__(
									'“This is how Gutenberg should be.”',
									'blockera'
								)}
							</p>

							<p
								className={componentInnerClassNames(
									'upgrade-prompt-site-editor-right__quote-sub'
								)}
							>
								{__(
									'I wonder how much time and effort taken on this plugin and how perfect it is.',
									'blockera'
								)}
							</p>
						</Flex>

						<div
							className={componentInnerClassNames(
								'upgrade-prompt-site-editor-right__author'
							)}
						>
							<div
								className={componentInnerClassNames(
									'upgrade-prompt-site-editor-right__avatar'
								)}
							>
								<img src={AvatarAdem} alt="Adem Bagci" />
							</div>

							<div>
								<strong>Adem Bagci</strong>
								<div
									className={componentInnerClassNames(
										'upgrade-prompt-site-editor-right__role'
									)}
								>
									{__('WordPress Web Designer', 'blockera')}
								</div>
							</div>

							<a
								href="https://wordpress.org/support/topic/the-powerful-block-based-page-builder/"
								target="_blank"
								rel="noopener noreferrer"
								className={componentInnerClassNames(
									'upgrade-prompt-site-editor-right__wp-link'
								)}
							>
								<Icon
									icon="wordpress"
									library="wp"
									iconSize="20"
								/>
							</a>
						</div>
					</div>

					<div
						className={componentInnerClassNames(
							'upgrade-prompt-site-editor-right__card'
						)}
					>
						<Flex direction="column" gap="6px">
							<p
								className={componentInnerClassNames(
									'upgrade-prompt-site-editor-right__quote'
								)}
							>
								{__(
									'“Everything Gutenberg is missing.”',
									'blockera'
								)}
							</p>
							<p
								className={componentInnerClassNames(
									'upgrade-prompt-site-editor-right__quote-sub'
								)}
							>
								{__(
									'So many really well thought out additions to Gutenberg, on top of core blocks, which I’m a huge fan of.',
									'blockera'
								)}
							</p>
						</Flex>

						<div
							className={componentInnerClassNames(
								'upgrade-prompt-site-editor-right__author'
							)}
						>
							<div
								className={componentInnerClassNames(
									'upgrade-prompt-site-editor-right__avatar'
								)}
							>
								<img src={AvatarDaniel} alt="Daniel Weaver" />
							</div>

							<div>
								<strong>Daniel Weaver</strong>
								<div
									className={componentInnerClassNames(
										'upgrade-prompt-site-editor-right__role'
									)}
								>
									{__('Website Designer', 'blockera')}
								</div>
							</div>

							<a
								href="https://wordpress.org/support/topic/so-good-it-convinced-me-to-use-fse/"
								target="_blank"
								rel="noopener noreferrer"
								className={componentInnerClassNames(
									'upgrade-prompt-site-editor-right__wp-link'
								)}
							>
								<Icon
									icon="wordpress"
									library="wp"
									iconSize="20"
								/>
							</a>
						</div>
					</div>
				</div>
			</Flex>
		</div>
	);
}
