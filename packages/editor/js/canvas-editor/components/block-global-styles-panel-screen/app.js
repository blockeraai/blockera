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
import { isEmpty, isEquals, mergeObject } from '@blockera/utils';

/**
 * Internal dependencies
 */
import {
	EditorFeatureWrapper,
	EditorAdvancedLabelControl,
} from '../../../components';
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
import { useGlobalStyle } from './hooks';

// Helper functions
const getBlockAttributes = (name: string): Object => {
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

const cleanupStylesHelper = (styles: Object, defaultStyles: Object): Object => {
	const cleanStyles: { [key: string]: Object } = {};

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

	const { blockExtension, blockeraOverrideBlockAttributes } = useMemo(
		() => getBlockAttributes(name),
		[name]
	);

	const originDefaultAttributes = useMemo(() => {
		return mergeObject(blockeraOverrideBlockAttributes, attributes);
	}, [attributes, blockeraOverrideBlockAttributes]);

	const defaultStyles = useMemo(() => {
		return sanitizeDefaultAttributes(originDefaultAttributes, {
			defaultWithoutValue: true,
		});
	}, [originDefaultAttributes]);

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

	let prefixParts: Array<string> = [];
	if (currentBlockStyleVariation && !currentBlockStyleVariation?.isDefault) {
		prefixParts = ['variations', currentBlockStyleVariation.name].concat(
			prefixParts
		);
	}
	const prefix = prefixParts.join('.');
	const [inheritedStyle, rootStyle, setStyle] = useGlobalStyle(
		prefix,
		name,
		'all',
		{
			shouldDecodeEncode: false,
			defaultStylesValue,
		}
	);

	let style = inheritedStyle;
	if (!currentBlockStyleVariation?.isDefault) {
		style = mergeObject(rootStyle, inheritedStyle);
	}

	const getStyle = useCallback(
		() => ({
			...defaultStylesValue,
			...(style || {}),
		}),
		[style, defaultStylesValue]
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
						getAttributesRef={getStyle}
						{...props}
					/>
				),
			},
		}),
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[name]
	);

	const cleanupStyles = useCallback(
		(styles) => cleanupStylesHelper(styles, defaultStyles),
		[defaultStyles]
	);

	const children = useMemo(
		() => (
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
		),
		[props.clientId]
	);

	const [isReportingErrorCompleted, setIsReportingErrorCompleted] =
		useState(false);

	const memoizedBlockBaseProps = useMemo(
		() => ({
			name,
			clientId: name.replace('/', '-'),
			setAttributes: (newStyle: Object) => {
				const cleanedStyle = cleanupStyles(
					mergeObject(style, newStyle)
				);

				setBlockStyles(name, cleanedStyle);

				setStyle(cleanedStyle);
			},
			defaultAttributes: defaultStyles,
			additional: blockExtension,
			insideBlockInspector: false,
			className: props?.className,
			attributes: style,
			originDefaultAttributes,
		}),
		[
			name,
			style,
			setStyle,
			defaultStyles,
			cleanupStyles,
			setBlockStyles,
			blockExtension,
			props?.className,
			originDefaultAttributes,
		]
	);

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
				styles={getStyle()}
				selectedBlockClientId={props?.selectedBlockClientId || ''}
				setStyles={memoizedBlockBaseProps.setAttributes}
				currentBlockStyleVariation={currentBlockStyleVariation}
				setCurrentBlockStyleVariation={setCurrentBlockStyleVariation}
			>
				<BaseControlContext.Provider value={baseContextValue}>
					<BlockApp>
						<div className="blockera-block-global-panel" />
						<BlockBase {...memoizedBlockBaseProps}>
							{children}
						</BlockBase>
					</BlockApp>
				</BaseControlContext.Provider>
			</GlobalStylesPanelContextProvider>
		</ErrorBoundary>
	);
}
