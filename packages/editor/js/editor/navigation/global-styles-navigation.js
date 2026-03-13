// @flow

/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import { type MixedElement } from 'react';
import { Navigator } from '@wordpress/components';
import { useCallback, useEffect, useRef } from '@wordpress/element';

/**
 * Blockera dependencies
 */
import { Icon } from '@blockera/icons';
import {
	classNames,
	extensionClassNames,
	extensionInnerClassNames,
} from '@blockera/classnames';
import { Flex } from '@blockera/controls';

/**
 * Internal dependencies
 */
import { NavItemWrapper } from './nav-item-wrapper';
import { navItemClassName } from './nav-item-classname';
import { initPath } from './blockera-global-styles-navigation';

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
		<div
			className={classNames(
				extensionClassNames('navigation-category'),
				extensionClassNames('global-styles-navigation')
			)}
		>
			<h2>
				<Flex alignItems="center" justifyContent="flex-start">
					<Icon icon="extension-style-variations" iconSize={20} />
					{__('Global Styles', 'blockera')}
				</Flex>
			</h2>
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

			<NavItemWrapper
				className={navItemClassName({ 'navigation-item': true })}
			>
				<Navigator.Button
					id="block-style-variations"
					path={`${initPath}block-style-variations`}
					data-test="block-style-variations"
					onClick={handleBlocksClick}
					icon={<Icon icon="style-variations" iconSize={20} />}
				>
					<Flex
						alignItems="center"
						justifyContent="space-between"
						className={extensionClassNames('navigation-item')}
					>
						{__('Block Style Variations', 'blockera')}
						<Icon icon="chevron-right" library="wp" />
					</Flex>
				</Navigator.Button>
			</NavItemWrapper>
		</div>
	);
};
