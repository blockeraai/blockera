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
import type { LockedFeatureSpec, ProHighlightSpec } from '../types';
import { SITE_EDITOR_DEFAULT_UPGRADE_URL } from '../products/blockera-site-editor';
import Flex from '../../flex';
import { LockedFeatureShowcase } from './locked-feature-showcase';
import { ProHighlightsList } from './pro-highlights-list';
import DynamicHtmlFormatter from '../../dynamic-html-formatter';

const defaultDisableHintsText = __(
	'You can disable the Pro hints in the settings panel.',
	'blockera'
);

export function UpgradePromptContent({
	lockedFeature,
	proHighlights,
	promoterHeadline,
	disableHintsText,
	buttonURL,
	buttonText,
	buttonTarget,
	design = 'light',
}: {
	lockedFeature: ?LockedFeatureSpec,
	proHighlights: Array<ProHighlightSpec>,
	promoterHeadline?: string,
	disableHintsText?: string | MixedElement | false,
	buttonURL?: string,
	buttonText?: string,
	buttonTarget?: string,
	design?: 'light' | 'dark' | 'minimal',
}): MixedElement {
	const ctaHref = buttonURL ?? SITE_EDITOR_DEFAULT_UPGRADE_URL;
	const ctaLabel = buttonText ?? __('Upgrade with 15% off', 'blockera');
	const target = buttonTarget ?? '_blank';

	const hintsResolved =
		disableHintsText === undefined
			? defaultDisableHintsText
			: disableHintsText;

	let mainHeadingText = sprintf(
		/* translators: %s: is "Blockera Pro" (required) */
		__('Unlock the full block editor experience with %s', 'blockera'),
		'{blockera-pro}'
	);

	// the %s should not skipped!
	if (!mainHeadingText.includes('{brand-name}')) {
		mainHeadingText = __(
			'Unlock the full block editor experience with {blockera-pro}',
			'blockera'
		);
	}

	const headline = promoterHeadline || mainHeadingText;

	return (
		<Flex
			className={componentClassNames(
				'upgrade-prompt-content',
				'design-' + design
			)}
			direction="column"
			alignItems="stretch"
			justifyContent="flex-start"
			gap="20px"
		>
			<Flex direction="column" gap="22px">
				<h2
					className={componentInnerClassNames(
						'upgrade-prompt-content__heading'
					)}
				>
					<DynamicHtmlFormatter
						text={headline}
						replacements={{
							'blockera-pro': <strong>Blockera Pro</strong>,
						}}
					/>
				</h2>

				{lockedFeature && lockedFeature.title ? (
					<LockedFeatureShowcase lockedFeature={lockedFeature} />
				) : null}
			</Flex>

			<ProHighlightsList highlights={proHighlights} />

			<Flex direction="column" gap="10px">
				<div
					className={componentInnerClassNames(
						'upgrade-prompt-content__trust'
					)}
				>
					<Icon icon="shield-checked" library="ui" iconSize="22" />

					<span>
						{__(
							'30-day money back — no questions asked',
							'blockera'
						)}
					</span>
				</div>

				{ctaHref ? (
					<a
						className={componentInnerClassNames(
							'upgrade-prompt-content__cta',
							'components-button',
							'blockera-component-button',
							'is-primary'
						)}
						href={ctaHref}
						target={target}
						rel="noreferrer"
					>
						{ctaLabel}
						<span aria-hidden="true"> →</span>
					</a>
				) : null}

				{hintsResolved !== false &&
				hintsResolved !== '' &&
				hintsResolved !== null &&
				hintsResolved !== undefined ? (
					<div
						className={componentInnerClassNames(
							'upgrade-prompt-content__hints',
							'disable-pro-hints'
						)}
					>
						{hintsResolved}
					</div>
				) : null}
			</Flex>
		</Flex>
	);
}
