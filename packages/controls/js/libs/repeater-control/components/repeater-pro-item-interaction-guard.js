// @flow
/**
 * External dependencies
 */
import { __, sprintf } from '@wordpress/i18n';
import type { MixedElement } from 'react';

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
import { MenuItem } from '../../';
import {
	getArialLabelSuffix,
	shouldGateRepeaterItemHeaderForPromo,
} from '../utils';

const DEFAULT_UPGRADE_LINK =
	'https://blockera.ai/products/site-builder/upgrade/?utm_source=repeater-pro-item-guard&utm_medium=referral&utm_campaign=upgrade-feature-wrapper&utm_content=cta-link';

/**
 * Matches FeatureWrapper native markup (pill + “Upgrade to PRO”).
 * Styled via `feature-wrapper`/`type-native` classes with repeater-scoped overrides.
 */
export function RepeaterProItemInteractionGuard({
	item,
	items,
	itemId,
	actionButtonsType = 'inline',
	upgradeLink = DEFAULT_UPGRADE_LINK,
	onBlockedPointerInteraction,
	className = '',
	showText = 'on-hover',
	enablePromoCountOnRepeaterItemHeader,
	isPromoActive,
}: {
	item: Object,
	items: Object,
	itemId: string,
	actionButtonsType?: 'inline' | 'menu',
	upgradeLink?: string,
	onBlockedPointerInteraction?: (e: any) => void,
	className?: string,
	showText?: 'on-hover' | 'always',
	enablePromoCountOnRepeaterItemHeader: boolean,
	isPromoActive: boolean,
}): MixedElement | null {
	if (
		!shouldGateRepeaterItemHeaderForPromo(
			itemId,
			item,
			items,
			enablePromoCountOnRepeaterItemHeader,
			isPromoActive
		)
	) {
		return null;
	}

	const text = __('Upgrade to PRO', 'blockera');

	const notifyBlocked = (e: any) => {
		e.preventDefault();
		e.stopPropagation();
		onBlockedPointerInteraction?.(e);
	};

	const ariaLabelUpgrade = sprintf(
		// translators: %s is the repeater item id.
		__('Upgrade to PRO — %s', 'blockera'),
		getArialLabelSuffix(itemId)
	);

	const icon = (
		<Icon
			icon="lock"
			iconSize="22"
			className={componentInnerClassNames(
				'feature-wrapper__notice__icon'
			)}
		/>
	);
	const icon2 = (
		<Icon
			icon="unlock"
			iconSize="22"
			className={componentInnerClassNames(
				'feature-wrapper__notice__icon-2'
			)}
		/>
	);

	const upgradeNoticeIcons = (
		<div
			className={componentInnerClassNames(
				'feature-wrapper__notice__icons',
				'icons-2',
				'repeater-item-interaction-guard-icons'
			)}
		>
			{icon}
			{icon2}
		</div>
	);

	if (actionButtonsType === 'menu') {
		return (
			<MenuItem
				onClick={notifyBlocked}
				className="blockera-block-menu-item"
			>
				<div
					className={componentClassNames(
						'feature-wrapper',
						'type-native',
						'show-text-on-hover',
						'feature-wrapper--repeater-upgrade',
						'feature-wrapper--repeater-upgrade-menu'
					)}
				>
					<div
						className={componentInnerClassNames(
							'feature-wrapper__notice',
							'is-clickable'
						)}
					>
						{upgradeNoticeIcons}

						<span
							className={componentInnerClassNames(
								'feature-wrapper__notice__text'
							)}
						>
							{text}
						</span>
					</div>
				</div>
			</MenuItem>
		);
	}

	return (
		<div
			className={componentClassNames(
				'feature-wrapper',
				'type-native',
				'show-text-' + showText,
				'feature-wrapper--repeater-upgrade',
				className
			)}
		>
			<div
				className={componentInnerClassNames(
					'feature-wrapper__notice',
					'is-clickable'
				)}
			>
				{upgradeNoticeIcons}

				<a
					href={upgradeLink}
					target="_blank"
					rel="noreferrer"
					className={componentInnerClassNames(
						'feature-wrapper__notice__text',
						'feature-wrapper__notice__text__link',
						'repeater-item-interaction-guard-text'
					)}
					onClick={notifyBlocked}
					aria-label={ariaLabelUpgrade}
				>
					{text}
				</a>
			</div>
		</div>
	);
}
