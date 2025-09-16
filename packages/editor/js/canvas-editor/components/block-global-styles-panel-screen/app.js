// @flow

/**
 * External dependencies
 */
import type { MixedElement } from 'react';
import { select, dispatch } from '@wordpress/data';
import { ErrorBoundary } from 'react-error-boundary';
import { useMemo, useState, useCallback } from '@wordpress/element';
import { SlotFillProvider, Slot } from '@wordpress/components';
// import { store as blocksStore } from '@wordpress/blocks';

/**
 * Blockera dependencies
 */
import { BaseControlContext } from '@blockera/controls';
import { isEmpty, mergeObject, isEquals, omit } from '@blockera/utils';

/**
 * Internal dependencies
 */
import {
	EditorFeatureWrapper,
	EditorAdvancedLabelControl,
} from '../../../components';
// import { useGlobalStyle } from './hooks';
import { useGlobalStylesContext } from './global-styles-provider';
import { sanitizeDefaultAttributes } from '../../../extensions/hooks/utils';
import { ErrorBoundaryFallback } from '../../../extensions/hooks/block-settings';
import { prepareBlockeraDefaultAttributesValues } from '../../../extensions/components/utils';
import {
	BlockApp,
	BlockBase,
	BlockPortals,
} from '../../../extensions/components';
import { STORE_NAME } from '../../../extensions/store/constants';
import { STORE_NAME as EDITOR_STORE_NAME } from '../../../store/constants';
import { GlobalStylesPanelContextProvider } from './context';

export default function App(props: Object): MixedElement {
	const {
		blockType: {
			name,
			attributes,
			// variation
		},
	} = props;
	const {
		getBlockExtensionBy,
		getBlockTypeAttributes,
		getSharedBlockAttributes,
	} = select(STORE_NAME) || {};
	const blockExtension = getBlockExtensionBy('targetBlock', name);
	const blockeraOverrideBlockTypeAttributes = getBlockTypeAttributes(name);
	const blockeraOverrideBlockAttributes = isEmpty(
		blockeraOverrideBlockTypeAttributes
	)
		? getSharedBlockAttributes()
		: blockeraOverrideBlockTypeAttributes;

	const originDefaultAttributes = useMemo(() => {
		return mergeObject(blockeraOverrideBlockAttributes, attributes);
	}, [attributes, blockeraOverrideBlockAttributes]);

	const defaultStyles = useMemo(() => {
		return sanitizeDefaultAttributes(originDefaultAttributes, {
			defaultWithoutValue: true,
		});
	}, [originDefaultAttributes]);

	const {
		merged: mergedConfig,
		// base: baseConfig,
		user: userConfig,
		setUserConfig,
	} = useGlobalStylesContext();

	const { getSelectedBlockStyleVariation } = select(EDITOR_STORE_NAME);
	const { setBlockStyles } = dispatch(EDITOR_STORE_NAME);

	const [currentBlockStyleVariation, setCurrentBlockStyleVariation] =
		useState(getSelectedBlockStyleVariation());

	const styles = useMemo(() => {
		const defaultStylesValue = prepareBlockeraDefaultAttributesValues(
			defaultStyles,
			{ context: 'global-styles-panel' }
		);

		if (
			currentBlockStyleVariation &&
			!currentBlockStyleVariation?.isDefault
		) {
			return {
				...defaultStylesValue,
				...omit(mergedConfig?.styles?.blocks[name] || {}, [
					'variations',
				]),
				...((mergedConfig?.styles?.blocks[name]?.variations || {})[
					currentBlockStyleVariation.name
				] || {}),
			};
		}

		return {
			...defaultStylesValue,
			...(mergedConfig?.styles?.blocks[name] || {}),
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [mergedConfig, defaultStyles, currentBlockStyleVariation]);

	const getStyles = useCallback(() => {
		const defaultStylesValue = prepareBlockeraDefaultAttributesValues(
			defaultStyles,
			{ context: 'global-styles-panel' }
		);

		return {
			...defaultStylesValue,
			...(mergedConfig?.styles?.blocks[name] || {}),
		};
	}, [mergedConfig, defaultStyles, name]);

	const baseContextValue = useMemo(
		() => ({
			components: {
				FeatureWrapper: (props: Object) => (
					<EditorFeatureWrapper
						{...{
							...props,
							name,
							clientId: name.replace('/', '-'),
						}}
					/>
				),
				AdvancedLabelControl: (props: Object) => (
					<EditorAdvancedLabelControl
						attributesRef={styles}
						{...props}
					/>
				),
			},
		}),
		[name, styles]
	);

	// To clean up the user styles configuration.
	const cleanupStyles = useCallback(
		(styles) => {
			const cleanStyles = {};

			for (const key in styles) {
				// Skip identifiers and className keys.
				if (
					[
						'blockeraPropsId',
						'blockeraCompatId',
						'className',
					].includes(key)
				) {
					continue;
				}

				// Compatible with WordPress core block styles or other third party plugins blocks styles.
				if (!/^blockera/.test(key)) {
					cleanStyles[key] = styles[key];
					continue;
				}

				if (
					!defaultStyles[key]?.hasOwnProperty('default') &&
					styles[key]?.value
				) {
					cleanStyles[key] = styles[key];

					continue;
				}

				if (
					!isEquals(defaultStyles[key]?.default, styles[key]?.value)
				) {
					cleanStyles[key] = styles[key];
				}
			}

			return cleanStyles;
		},
		[defaultStyles]
	);

	const handleOnChangeStyles = useCallback(
		(
			newStyles,
			{ action }: { action: 'clear-all-customizations' } = {}
		) => {
			const currentStyleVariation = getSelectedBlockStyleVariation();

			if (currentStyleVariation && !currentStyleVariation?.isDefault) {
				if ('clear-all-customizations' === action) {
					setBlockStyles(name, cleanupStyles(newStyles));
					return setUserConfig(
						mergeObject(
							userConfig,
							{
								styles: {
									blocks: {
										[name]: cleanupStyles(newStyles),
									},
								},
							},
							{
								forceUpdated: [currentStyleVariation.name],
							}
						)
					);
				}

				const { variations, ...rest } = newStyles;

				const newUserConfig = mergeObject(userConfig, {
					styles: {
						blocks: {
							[name]: {
								variations: {
									[currentStyleVariation.name]:
										cleanupStyles(rest),
								},
							},
						},
					},
				});

				setBlockStyles(name, newUserConfig.styles.blocks[name]);

				return setUserConfig(newUserConfig);
			}

			const newUserConfig = mergeObject(userConfig, {
				styles: {
					blocks: {
						[name]: cleanupStyles(newStyles),
					},
				},
			});

			setBlockStyles(name, newUserConfig.styles.blocks[name]);

			setUserConfig(newUserConfig);
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[styles, name, userConfig]
	);

	// let prefixParts = [];
	// if (variation) {
	// 	prefixParts = ['variations', variation].concat(prefixParts);
	// }
	// const prefix = prefixParts.join('.');
	// const [inheritedStyle, setStyle] = useGlobalStyle(prefix, name, 'all', {
	// 	shouldDecodeEncode: false,
	// });

	const [isReportingErrorCompleted, setIsReportingErrorCompleted] =
		useState(false);

	return (
		<ErrorBoundary
			fallbackRender={({ error }) => (
				<ErrorBoundaryFallback
					{...{
						props,
						error,
						from: 'root',
						isReportingErrorCompleted,
						setIsReportingErrorCompleted,
						fallbackComponent: () => <></>,
					}}
				/>
			)}
		>
			<GlobalStylesPanelContextProvider
				blockName={name}
				styles={getStyles()}
				setStyles={handleOnChangeStyles}
				currentBlockStyleVariation={currentBlockStyleVariation}
				setCurrentBlockStyleVariation={setCurrentBlockStyleVariation}
			>
				<BaseControlContext.Provider value={baseContextValue}>
					<BlockApp
						{...{
							name,
							clientId: props?.clientId || name.replace('/', '-'),
							setAttributes: handleOnChangeStyles,
							defaultAttributes: defaultStyles,
							additional: blockExtension,
							insideBlockInspector: false,
							className: props?.className,
							attributes: styles,
							originDefaultAttributes,
						}}
					>
						<div className="blockera-block-global-panel" />
						<BlockBase>
							<SlotFillProvider>
								<Slot name={'blockera-block-before'} />

								<BlockPortals
									blockId={`#block-${props.clientId}`}
									mainSlot={'blockera-block-slot'}
									slots={
										// slot selectors is feature on configuration block to create custom slots for anywhere.
										// we can add slotSelectors property on block configuration to handle custom preview of block.
										{}
									}
								/>

								<Slot name={'blockera-block-after'} />
							</SlotFillProvider>
						</BlockBase>
					</BlockApp>
				</BaseControlContext.Provider>
			</GlobalStylesPanelContextProvider>
		</ErrorBoundary>
	);
}
