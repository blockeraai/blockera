// @flow

/**
 * External dependencies
 */
import type { MixedElement } from 'react';
import { select, dispatch } from '@wordpress/data';
import { ErrorBoundary } from 'react-error-boundary';
import { useMemo, useState, useEffect, useCallback } from '@wordpress/element';
import { SlotFillProvider, Slot } from '@wordpress/components';
// import { store as blocksStore } from '@wordpress/blocks';

/**
 * Blockera dependencies
 */
import { isEmpty, mergeObject, isEquals } from '@blockera/utils';
import { BaseControlContext } from '@blockera/controls';

/**
 * Internal dependencies
 */
import {
	EditorFeatureWrapper,
	EditorAdvancedLabelControl,
} from '../../../components';
// import { useGlobalStyle } from './hooks';
import { useGlobalStylesContext } from './global-styles-provider';
import { SharedBlockExtension } from '../../../extensions/libs/shared';
import { sanitizeDefaultAttributes } from '../../../extensions/hooks/utils';
import { ErrorBoundaryFallback } from '../../../extensions/hooks/block-settings';
import { prepareBlockeraDefaultAttributesValues } from '../../../extensions/components/utils';
import {
	BlockApp,
	BlockBase,
	BlockPortals,
} from '../../../extensions/components';
// import { ErrorBoundaryFallback } from '../../../extensions/hooks/block-settings';
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
		// getBlockExtensionBy,
		getBlockTypeAttributes,
		getSharedBlockAttributes,
	} = select(STORE_NAME) || {};
	// const blockExtension = getBlockExtensionBy('targetBlock', name);
	const blockeraOverrideBlockTypeAttributes = getBlockTypeAttributes(name);
	const blockeraOverrideBlockAttributes = isEmpty(
		blockeraOverrideBlockTypeAttributes
	)
		? getSharedBlockAttributes()
		: blockeraOverrideBlockTypeAttributes;

	const baseContextValue = useMemo(
		() => ({
			components: {
				FeatureWrapper: EditorFeatureWrapper,
				AdvancedLabelControl: EditorAdvancedLabelControl,
			},
		}),
		[]
	);

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
	const { setBlockStyles, setSelectedBlockStyleVariation } =
		dispatch(EDITOR_STORE_NAME);

	const [currentBlockStyleVariation, setCurrentBlockStyleVariation] =
		useState(undefined);

	useEffect(() => {
		const prevCurrentBlockStyleVariation = getSelectedBlockStyleVariation();

		if (currentBlockStyleVariation !== prevCurrentBlockStyleVariation) {
			return;
		}

		setSelectedBlockStyleVariation(currentBlockStyleVariation);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [currentBlockStyleVariation]);

	const styles = useMemo(() => {
		const defaultStylesValue =
			prepareBlockeraDefaultAttributesValues(defaultStyles);

		if (currentBlockStyleVariation) {
			return {
				...defaultStylesValue,
				...(mergedConfig?.styles?.blocks[name]?.variations[
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

	// To clean up the user styles configuration.
	const cleanupStyles = useCallback(
		(styles) => {
			const cleanStyles = {};

			for (const key in styles) {
				if (
					[
						'blockeraPropsId',
						'blockeraCompatId',
						'className',
					].includes(key)
				) {
					continue;
				}

				if (
					!defaultStyles[key]?.hasOwnProperty('default') &&
					styles[key]
				) {
					if (!styles[key].hasOwnProperty('value')) {
						cleanStyles[key] = {
							value: styles[key],
						};
					} else {
						cleanStyles[key] = styles[key];
					}

					continue;
				}

				if (!isEquals(defaultStyles[key]?.default, styles[key])) {
					if (!styles[key].hasOwnProperty('value')) {
						cleanStyles[key] = {
							value: styles[key],
						};
					} else {
						cleanStyles[key] = styles[key];
					}
				}
			}

			return cleanStyles;
		},
		[defaultStyles]
	);

	const handleOnChangeStyles = useCallback(
		(newStyles) => {
			if (currentBlockStyleVariation) {
				const newUserConfig = mergeObject(userConfig, {
					styles: {
						blocks: {
							[name]: {
								variations: {
									[currentBlockStyleVariation.name]:
										cleanupStyles(newStyles),
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
		[currentBlockStyleVariation, styles, name, userConfig]
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
				currentBlockStyleVariation={currentBlockStyleVariation}
				setCurrentBlockStyleVariation={setCurrentBlockStyleVariation}
			>
				<BaseControlContext.Provider value={baseContextValue}>
					<BlockApp
						{...{
							name,
							clientId: name.replace('/', '-'),
							setAttributes: handleOnChangeStyles,
							defaultAttributes: defaultStyles,
							additional: {
								edit: SharedBlockExtension,
							},
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
