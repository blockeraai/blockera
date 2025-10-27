// @flow

/**
 * External dependencies
 */
import { select, useSelect, dispatch } from '@wordpress/data';
import type { MixedElement } from 'react';
import { registerPlugin } from '@wordpress/plugins';
import {
	memo,
	useMemo,
	Fragment,
	useEffect,
	createPortal,
} from '@wordpress/element';
import {
	getBlockTypes,
	registerBlockStyle,
	unregisterBlockStyle,
} from '@wordpress/blocks';

/**
 * Blockera dependencies
 */
import { isEquals, mergeObject, omitWithPattern } from '@blockera/utils';

/**
 * Internal dependencies
 */
import {
	BlockGlobalStylesPanelScreen,
	BlockeraGlobalStylesNavigation,
} from '../components';
import { AddBlockTypeIcons, sidebarSelector } from './side-bar-listener';
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
	const { blockeraGlobalStylesMetaData } = window;
	const { setStyleVariationBlocks } = dispatch('blockera/editor');

	// Reregister block styles where (renamed by identifier, or deleted)
	Object.entries(blockeraGlobalStylesMetaData?.blocks || {})?.forEach(
		([blockName, blockData]) => {
			Object.entries(blockData?.variations || {})?.forEach(
				([variationName, variation]) => {
					if (variation?.hasNewID) {
						unregisterBlockStyle(blockName, variationName);
						registerBlockStyle(blockName, variation);
					}
					if (variation?.deleted) {
						unregisterBlockStyle(blockName, variationName);
					}
				}
			);
		}
	);

	// Register block styles for saved block types.
	Object.entries(blockeraGlobalStylesMetaData?.variations || {})?.forEach(
		([, variation]) => {
			variation.enabledIn.forEach((blockType) => {
				const { disabledIn, ...rest } = variation;
				registerBlockStyle(blockType, rest);
			});

			const wpEnabledBlocks = blockTypes
				.map((blockType) => {
					if (
						!blockType?.attributes?.hasOwnProperty(
							'blockeraPropsId'
						) ||
						variation.disabledIn.includes(blockType.name)
					) {
						return null;
					}

					const blockStyles =
						select('core/blocks').getBlockStyles(blockType.name) ||
						[];

					if (
						blockStyles.some(
							(style) => style.name === variation.name
						)
					) {
						return blockType.name;
					}

					return null;
				})
				.filter(Boolean);

			// Register style variation blocks in global store.
			setStyleVariationBlocks(variation.name, [
				...new Set([...variation.enabledIn, ...wpEnabledBlocks]),
			]);
		}
	);

	// Unregister block styles for saved block types.
	Object.entries(blockeraGlobalStylesMetaData?.variations || {})?.forEach(
		([variationName, variation]) => {
			variation?.disabledIn?.forEach((blockType) => {
				unregisterBlockStyle(blockType, variationName);
			});
		}
	);

	registerPlugin('blockera-global-styles-navigation', {
		render() {
			// eslint-disable-next-line react-hooks/rules-of-hooks
			useEffect(() => {
				new IntersectionObserverRenderer(
					'.edit-site-global-styles-screen-root__active-style-tile',
					() => {
						return createPortal(
							<BlockeraGlobalStylesNavigation />,
							document.querySelector(
								'.edit-site-global-styles-screen-root__active-style-tile'
							)?.parentElement
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

	registerPlugin('blockera-global-styles-panel-activator-observer', {
		render() {
			// eslint-disable-next-line react-hooks/rules-of-hooks
			useEffect(() => {
				new IntersectionObserverRenderer(screen, null, {
					callback: () => {
						const className =
							'activated-blockera-global-styles-panel';
						if (select('blockera/editor').getSelectedBlockStyle()) {
							document.body?.classList?.add(className);
						} else {
							document.body?.classList?.remove(className);
						}
					},
				});
				// eslint-disable-next-line react-hooks/exhaustive-deps
			}, []);

			return <></>;
		},
	});

	registerPlugin('blockera-additional-css-contextmenu-observer', {
		render() {
			// eslint-disable-next-line react-hooks/rules-of-hooks
			useEffect(() => {
				new IntersectionObserverRenderer(
					'.components-popover__content button:first-child',
					null,
					{
						callback: () => {
							{
								const element = document.querySelector(
									'.components-popover__content button:first-child'
								);

								if (!document.querySelector(screen)) {
									return;
								}

								element?.addEventListener('click', (e) => {
									e.preventDefault();
									e.stopPropagation();
									document
										.querySelector(
											'.custom-css-button button'
										)
										?.click();
								});
							}
						},
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
				new IntersectionObserverRenderer(
					sidebarSelector,
					() => <AddBlockTypeIcons blockTypes={blockTypes} />,
					{
						componentSelector: '.blockera-block-types-icons',
					}
				);
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
					() => <BlockGlobalStylesPanelScreen screen={screen} />,
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
		const wpBlockTypeGlobalStyles = useGlobalStylesContext({
			single: true,
			from: 'merged',
			path: `styles.blocks.${name}`,
		});
		const { localBlockTypeGlobalStyles } = useSelect(
			(select) => {
				const { getBlockStyles } = select('blockera/editor');

				return {
					localBlockTypeGlobalStyles: getBlockStyles(name, 'default'),
				};
			},
			[name]
		);
		const blockTypeGlobalStyles = !Object.keys(localBlockTypeGlobalStyles)
			.length
			? mergeObject(wpBlockTypeGlobalStyles, localBlockTypeGlobalStyles)
			: localBlockTypeGlobalStyles;
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
