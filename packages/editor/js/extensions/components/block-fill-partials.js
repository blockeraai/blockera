// @flow

/**
 * External dependencies
 */
import memoize from 'fast-memoize';
import { select } from '@wordpress/data';
import { Fill } from '@wordpress/components';
import type { ComponentType, Element } from 'react';
import { useEffect, useState, useMemo } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

/**
 * Blockera dependencies
 */
import { unregisterControl } from '@blockera/controls';

/**
 * Internal dependencies
 */
import {
	BlockCard,
	InnerBlockCard,
	PatternBlockCard,
	usePatternEditSection,
	DEFAULT_STYLE_VARIATION_BLOCK_CARD_SLOT_NAME,
} from '../libs/block-card';
import { isInnerBlock } from './utils';
import { isEphemeralDefaultSizeVariation } from '../../editor/global-styles/panel/size-variations';
import StateContainer from './state-container';
import { FeatureSearchContextProvider } from './feature-search-context';
import { filterSettingsBySearch } from '../libs/base/utils/search-features';
import { useGlobalStylesPanelContext } from '../../editor/global-styles/panel/context';
import {
	VARIATION_SURFACE_SIZE,
	SIZE_VARIATION_BLOCK_CARD_SLOT_NAME,
} from '../../editor/global-styles/panel/variation-surfaces';
import {
	useBlockInspectorContainer,
	isBlockInspectorContainerReady,
} from './use-block-inspector-container';

const excludedControls = ['canvas-editor'];

export const BlockFillPartials: ComponentType<any> = ({
	notice,
	clientId,
	isActive,
	setActive,
	blockProps,
	currentBlock,
	currentState,
	availableStates,
	currentBreakpoint,
	currentInnerBlock,
	BlockEditComponent,
	blockeraInnerBlocks,
	availableInnerStates,
	insideBlockInspector,
	currentInnerBlockState,
	updateBlockEditorSettings,
	blockStyleVariationsProps,
	blockSizeVariationsProps = {},
}): Element<any> => {
	const {
		fallbackClientId,
		currentBlockStyleVariation,
		setCurrentBlockStyleVariation,
		variationSurface,
		usesSharedRootStyleVariation = false,
	} = useGlobalStylesPanelContext();

	const variationCardSlotName =
		variationSurface === VARIATION_SURFACE_SIZE
			? SIZE_VARIATION_BLOCK_CARD_SLOT_NAME
			: DEFAULT_STYLE_VARIATION_BLOCK_CARD_SLOT_NAME;

	const variationCardLabels =
		variationSurface === VARIATION_SURFACE_SIZE
			? {
					closeTooltip: __('Close Size Variation', 'blockera'),
					closeButtonDataTest: 'Close Size Variation',
					settingsTooltip: __('Size Variation Settings', 'blockera'),
					settingsButtonDataTest: 'Size Variation Settings',
					rootDataTest: 'blockera-size-variation-block-card',
				}
			: {
					settingsTooltip: __('Style Variation Settings', 'blockera'),
					settingsButtonDataTest: 'Style Variation Settings',
				};

	const [searchQuery, setSearchQuery] = useState('');

	// prevent memory leak, componentDidMount.
	useEffect(() => {
		const others = select('blockera/controls').getControls();
		const repeaters = select('blockera/controls/repeater').getControls();

		const getMemoizedControlNames = memoize((controls) =>
			controls
				.filter((c) => !excludedControls.includes(c?.name))
				.map((c) => c?.name)
		);

		unregisterControl(getMemoizedControlNames(others), 'blockera/controls');
		unregisterControl(
			getMemoizedControlNames(repeaters),
			'blockera/controls/repeater'
		);
	}, [isActive]);

	// Filter additional settings based on search query
	const filteredAdditional = useMemo(() => {
		if (
			!searchQuery ||
			!searchQuery.trim() ||
			!blockProps.additional?.settings
		) {
			return blockProps.additional;
		}

		const filteredSettings = filterSettingsBySearch(
			blockProps.additional.settings || {},
			searchQuery
		);

		return {
			...blockProps.additional,
			settings: filteredSettings,
		};
	}, [searchQuery, blockProps.additional]);

	const searchContextValue = useMemo(
		() => ({
			searchQuery,
			setSearchQuery,
			activeSearchMode: Boolean(searchQuery && searchQuery.trim()),
		}),
		[searchQuery]
	);

	const patternSectionClientId = usePatternEditSection(clientId);
	const inspectorContainer = useBlockInspectorContainer();
	const isInspectorSlotReady =
		!insideBlockInspector ||
		isBlockInspectorContainerReady(inspectorContainer);

	return (
		<>
			{isInspectorSlotReady && (
				<Fill name={`blockera-block-card-content-${clientId}`}>
					{!insideBlockInspector && (
						<StateContainer
							name={blockProps.name}
							isGlobalStylesPanelRoot={true}
							clientId={fallbackClientId}
							isGlobalStylesCardWrapper={!insideBlockInspector}
							blockeraUnsavedData={
								blockProps.attributes?.blockeraUnsavedData
							}
							insideBlockInspector={insideBlockInspector}
							variationSurface={variationSurface}
							availableStates={availableStates}
						>
							<BlockCard
								isActive={isActive}
								setActive={setActive}
								notice={notice}
								blockStyleVariationsProps={
									blockStyleVariationsProps
								}
								blockSizeVariationsProps={
									blockSizeVariationsProps
								}
								setCurrentTab={blockProps.setCurrentTab}
								insideBlockInspector={insideBlockInspector}
								clientId={fallbackClientId}
								editorClientId={clientId}
								blockName={blockProps.name}
								innerBlocks={blockeraInnerBlocks}
								currentInnerBlock={currentInnerBlock}
								currentBlock={currentBlock}
								currentState={currentState}
								currentBreakpoint={currentBreakpoint}
								currentInnerBlockState={currentInnerBlockState}
								currentStateAttributes={blockProps.attributes}
								availableStates={availableStates}
								additional={filteredAdditional}
								blockeraInnerBlocks={blockeraInnerBlocks}
								supports={blockProps.supports}
								setAttributes={blockProps.setAttributes}
								handleOnChangeAttributes={
									blockProps.handleOnChangeAttributes
								}
								currentBlockStyleVariation={
									currentBlockStyleVariation
								}
								activeBlockVariation={
									blockProps?.activeBlockVariation || ''
								}
								handleOnClick={updateBlockEditorSettings}
								setCurrentBlockStyleVariation={
									setCurrentBlockStyleVariation
								}
								variationBlockCardSlotName={
									variationCardSlotName
								}
								variationBlockCardLabels={variationCardLabels}
							/>

							{isInnerBlock(currentBlock) && (
								<InnerBlockCard
									insideBlockInspector={insideBlockInspector}
									isActive={isActive}
									clientId={clientId}
									activeBlock={currentBlock}
									blockName={blockProps.name}
									innerBlocks={blockeraInnerBlocks}
									handleOnClick={updateBlockEditorSettings}
									currentBlock={currentBlock}
									currentState={currentState}
									availableStates={availableInnerStates}
									currentBreakpoint={currentBreakpoint}
									currentInnerBlockState={
										currentInnerBlockState
									}
									currentStateAttributes={
										blockProps.currentStateAttributes
									}
									additional={blockProps.additional}
									supports={blockProps.supports}
									setAttributes={blockProps.setAttributes}
									handleOnChangeAttributes={
										blockProps.handleOnChangeAttributes
									}
								/>
							)}
						</StateContainer>
					)}

					{insideBlockInspector && (
						<>
							{patternSectionClientId && (
								<PatternBlockCard
									patternClientId={patternSectionClientId}
								/>
							)}
							<BlockCard
								isActive={isActive}
								setActive={setActive}
								notice={notice}
								setCurrentTab={blockProps.setCurrentTab}
								insideBlockInspector={insideBlockInspector}
								clientId={clientId}
								blockName={blockProps.name}
								innerBlocks={blockeraInnerBlocks}
								currentInnerBlock={currentInnerBlock}
								currentBlock={currentBlock}
								currentState={currentState}
								blockStyleVariationsProps={
									blockStyleVariationsProps
								}
								blockSizeVariationsProps={
									blockSizeVariationsProps
								}
								currentBreakpoint={currentBreakpoint}
								currentInnerBlockState={currentInnerBlockState}
								currentStateAttributes={blockProps.attributes}
								availableStates={availableStates}
								additional={filteredAdditional}
								blockeraInnerBlocks={blockeraInnerBlocks}
								supports={blockProps.supports}
								setAttributes={blockProps.setAttributes}
								handleOnChangeAttributes={
									blockProps.handleOnChangeAttributes
								}
								currentBlockStyleVariation={
									currentBlockStyleVariation
								}
								activeBlockVariation={
									blockProps?.activeBlockVariation || ''
								}
							/>
							{isInnerBlock(currentBlock) && (
								<InnerBlockCard
									insideBlockInspector={insideBlockInspector}
									isActive={isActive}
									clientId={clientId}
									activeBlock={currentBlock}
									blockName={blockProps.name}
									innerBlocks={blockeraInnerBlocks}
									handleOnClick={updateBlockEditorSettings}
									currentBlock={currentBlock}
									currentState={currentState}
									availableStates={availableInnerStates}
									currentBreakpoint={currentBreakpoint}
									currentInnerBlockState={
										currentInnerBlockState
									}
									currentStateAttributes={
										blockProps.currentStateAttributes
									}
									additional={blockProps.additional}
									supports={blockProps.supports}
									setAttributes={blockProps.setAttributes}
									handleOnChangeAttributes={
										blockProps.handleOnChangeAttributes
									}
								/>
							)}
						</>
					)}
				</Fill>
			)}
			{!insideBlockInspector &&
				(Boolean(currentBlockStyleVariation?.name) ||
					(usesSharedRootStyleVariation &&
						isEphemeralDefaultSizeVariation(
							currentBlockStyleVariation
						))) &&
				isActive && (
					<Fill name={`blockera-block-edit-content-${clientId}`}>
						<FeatureSearchContextProvider
							value={searchContextValue}
						>
							<BlockEditComponent
								{...{
									...blockProps,
									insideBlockInspector,
								}}
								availableStates={
									isInnerBlock(currentBlock)
										? availableInnerStates
										: availableStates
								}
							/>
						</FeatureSearchContextProvider>
					</Fill>
				)}
		</>
	);
};
