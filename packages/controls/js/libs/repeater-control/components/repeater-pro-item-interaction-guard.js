// @flow
/**
 * External dependencies
 */
import { useState, type MixedElement } from 'react';
import { applyFilters } from '@wordpress/hooks';
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
import { MenuItem } from '../../';
import { CompanionPluginModal } from '../../feature-wrapper';
import { FEATURE_WRAPPER_TEST_ID } from '../../feature-wrapper/constants/testIds';
import {
	getArialLabelSuffix,
	shouldGateRepeaterItemHeaderForPromo,
} from '../utils';

const DEFAULT_UPGRADE_LINK =
	'https://blockera.ai/products/site-builder/upgrade/?utm_source=repeater-pro-item-guard&utm_medium=referral&utm_campaign=upgrade-feature-wrapper&utm_content=cta-link';

/**
 * Matches FeatureWrapper native/companion markup for gated repeater rows.
 * Theme-only → companion (blue). Companion plugin → Pro upgrade (red).
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
	const [isCompanionModalOpen, setIsCompanionModalOpen] = useState(false);

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

	const isCompanionPlugin = applyFilters(
		'blockera.products.isCompanionPlugin',
		false
	);
	const gateType = isCompanionPlugin ? 'native' : 'companion';
	const text = isCompanionPlugin
		? __('Upgrade to PRO', 'blockera')
		: __('Install Companion Plugin to Unlock', 'blockera');

	const notifyBlocked = (e: any) => {
		e.preventDefault();
		e.stopPropagation();
		onBlockedPointerInteraction?.(e);

		if (!isCompanionPlugin) {
			setIsCompanionModalOpen(true);
		}
	};

	const ariaLabel = isCompanionPlugin
		? sprintf(
				// translators: %s is the repeater item id.
				__('Upgrade to PRO — %s', 'blockera'),
				getArialLabelSuffix(itemId)
			)
		: sprintf(
				// translators: %s is the repeater item id.
				__('Install Companion Plugin to Unlock — %s', 'blockera'),
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

	const companionModal = !isCompanionPlugin ? (
		<CompanionPluginModal
			isOpen={isCompanionModalOpen}
			onRequestClose={() => setIsCompanionModalOpen(false)}
		/>
	) : null;

	if (actionButtonsType === 'menu') {
		return (
			<>
				<MenuItem
					onClick={notifyBlocked}
					className="blockera-block-menu-item"
				>
					<div
						className={componentClassNames(
							'feature-wrapper',
							`type-${gateType}`,
							'show-text-on-hover',
							'feature-wrapper--repeater-upgrade',
							'feature-wrapper--repeater-upgrade-menu'
						)}
						data-test={FEATURE_WRAPPER_TEST_ID.root(gateType)}
					>
						<div
							className={componentInnerClassNames(
								'feature-wrapper__notice',
								'is-clickable'
							)}
							data-test={
								'companion' === gateType
									? FEATURE_WRAPPER_TEST_ID.companionNotice
									: undefined
							}
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
				{companionModal}
			</>
		);
	}

	return (
		<>
			<div
				className={componentClassNames(
					'feature-wrapper',
					`type-${gateType}`,
					'show-text-' + showText,
					'feature-wrapper--repeater-upgrade',
					className
				)}
				data-test={FEATURE_WRAPPER_TEST_ID.root(gateType)}
			>
				<div
					className={componentInnerClassNames(
						'feature-wrapper__notice',
						'is-clickable'
					)}
					data-test={
						'companion' === gateType
							? FEATURE_WRAPPER_TEST_ID.companionNotice
							: undefined
					}
					role="button"
					tabIndex={0}
					aria-label={ariaLabel}
					onClick={notifyBlocked}
					onKeyDown={(e) => {
						if ('Enter' !== e.key && ' ' !== e.key) {
							return;
						}

						notifyBlocked(e);
					}}
				>
					{upgradeNoticeIcons}

					{isCompanionPlugin ? (
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
							aria-label={ariaLabel}
						>
							{text}
						</a>
					) : (
						<div
							className={componentInnerClassNames(
								'feature-wrapper__notice__text',
								'repeater-item-interaction-guard-text'
							)}
						>
							{text}
						</div>
					)}
				</div>
			</div>
			{companionModal}
		</>
	);
}
