// @flow

/**
 * External dependencies
 */
import { detailedDiff } from 'deep-object-diff';
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

	const { getBlockStyles, getSelectedBlockStyleVariation } =
		select(EDITOR_STORE_NAME);
	const { setBlockStyles } = dispatch(EDITOR_STORE_NAME);

	const [currentBlockStyleVariation, setCurrentBlockStyleVariation] =
		useState(getSelectedBlockStyleVariation());

	const initialStyles = useMemo(() => {
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

	const [styles, setStyles] = useState(initialStyles);

	useEffect(() => {
		if (!isEquals(styles, initialStyles)) {
			setStyles(initialStyles);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [initialStyles]);

	const getCalculatedBlockStyles = useCallback(
		(styles) => {
			const calculatedBlockStyles = {};

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
					calculatedBlockStyles[key] = styles[key];

					continue;
				}

				if (!isEquals(defaultStyles[key]?.default, styles[key])) {
					calculatedBlockStyles[key] = styles[key];
				}
			}

			return calculatedBlockStyles;
		},
		[defaultStyles]
	);

	// Update global styles state when local styles change.
	useEffect(() => {
		if (!isEquals(getBlockStyles(name), styles)) {
			setBlockStyles(name, getCalculatedBlockStyles(styles));

			const { added, deleted, updated } = detailedDiff(
				initialStyles,
				styles
			);

			if (
				!Object.keys(added).length &&
				!Object.keys(deleted).length &&
				!Object.keys(updated).length
			) {
				return;
			}

			if (currentBlockStyleVariation) {
				return setUserConfig(
					mergeObject(userConfig, {
						styles: {
							blocks: {
								[name]: {
									variations: {
										[currentBlockStyleVariation.name]:
											getCalculatedBlockStyles(styles),
									},
								},
							},
						},
					})
				);
			}

			setUserConfig(
				mergeObject(userConfig, {
					styles: {
						blocks: {
							[name]: getCalculatedBlockStyles(styles),
						},
					},
				})
			);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [styles]);

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
							setAttributes: setStyles,
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
