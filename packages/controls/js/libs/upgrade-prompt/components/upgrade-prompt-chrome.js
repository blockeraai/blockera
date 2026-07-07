// @flow

/**
 * External dependencies
 */
import type { MixedElement } from 'react';
import { __ } from '@wordpress/i18n';

/**
 * Blockera dependencies
 */
import { componentInnerClassNames } from '@blockera/classnames';
import { Icon } from '@blockera/icons';

export function UpgradePromptChromeLeft({
	featureLockedLabel,
}: {
	featureLockedLabel: string,
}): MixedElement {
	return (
		<div
			className={componentInnerClassNames('upgrade-prompt-chrome__left')}
		>
			<span
				className={componentInnerClassNames(
					'upgrade-prompt-chrome__pro-badge'
				)}
			>
				<Icon icon="blockera" iconSize="16" library="blockera" />
				PRO
			</span>

			<span
				className={componentInnerClassNames(
					'upgrade-prompt-chrome__locked'
				)}
			>
				{__('Feature locked:', 'blockera')}{' '}
				<strong>{featureLockedLabel}</strong>
			</span>
		</div>
	);
}
