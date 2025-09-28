// @flow

/**
 * External dependencies
 */
import type { MixedElement } from 'react';
import { select, dispatch } from '@wordpress/data';
import { ErrorBoundary } from 'react-error-boundary';
import { useMemo, useState, useCallback } from '@wordpress/element';
import { SlotFillProvider, Slot } from '@wordpress/components';

/**
 * Blockera dependencies
 */
import { BaseControlContext } from '@blockera/controls';
import {
	omit,
	isEmpty,
	isEquals,
	pascalCase,
	mergeObject,
} from '@blockera/utils';

/**
 * Internal dependencies
 */
import {
	EditorFeatureWrapper,
	EditorAdvancedLabelControl,
} from '../../../components';
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

// Helper functions
const getBlockAttributes = (name) => {
	const {
		getBlockExtensionBy,
		getBlockTypeAttributes,
		getSharedBlockAttributes,
	} = select(STORE_NAME) || {};

	const blockeraOverrideBlockTypeAttributes = getBlockTypeAttributes(name);
	return {
		blockExtension: getBlockExtensionBy('targetBlock', name),
		blockeraOverrideBlockAttributes: isEmpty(
			blockeraOverrideBlockTypeAttributes
		)
			? getSharedBlockAttributes()
			: blockeraOverrideBlockTypeAttributes,
	};
};

const getComputedStyles = (
	currentBlockStyleVariation,
	defaultStylesValue,
	mergedConfig,
	name
) => {
	if (currentBlockStyleVariation && !currentBlockStyleVariation?.isDefault) {
		return {
			...defaultStylesValue,
			...omit(mergedConfig?.styles?.blocks[name] || {}, ['variations']),
			...((mergedConfig?.styles?.blocks[name]?.variations || {})[
				currentBlockStyleVariation.name
			] || {}),
		};
	}

	return {
		...defaultStylesValue,
		...(mergedConfig?.styles?.blocks[name] || {}),
	};
};

const cleanupStylesHelper = (styles, defaultStyles) => {
	const cleanStyles = {};

	for (const key in styles) {
		if (
			['blockeraPropsId', 'blockeraCompatId', 'className'].includes(key)
		) {
			continue;
		}

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

		if (!isEquals(defaultStyles[key]?.default, styles[key]?.value)) {
			cleanStyles[key] = styles[key];
		}
	}

	return cleanStyles;
};

export default function App(props: Object): MixedElement {
	const {
		blockType: { name, attributes },
	} = props;

	const { blockExtension, blockeraOverrideBlockAttributes } =
		getBlockAttributes(name);

	const originDefaultAttributes = useMemo(() => {
		return mergeObject(blockeraOverrideBlockAttributes, attributes);
	}, [attributes, blockeraOverrideBlockAttributes]);

	const defaultStyles = useMemo(() => {
		return sanitizeDefaultAttributes(originDefaultAttributes, {
			defaultWithoutValue: true,
		});
	}, [originDefaultAttributes]);

	// We should work on mergedConfig because it's contains the all styles but for save user customizations,
	// we should use userConfig to save user customizations.
	const {
		merged: mergedConfig,
		user: userConfig,
		setUserConfig,
	} = useGlobalStylesContext();

	const { getSelectedBlockStyleVariation } = select(EDITOR_STORE_NAME);
	const { setBlockStyles } = dispatch(EDITOR_STORE_NAME);

	const [currentBlockStyleVariation, setCurrentBlockStyleVariation] =
		useState(getSelectedBlockStyleVariation());

	const defaultStylesValue = useMemo(
		() =>
			prepareBlockeraDefaultAttributesValues(defaultStyles, {
				context: 'global-styles-panel',
			}),
		[defaultStyles]
	);

	const styles = useMemo(
		() =>
			getComputedStyles(
				currentBlockStyleVariation,
				defaultStylesValue,
				mergedConfig,
				name
			),
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[name, currentBlockStyleVariation]
	);

	const getStyles = useCallback(
		() => ({
			...defaultStylesValue,
			...(mergedConfig?.styles?.blocks[name] || {}),
		}),
		[mergedConfig, defaultStylesValue, name]
	);

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

	const cleanupStyles = useCallback(
		(styles) => cleanupStylesHelper(styles, defaultStyles),
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

			for (const variation in newStyles.variations) {
				if (!Object.keys(newStyles.variations[variation])?.length) {
					newStyles.variations[variation] = {
						blockeraMetaData: {
							name: variation,
							label: pascalCase(
								variation.replace(/-/g, ' ')
							).replace(/_/g, ' '),
						},
					};

					continue;
				}
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
				selectedBlockClientId={props?.selectedBlockClientId || ''}
				setStyles={handleOnChangeStyles}
				currentBlockStyleVariation={currentBlockStyleVariation}
				setCurrentBlockStyleVariation={setCurrentBlockStyleVariation}
			>
				<BaseControlContext.Provider value={baseContextValue}>
					<BlockApp>
						<div className="blockera-block-global-panel" />
						<BlockBase
							{...{
								name,
								clientId: name.replace('/', '-'),
								setAttributes: handleOnChangeStyles,
								defaultAttributes: defaultStyles,
								additional: blockExtension,
								insideBlockInspector: false,
								className: props?.className,
								attributes: styles,
								originDefaultAttributes,
							}}
						>
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
