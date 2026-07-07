// @flow

/**
 * External dependencies
 */
import type { MixedElement } from 'react';
import { __ } from '@wordpress/i18n';

/**
 * Blockera dependencies
 */
import {
	componentClassNames,
	componentInnerClassNames,
} from '@blockera/classnames';

/**
 * Internal dependencies
 */
import type {
	LockedFeatureSpec,
	ProHighlightSpec,
	UpgradePromptProductId,
} from '../types';
import { getSiteEditorDefaultProHighlights } from '../products/blockera-site-editor';
import Flex from '../../flex';
import { UpgradePromptChromeLeft } from './upgrade-prompt-chrome';
import { getUpgradePromptProductChrome } from '../products';
import { UpgradePromptContent } from './upgrade-prompt-content';

export const Promoter = ({
	showTopbar = true,
	product = 'blockera-site-editor',
	design = 'light',
	lockedFeature,
	proHighlights: proHighlightsProp,
	heading,
	description,
	icon,
	disableHintsText = __(
		'You can disable the Pro hints in the settings panel.',
		'blockera'
	),
	buttonURL,
	buttonText,
	buttonTarget,
	style,
	...props
}: {
	product?: UpgradePromptProductId,
	design?: 'light' | 'dark' | 'minimal',
	lockedFeature?: ?LockedFeatureSpec,
	proHighlights?: Array<ProHighlightSpec>,
	heading?: string,
	description?: string | MixedElement,
	icon?: string | MixedElement,
	disableHintsText?: string | MixedElement | false,
	buttonURL?: string,
	buttonText?: string,
	buttonTarget?: string,
	style?: Object,
	showTopbar?: boolean,
}): MixedElement => {
	const { OfferPill } = getUpgradePromptProductChrome(product);

	const showcase: ?LockedFeatureSpec =
		lockedFeature && lockedFeature.title ? lockedFeature : null;

	const proHighlights =
		proHighlightsProp && proHighlightsProp.length > 0
			? proHighlightsProp
			: getSiteEditorDefaultProHighlights();

	const promoterHeadline = heading;

	return (
		<Flex
			className={componentClassNames(
				'promoter',
				'upgrade-prompt-promoter-card',
				'design-' + design
			)}
			direction="column"
			alignItems="stretch"
			justifyContent="flex-start"
			gap="0"
			style={style}
			{...props}
		>
			{showTopbar && (
				<div
					className={componentInnerClassNames(
						'upgrade-prompt-promoter-card__topbar'
					)}
				>
					{showcase ? (
						<UpgradePromptChromeLeft
							featureLockedLabel={showcase.title}
						/>
					) : (
						<div
							className={componentInnerClassNames(
								'upgrade-prompt-promoter-card__brand'
							)}
						>
							<span
								className={componentInnerClassNames(
									'upgrade-prompt-chrome__pro-badge'
								)}
							>
								PRO
							</span>
							<span
								className={componentInnerClassNames(
									'upgrade-prompt-promoter-card__brand-text'
								)}
							>
								{heading ||
									__('Upgrade to Blockera Pro', 'blockera')}
							</span>
						</div>
					)}
					<OfferPill />
				</div>
			)}

			<div
				className={componentInnerClassNames(
					'upgrade-prompt-promoter-card__body'
				)}
			>
				<UpgradePromptContent
					design={design}
					lockedFeature={showcase}
					proHighlights={proHighlights}
					promoterHeadline={promoterHeadline}
					disableHintsText={disableHintsText}
					buttonURL={buttonURL}
					buttonText={buttonText}
					buttonTarget={buttonTarget}
				/>
			</div>
		</Flex>
	);
};
