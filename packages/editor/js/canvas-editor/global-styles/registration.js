// @flow

/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import type { MixedElement } from 'react';
import { getBlockTypes } from '@wordpress/blocks';
import { registerPlugin } from '@wordpress/plugins';
import {
	memo,
	useMemo,
	Fragment,
	useEffect,
	createPortal,
} from '@wordpress/element';

/**
 * Blockera dependencies
 */
import { Icon } from '@blockera/icons';
import { extensionClassNames } from '@blockera/classnames';
import {
	isEquals,
	mergeObject,
	prependPortal,
	omitWithPattern,
} from '@blockera/utils';

/**
 * Internal dependencies
 */
import {
	BlockGlobalStylesPanelScreen,
	BlockeraGlobalStylesNavigator,
} from '../components';
import { sidebarListener, sidebarSelector } from './side-bar-listener';
import { sanitizeBlockAttributes } from '../../extensions/hooks/utils';
import { styleBookListener, styleBookSelector } from './style-book-listener';
import { IntersectionObserverRenderer } from '../intersection-observer-renderer';
import { GlobalStylesRenderer } from '../../extensions/components/global-styles-renderer';
import { useGlobalStylesContext } from '../components/block-global-styles-panel-screen/global-styles-provider';

export const registration = ({
	screen,
	blocksButton,
	blockScreenListItem,
	globalStylesScreen,
}: {
	screen: string,
	blocksButton: string,
	blockScreenListItem: string,
	globalStylesScreen: string,
}): void => {
	const blockTypes = getBlockTypes();

	registerPlugin('blockera-global-styles-navigation', {
		render() {
			// eslint-disable-next-line react-hooks/rules-of-hooks
			useEffect(() => {
				const className = extensionClassNames(
					'global-styles-navigation',
					{
						'navigation-category': true,
					}
				);
				new IntersectionObserverRenderer(
					'button[id="/typography"]',
					() => {
						return prependPortal(
							<h2 className={className}>
								<Icon icon="design-system-category" size={20} />
								{__('Design System', 'blockera')}
							</h2>,
							document.querySelector('button[id="/typography"]')
								?.parentElement?.parentElement,
							{
								className: 'no-margin-top',
							}
						);
					},
					{
						isRootComponent: true,
						targetElementIsRoot: true,
						componentSelector: '.blockera-styles-navigation',
					}
				);

				new IntersectionObserverRenderer(
					'button[id="/layout"]',
					() => {
						return prependPortal(
							<h2 className={className}>
								<Icon icon="general-category" size={20} />
								{__('General', 'blockera')}
							</h2>,
							document.querySelector('button[id="/layout"]')
								?.parentElement
						);
					},
					{
						isRootComponent: true,
						targetElementIsRoot: true,
						componentSelector: '.blockera-styles-navigation',
					}
				);

				new IntersectionObserverRenderer(
					'button[id="/blocks"]',
					() => {
						return prependPortal(
							<h2 className={className}>
								<Icon icon="global-styles-category" size={20} />
								{__('Global Styles', 'blockera')}
							</h2>,
							document.querySelector('button[id="/blocks"]')
								?.parentElement?.parentElement?.parentElement
						);
					},
					{
						isRootComponent: true,
						targetElementIsRoot: true,
						componentSelector: '.blockera-styles-navigation',
					}
				);

				new IntersectionObserverRenderer(
					'button[id="/blocks"]',
					() => {
						useEffect(() => {
							const button = document.querySelector(
								'button[id="/blocks"]'
							);

							button.innerHTML = button.innerHTML.replace(
								'Blocks',
								__('Block Style Variations', 'blockera')
							);
						}, []);

						return prependPortal(
							<Icon icon="style-variations-animated" size={20} />,
							document.querySelector('button[id="/blocks"]'),
							{
								className: ['inline-block', 'no-margin-top'],
							}
						);
					},
					{
						isRootComponent: true,
						targetElementIsRoot: true,
						componentSelector: '.blockera-styles-navigation',
					}
				);

				new IntersectionObserverRenderer(
					'button[id="/blocks"]',
					() => {
						return createPortal(
							<BlockeraGlobalStylesNavigator
								className={className}
							/>,
							document.querySelector('button[id="/blocks"]')
								?.parentElement
						);
					},
					{
						isRootComponent: true,
						targetElementIsRoot: true,
						componentSelector: '.blockera-styles-navigation',
					}
				);
				// eslint-disable-next-line react-hooks/exhaustive-deps
			}, []);

			return <></>;
		},
	});

	registerPlugin('blockera-sidebar-global-styles-listeners', {
		render() {
			// eslint-disable-next-line react-hooks/rules-of-hooks
			useEffect(() => {
				new IntersectionObserverRenderer(sidebarSelector, null, {
					callback: () => sidebarListener(blockTypes),
				});
				// eslint-disable-next-line react-hooks/exhaustive-deps
			}, []);

			return <></>;
		},
	});

	registerPlugin('blockera-style-book-example-listeners', {
		render() {
			// eslint-disable-next-line react-hooks/rules-of-hooks
			useEffect(() => {
				new IntersectionObserverRenderer(styleBookSelector, null, {
					callback: () => styleBookListener(blockTypes),
				});
				// eslint-disable-next-line react-hooks/exhaustive-deps
			}, []);

			return <></>;
		},
	});

	registerPlugin('blockera-global-styles-panel-screen', {
		render() {
			// eslint-disable-next-line react-hooks/rules-of-hooks
			useEffect(() => {
				new IntersectionObserverRenderer(
					screen,
					() => (
						<BlockGlobalStylesPanelScreen
							screen={screen}
							blocksButton={blocksButton}
							globalStylesScreen={globalStylesScreen}
							blockScreenListItem={blockScreenListItem}
						/>
					),
					{
						targetElementIsRoot: true,
						whileNotExistSelectors: [
							blocksButton,
							globalStylesScreen,
							blockScreenListItem,
						],
						componentSelector: '.blockera-extensions-wrapper',
					}
				);
				// eslint-disable-next-line react-hooks/exhaustive-deps
			}, []);

			return <></>;
		},
	});

	const staticKeys = ['blockeraBlockStates', 'blockeraPropsId'];
	const defaultBlockStates = {
		normal: {
			breakpoints: {},
			isVisible: true,
		},
	};
	const blockeraPropsId = Math.random().toString(36).substring(2, 15);

	const GlobalBlockStyleVariationStylesRenderer = memo(
		({
			blockType,
			variationName,
			variationGlobalStyles,
		}: {
			blockType: Object,
			variationName: string,
			variationGlobalStyles: Object,
		}) => {
			const memoizedGlobalStyles = omitWithPattern(
				variationGlobalStyles || {},
				/^(?!blockera).*/i
			);
			const blockeraBlockTypeGlobalStyles = sanitizeBlockAttributes({
				...memoizedGlobalStyles,
				blockeraBlockStates: mergeObject(
					defaultBlockStates,
					memoizedGlobalStyles?.blockeraBlockStates?.value || {}
				),
				blockeraPropsId,
			});

			if (
				(!blockeraBlockTypeGlobalStyles ||
					!Object.keys(blockeraBlockTypeGlobalStyles).length) &&
				!Object.keys(variationGlobalStyles).length
			) {
				return null;
			}

			if (
				isEquals(
					Object.keys(blockeraBlockTypeGlobalStyles),
					staticKeys
				) &&
				isEquals(
					defaultBlockStates,
					blockeraBlockTypeGlobalStyles.blockeraBlockStates
				)
			) {
				return null;
			}

			return (
				<GlobalStylesRenderer
					{...{
						...blockType,
						isStyleVariation: true,
						blockeraBlockTypeGlobalStyles,
						styleVariationName: variationName,
					}}
				/>
			);
		}
	);

	const GlobalBlockStylesRenderer = memo((blockType: Object) => {
		const { name } = blockType;
		const blockTypeGlobalStyles = useGlobalStylesContext({
			single: true,
			from: 'merged',
			path: `styles.blocks.${name}`,
		});
		const memoizedBlockTypeGlobalStyles = omitWithPattern(
			blockTypeGlobalStyles || {},
			/^(?!blockera).*/i
		);
		const blockeraBlockTypeGlobalStyles = useMemo(
			() =>
				sanitizeBlockAttributes({
					...memoizedBlockTypeGlobalStyles,
					blockeraBlockStates: mergeObject(
						defaultBlockStates,
						memoizedBlockTypeGlobalStyles?.blockeraBlockStates
							?.value || {}
					),
					blockeraPropsId,
				}),
			[memoizedBlockTypeGlobalStyles]
		);

		if (
			(!blockeraBlockTypeGlobalStyles ||
				!Object.keys(blockeraBlockTypeGlobalStyles).length) &&
			!blockTypeGlobalStyles?.variations
		) {
			return null;
		}

		if (
			isEquals(Object.keys(blockeraBlockTypeGlobalStyles), staticKeys) &&
			isEquals(
				defaultBlockStates,
				blockeraBlockTypeGlobalStyles.blockeraBlockStates
			)
		) {
			return null;
		}

		return (
			<>
				<GlobalStylesRenderer
					{...{ ...blockType, blockeraBlockTypeGlobalStyles }}
				/>
				{Object.entries(blockTypeGlobalStyles?.variations || {}).map(
					([variationName], variationIndex) => (
						<GlobalBlockStyleVariationStylesRenderer
							{...{
								blockType,
								variationName,
								variationIndex,
								variationGlobalStyles:
									blockTypeGlobalStyles?.variations?.[
										variationName
									] || {},
							}}
							key={`${name}-${variationName}-${variationIndex}`}
						/>
					)
				)}
			</>
		);
	});

	const GlobalStylesComponent = () => {
		return blockTypes.map(
			(blockType: Object, blockIndex: number): MixedElement => (
				<GlobalBlockStylesRenderer
					{...blockType}
					key={`${blockType.name}-${blockIndex}`}
				/>
			)
		);
	};

	registerPlugin('blockera-global-styles-output', {
		render() {
			// eslint-disable-next-line react-hooks/rules-of-hooks
			useEffect(() => {
				new IntersectionObserverRenderer(
					'iframe',
					GlobalStylesComponent,
					{
						isRootComponent: true,
						targetElementIsRoot: true,
						componentSelector: '#blockera-global-styles-wrapper',
					}
				);
				// eslint-disable-next-line react-hooks/exhaustive-deps
			}, []);

			return <></>;
		},
	});
};
