// @flow

/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import { type MixedElement } from 'react';
import { useCallback, useEffect, useRef } from '@wordpress/element';
import {
	__experimentalNavigationMenu as NavigationMenu,
	__experimentalNavigationItem as NavigationItem,
} from '@wordpress/components';

/**
 * Blockera dependencies
 */
import { Icon } from '@blockera/icons';
import {
	extensionClassNames,
	extensionInnerClassNames,
} from '@blockera/classnames';

const BACK_BUTTON_SELECTOR = '.components-heading';
const BLOCKS_BUTTON_SELECTOR = 'button[id="/blocks"]';
const RETRY_INTERVAL_MS = 100;
const MAX_RETRY_ATTEMPTS = 30;

const getBackButton = (): ?HTMLButtonElement => {
	const backElement = document.querySelector(BACK_BUTTON_SELECTOR);
	return (
		backElement?.parentElement?.parentElement?.querySelector('button') ??
		null
	);
};

export const GlobalStylesNavigation = ({
	className,
}: {
	className: string,
}): MixedElement => {
	const retryTimeoutRef = useRef<?TimeoutID>(null);
	const cleanupRef = useRef<() => void>(() => {});

	const removeBodyStyles = useCallback(() => {
		document.body?.classList?.remove(className);
		document.body?.removeAttribute('data-test');
	}, [className]);

	cleanupRef.current = removeBodyStyles;

	const handleBlocksClick = useCallback(() => {
		document.body?.classList?.add(className);
		document.body?.setAttribute('data-test', className);
		document.querySelector(BLOCKS_BUTTON_SELECTOR)?.click();

		const attachBackButtonListener = (): boolean => {
			const backButton = getBackButton();
			if (
				backButton &&
				'Navigator.BackButton' ===
					backButton.getAttribute('data-wp-component')
			) {
				const handler = () => {
					cleanupRef.current();
				};
				backButton.addEventListener('click', handler, { once: true });
				return true;
			}
			return false;
		};

		let attempts = 0;
		const tryAttach = () => {
			if (attachBackButtonListener() || attempts >= MAX_RETRY_ATTEMPTS) {
				return;
			}

			attempts += 1;
			retryTimeoutRef.current = setTimeout(tryAttach, RETRY_INTERVAL_MS);
		};

		retryTimeoutRef.current = setTimeout(tryAttach, RETRY_INTERVAL_MS);
	}, [className]);

	useEffect(() => {
		return () => {
			if (retryTimeoutRef.current) {
				clearTimeout(retryTimeoutRef.current);
				retryTimeoutRef.current = null;
			}
		};
	}, []);

	return (
		<NavigationMenu
			title={
				<>
					<Icon icon="extension-style-variations" iconSize={20} />
					{__('Global Styles', 'blockera')}
				</>
			}
			className={extensionClassNames('navigation-category')}
		>
			<p
				className={extensionInnerClassNames(
					'navigation-category-description'
				)}
			>
				{__(
					'Customize the appearance of specific blocks for the whole site.',
					'blockera'
				)}
			</p>

			<NavigationItem
				item="blocks"
				data-test="block-style-variations"
				onClick={handleBlocksClick}
				className={extensionClassNames('navigation-item')}
				navigateToMenu="blocks"
				title={__('Block Style Variations', 'blockera')}
				icon={<Icon icon="style-variations" iconSize={20} />}
			/>
		</NavigationMenu>
	);
};
