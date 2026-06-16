// @flow

/**
 * External dependencies
 */
import type { MixedElement } from 'react';
import { useEffect, useMemo, useState } from '@wordpress/element';
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
import Modal from '../../modal';
import Popover from '../../popover';
import type { PopoverPlacement } from '../../popover/types/index';
import { Button } from '../../button';
import { Icon } from '@blockera/icons';
import type {
	LockedFeatureSpec,
	ProHighlightSpec,
	UpgradePromptProductId,
} from '../types';
import { getUpgradePromptProductChrome } from '../products';
import { getSiteEditorDefaultProHighlights } from '../products/blockera-site-editor';
import { UpgradePromptChromeLeft } from './upgrade-prompt-chrome';
import { UpgradePromptContent } from './upgrade-prompt-content';

function resolveProHighlights(
	product: UpgradePromptProductId,
	proHighlights?: Array<ProHighlightSpec>
): Array<ProHighlightSpec> {
	if (proHighlights && proHighlights.length > 0) {
		return proHighlights;
	}
	switch (product) {
		case 'blockera-site-editor':
		default:
			return getSiteEditorDefaultProHighlights();
	}
}

function resolveLockedFeature(
	lockedFeature?: ?LockedFeatureSpec | null,
	heading?: string,
	description?: string | MixedElement,
	icon?: string | MixedElement
): ?LockedFeatureSpec {
	if (lockedFeature === null) {
		return null;
	}
	if (lockedFeature && lockedFeature.title) {
		return lockedFeature;
	}
	if (heading) {
		const fromHeading: LockedFeatureSpec = { title: heading };
		if (description !== undefined && description !== null) {
			fromHeading.description = description;
		}
		if (icon !== undefined && icon !== null) {
			fromHeading.icon = icon;
		}
		return fromHeading;
	}
	return null;
}

export const UpgradePrompt = ({
	product = 'blockera-site-editor',
	title = __('Premium feature', 'blockera'),
	design,
	icon,
	heading,
	description,
	featuresList: _featuresList,
	lockedFeature: lockedFeatureProp,
	proHighlights: proHighlightsProp,
	disableHintsText,
	onClose,
	buttonURL,
	buttonText,
	buttonTarget,
	isOpen: _isOpen,
	placement = 'left-start',
	type = 'popover',
	anchor,
	'data-test': dataTest,
	...props
}: {
	product?: UpgradePromptProductId,
	title?: string,
	design?: 'light' | 'dark',
	icon?: string | MixedElement,
	heading?: string,
	description?: string | MixedElement,
	featuresList?: Array<string>,
	lockedFeature?: ?LockedFeatureSpec,
	proHighlights?: Array<ProHighlightSpec>,
	disableHintsText?: string | MixedElement | false,
	onClose: () => void,
	buttonURL?: string,
	buttonText?: string,
	buttonTarget?: string,
	isOpen?: boolean,
	'data-test'?: string,
	placement?: PopoverPlacement,
	type?: 'popover' | 'modal',
	anchor?: HTMLElement,
}): MixedElement => {
	const [isOpen, setOpen] = useState(_isOpen);

	useEffect(() => setOpen(_isOpen), [_isOpen]);

	const { OfferPill, RightColumn } = useMemo(
		() => getUpgradePromptProductChrome(product),
		[product]
	);

	const lockedFeature = useMemo(
		() =>
			resolveLockedFeature(lockedFeatureProp, heading, description, icon),
		[lockedFeatureProp, heading, description, icon]
	);

	const proHighlights = useMemo(
		() => resolveProHighlights(product, proHighlightsProp),
		[product, proHighlightsProp]
	);

	const featureLockedLabel = lockedFeature?.title || title;

	if (!isOpen) {
		return <></>;
	}

	const handleClose = () => {
		onClose();
		setOpen(false);
	};

	const content = (
		<UpgradePromptContent
			design={design}
			lockedFeature={lockedFeature}
			proHighlights={proHighlights}
			disableHintsText={disableHintsText}
			buttonURL={buttonURL}
			buttonText={buttonText}
			buttonTarget={buttonTarget}
		/>
	);

	if (type === 'modal') {
		return (
			<Modal
				onRequestClose={handleClose}
				className={componentClassNames('upgrade-prompt')}
				data-test={dataTest}
				{...props}
			>
				<div
					className={componentInnerClassNames(
						'upgrade-prompt-modal-root'
					)}
				>
					<div
						className={componentInnerClassNames(
							'upgrade-prompt-modal-topbar'
						)}
					>
						<UpgradePromptChromeLeft
							featureLockedLabel={featureLockedLabel}
						/>
						<div
							className={componentInnerClassNames(
								'upgrade-prompt-modal-topbar__actions'
							)}
						>
							<OfferPill />

							<Button
								className={componentInnerClassNames(
									'upgrade-prompt-modal-close'
								)}
								size="extra-small"
								align="center"
								onClick={handleClose}
								tabIndex="-1"
								label={__('Close', 'blockera')}
								aria-label={__('Close', 'blockera')}
								tooltipPosition="top"
								showTooltip={true}
								variant="tertiary-on-hover"
							>
								<Icon icon="close" iconSize="16" />
							</Button>
						</div>
					</div>

					<div
						className={componentInnerClassNames(
							'upgrade-prompt-modal-grid'
						)}
					>
						<div
							className={componentInnerClassNames(
								'upgrade-prompt-modal-grid__left'
							)}
						>
							{content}
						</div>
						<div
							className={componentInnerClassNames(
								'upgrade-prompt-modal-grid__right'
							)}
						>
							<RightColumn />
						</div>
					</div>
				</div>
			</Modal>
		);
	}

	return (
		<Popover
			placement={placement}
			anchor={anchor}
			title={
				<UpgradePromptChromeLeft
					featureLockedLabel={featureLockedLabel}
				/>
			}
			titleButtonsRight={<OfferPill />}
			onClose={handleClose}
			className={componentClassNames('upgrade-prompt')}
			data-test={dataTest}
			{...props}
		>
			{content}
		</Popover>
	);
};
