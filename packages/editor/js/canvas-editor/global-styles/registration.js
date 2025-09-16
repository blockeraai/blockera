// @flow

/**
 * External dependencies
 */
import { getBlockTypes } from '@wordpress/blocks';
import { registerPlugin } from '@wordpress/plugins';
import { useEffect, Fragment } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { BlockGlobalStylesPanelScreen } from '../components';
import { sidebarListener, sidebarSelector } from './side-bar-listener';
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

	registerPlugin('blockera-global-styles-output', {
		render() {
			// eslint-disable-next-line react-hooks/rules-of-hooks
			useEffect(() => {
				new IntersectionObserverRenderer(
					'iframe',
					() =>
						blockTypes.map(
							(
								blockType: Object,
								blockIndex: number
							): MixedElement => {
								const {
									merged: mergedConfig,
									// base: baseConfig,
									// user: userConfig,
									// setUserConfig,
								} = useGlobalStylesContext();

								const {
									styles: {
										blocks: {
											[blockType.name]:
												blockTypeGlobalStyles,
										},
									},
								} = mergedConfig;

								return (
									<Fragment
										key={`${blockType.name}-${blockIndex}`}
									>
										<GlobalStylesRenderer {...blockType} />
										{Object.entries(
											blockTypeGlobalStyles?.variations ||
												{}
										).map(
											(
												[variationName],
												variationIndex
											) => (
												<GlobalStylesRenderer
													{...{
														...blockType,
														isStyleVariation: true,
														styleVariationName:
															variationName,
													}}
													key={`${blockType.name}-${variationName}-${variationIndex}`}
												/>
											)
										)}
									</Fragment>
								);
							}
						),
					{
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
