// @flow

/**
 * External dependencies
 */
import { select } from '@wordpress/data';
import type { MixedElement, ComponentType } from 'react';
import {
	memo,
	useCallback,
	useEffect,
	useMemo,
	useRef,
} from '@wordpress/element';

/**
 * Blockera dependencies
 */
import { isEquals } from '@blockera/utils';

/**
 * Internal dependencies
 */
import {
	InnerBlocksExtension,
	useInnerBlocks,
} from '../../block-card/inner-blocks';
import { Inserter, Categories } from './';
import type { TPreviewProps } from '../types';
import { useBlockStates } from '../../block-card/block-states/hooks';
import {
	PreviewActiveColorProvider,
	arePreviewActiveColorProviderPropsEqual,
	useStablePreviewActiveColorProviderProps,
	type PreviewActiveColorProviderInputProps,
} from './preview-active-color-provider';
import type { TStates, StateTypes } from '../../block-card/block-states/types';
import StatesManager from '../../block-card/block-states/components/states-manager';

// the instance of in-memory cache.
const deleteCacheData: Object = new Map();

function getActiveColorInsideBlockInspector(props: TPreviewProps): boolean {
	if (props.activeColorInsideBlockInspector !== undefined) {
		return props.activeColorInsideBlockInspector;
	}

	return props.insideBlockInspector !== false;
}

function getPreviewActiveColorProviderPropsFromPreview(
	props: TPreviewProps
): PreviewActiveColorProviderInputProps {
	return {
		blockName: props.block?.blockName || '',
		clientId: props.block?.clientId || '',
		availableStates: props.availableStates,
		blockeraUnsavedData:
			props.blockStatesProps?.attributes?.blockeraUnsavedData,
		insideBlockInspector: getActiveColorInsideBlockInspector(props),
		variationSurface: props.variationSurface,
	};
}

function arePreviewPropsEqual(
	prevProps: TPreviewProps,
	nextProps: TPreviewProps
): boolean {
	if (
		prevProps.onChange !== nextProps.onChange ||
		prevProps.setCurrentTab !== nextProps.setCurrentTab ||
		prevProps.blockConfig !== nextProps.blockConfig ||
		prevProps.insideBlockInspector !== nextProps.insideBlockInspector ||
		getActiveColorInsideBlockInspector(prevProps) !==
			getActiveColorInsideBlockInspector(nextProps) ||
		prevProps.variationSurface !== nextProps.variationSurface
	) {
		return false;
	}

	if (
		!arePreviewActiveColorProviderPropsEqual(
			getPreviewActiveColorProviderPropsFromPreview(prevProps),
			getPreviewActiveColorProviderPropsFromPreview(nextProps)
		)
	) {
		return false;
	}

	const prevBlock = prevProps.block;
	const nextBlock = nextProps.block;

	if (
		prevBlock?.clientId !== nextBlock?.clientId ||
		prevBlock?.blockName !== nextBlock?.blockName ||
		prevBlock?.setAttributes !== nextBlock?.setAttributes ||
		prevBlock?.selectedBlockClientId !== nextBlock?.selectedBlockClientId ||
		prevBlock?.supports !== nextBlock?.supports
	) {
		return false;
	}

	const prevVariation = prevBlock?.currentBlockStyleVariation;
	const nextVariation = nextBlock?.currentBlockStyleVariation;

	if (
		prevVariation?.name !== nextVariation?.name ||
		prevVariation?.isDefault !== nextVariation?.isDefault
	) {
		return false;
	}

	const prevAttrs = prevProps.blockStatesProps?.attributes;
	const nextAttrs = nextProps.blockStatesProps?.attributes;

	if (
		prevProps.blockStatesProps?.id !== nextProps.blockStatesProps?.id ||
		!isEquals(
			prevAttrs?.blockeraBlockStates,
			nextAttrs?.blockeraBlockStates
		) ||
		prevAttrs?.blockeraInnerBlocks !== nextAttrs?.blockeraInnerBlocks
	) {
		return false;
	}

	if (
		!isEquals(
			prevProps.innerBlocksProps?.values,
			nextProps.innerBlocksProps?.values
		) ||
		prevProps.innerBlocksProps?.innerBlocks !==
			nextProps.innerBlocksProps?.innerBlocks
	) {
		return false;
	}

	// Store-driven scope (currentBlock/state) is read inside PreviewActiveColorProvider.
	return true;
}

function useStablePreviewInputs({
	block,
	blockStatesProps,
	innerBlocksProps,
	onStatesManagerReady,
	activeColorProviderProps,
}: {
	block: TPreviewProps['block'],
	blockStatesProps: TPreviewProps['blockStatesProps'],
	innerBlocksProps?: TPreviewProps['innerBlocksProps'],
	onStatesManagerReady?: TPreviewProps['onStatesManagerReady'],
	activeColorProviderProps: PreviewActiveColorProviderInputProps,
}): {
	stableBlock: TPreviewProps['block'],
	stableBlockStatesProps: TPreviewProps['blockStatesProps'],
	stableInnerBlocksProps: TPreviewProps['innerBlocksProps'],
	stableActiveColorProviderProps: PreviewActiveColorProviderInputProps,
	onStatesManagerReadyRef: {
		current: TPreviewProps['onStatesManagerReady'],
	},
} {
	const onStatesManagerReadyRef = useRef(onStatesManagerReady);
	onStatesManagerReadyRef.current = onStatesManagerReady;

	const blockVariationKey =
		block?.currentBlockStyleVariation?.name ??
		(block?.currentBlockStyleVariation?.isDefault ? 'default' : '');

	const stableBlock = useMemo(
		() => ({
			supports: block?.supports,
			clientId: block?.clientId,
			blockName: block?.blockName,
			setAttributes: block?.setAttributes,
			selectedBlockClientId: block?.selectedBlockClientId,
			currentBlockStyleVariation: block?.currentBlockStyleVariation,
		}),
		// eslint-disable-next-line react-hooks/exhaustive-deps -- variation keyed by slug/default token
		[
			block?.supports,
			block?.clientId,
			block?.blockName,
			block?.setAttributes,
			block?.selectedBlockClientId,
			blockVariationKey,
		]
	);

	const blockStatesAttributes = blockStatesProps?.attributes;

	const stableBlockStatesProps = useMemo(
		() => ({
			...(blockStatesProps?.id ? { id: blockStatesProps.id } : {}),
			attributes: blockStatesAttributes,
		}),
		// eslint-disable-next-line react-hooks/exhaustive-deps -- aligned with PreviewActiveColorProvider inputs
		[
			blockStatesProps?.id,
			blockStatesAttributes?.blockeraBlockStates,
			blockStatesAttributes?.blockeraUnsavedData?.states,
			blockStatesAttributes?.blockeraInnerBlocks,
		]
	);

	const stableInnerBlocksProps = useMemo(
		() => ({
			values: innerBlocksProps?.values || {},
			innerBlocks: innerBlocksProps?.innerBlocks || {},
		}),
		[innerBlocksProps?.values, innerBlocksProps?.innerBlocks]
	);

	const stableActiveColorProviderProps =
		useStablePreviewActiveColorProviderProps(activeColorProviderProps);

	return {
		stableBlock,
		stableBlockStatesProps,
		stableInnerBlocksProps,
		stableActiveColorProviderProps,
		onStatesManagerReadyRef,
	};
}

const PreviewComponent = ({
	// General Props.
	block,
	onChange,
	blockConfig,
	currentBlock,
	currentState,
	availableStates,
	currentBreakpoint,
	insideBlockInspector = true,
	activeColorInsideBlockInspector,
	variationSurface,
	currentInnerBlockState,

	// States Manager props.
	blockStatesProps,
	onStatesManagerReady,

	// Inner Blocks props.
	innerBlocksProps,

	// External props.
	setCurrentTab,
}: TPreviewProps): MixedElement => {
	const {
		stableBlock,
		stableBlockStatesProps,
		stableInnerBlocksProps,
		stableActiveColorProviderProps,
		onStatesManagerReadyRef,
	} = useStablePreviewInputs({
		block,
		blockStatesProps,
		innerBlocksProps,
		onStatesManagerReady,
		activeColorProviderProps: {
			blockName: block?.blockName || '',
			clientId: block?.clientId || '',
			availableStates,
			blockeraUnsavedData:
				blockStatesProps?.attributes?.blockeraUnsavedData,
			insideBlockInspector:
				activeColorInsideBlockInspector ?? insideBlockInspector,
			variationSurface,
		},
	});

	const {
		blocks,
		elements,
		maxItems,
		getBlockInners,
		setCurrentBlock,
		setBlockClientInners,
		onReset: onInnerBlocksReset,
		contextValue: innerBlocksContextValue,
	} = useInnerBlocks({
		block: stableBlock,
		onChange,
		currentBlock,
		insideBlockInspector,
		maxItems: blockConfig?.maxInnerBlocks,
		values: stableInnerBlocksProps?.values || {},
		innerBlocks: stableInnerBlocksProps?.innerBlocks || {},
	});

	const {
		states,
		onReset,
		onDelete,
		overrideItem,
		defaultStates,
		handleOnChange,
		preparedStates,
		calculatedValue: calculatedStates,
		contextValue: blockStatesContextValue,
		defaultRepeaterItemValue,
		getDynamicDefaultRepeaterItem,
	} = useBlockStates({
		...stableBlockStatesProps,
		block: stableBlock,
		onChange,
		currentBlock,
		currentState,
		setCurrentBlock,
		availableStates,
		deleteCacheData,
		currentBreakpoint,
		currentInnerBlockState,
	});

	const doingSwitchToInner = useCallback(() => {
		setCurrentTab?.('styles');
		const { getState, getInnerState } = select('blockera/editor');
		const {
			settings: { supportsInnerBlocks },
		} = getState(currentState) ||
			getInnerState(currentInnerBlockState) || {
				settings: { supportsInnerBlocks: true },
			};

		if (false === supportsInnerBlocks) {
			const newStates: {
				[key: TStates]: StateTypes,
				// $FlowFixMe
			} = {
				...states,
				normal: {
					...states.normal,
					isSelected: true,
					selectable: true,
				},
			};

			Object.keys(newStates).forEach((stateName) => {
				if (stateName !== 'normal') {
					// $FlowFixMe
					newStates[stateName].isSelected = false;
				}
			});

			handleOnChange(newStates);
		}
	}, [
		states,
		currentState,
		setCurrentTab,
		handleOnChange,
		currentInnerBlockState,
	]);

	useEffect(() => {
		onStatesManagerReadyRef.current?.(handleOnChange);
	}, [handleOnChange, onStatesManagerReadyRef]);

	const inserterMaxItems =
		(maxItems || 0) + Object.keys(preparedStates).length;

	const availableBlocksComponent = useMemo(
		() => () => (
			<Categories
				blocks={blocks}
				elements={elements}
				states={preparedStates}
				clientId={stableBlock?.clientId}
				savedStates={calculatedStates}
				setBlockState={handleOnChange}
				getBlockInners={getBlockInners}
				setCurrentBlock={setCurrentBlock}
				doingSwitchToInner={doingSwitchToInner}
				getBlockStates={() => calculatedStates}
				setBlockClientInners={setBlockClientInners}
			/>
		),
		[
			blocks,
			elements,
			preparedStates,
			calculatedStates,
			stableBlock?.clientId,
			handleOnChange,
			getBlockInners,
			setCurrentBlock,
			doingSwitchToInner,
			setBlockClientInners,
		]
	);

	const inserterComponent = useMemo(
		() => (props: Object) => (
			<Inserter
				{...props}
				maxItems={inserterMaxItems}
				AvailableBlocks={availableBlocksComponent}
			/>
		),
		[inserterMaxItems, availableBlocksComponent]
	);

	return (
		<PreviewActiveColorProvider {...stableActiveColorProviderProps}>
			<StatesManager
				states={states}
				onReset={onReset}
				onDelete={onDelete}
				overrideItem={overrideItem}
				defaultStates={defaultStates}
				preparedStates={preparedStates}
				handleOnChange={handleOnChange}
				deleteCacheData={deleteCacheData}
				contextValue={blockStatesContextValue}
				defaultRepeaterItemValue={defaultRepeaterItemValue}
				maxItems={Object.keys(preparedStates).length + (maxItems || 0)}
				getDynamicDefaultRepeaterItem={getDynamicDefaultRepeaterItem}
				InserterComponent={inserterComponent}
			>
				{innerBlocksContextValue && (
					<InnerBlocksExtension
						{...{
							...stableInnerBlocksProps,
							maxItems,
							currentState,
							setCurrentBlock,
							currentBreakpoint,
							doingSwitchToInner,
							setBlockClientInners,
							currentInnerBlockState,
							onReset: onInnerBlocksReset,
							contextValue: innerBlocksContextValue,
						}}
						block={stableBlock}
						onChange={onChange}
					/>
				)}
			</StatesManager>
		</PreviewActiveColorProvider>
	);
};

export const Preview: ComponentType<TPreviewProps> = memo(
	PreviewComponent,
	arePreviewPropsEqual
);
