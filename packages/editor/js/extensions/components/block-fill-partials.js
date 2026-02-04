// @flow

/**
 * External dependencies
 */
import memoize from 'fast-memoize';
import { select } from '@wordpress/data';
import { Fill } from '@wordpress/components';
import type { ComponentType, Element } from 'react';
import { useEffect, useState, useMemo } from '@wordpress/element';

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
	StyleVariationBlockCard,
} from '../libs/block-card';
import { isInnerBlock } from './utils';
import StateContainer from './state-container';
import { FeatureSearchContextProvider } from './feature-search-context';
import { filterSettingsBySearch } from '../libs/base/utils/search-features';
import { useGlobalStylesPanelContext } from '../../editor/global-styles/panel/context';

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
}): Element<any> => {
	const { currentBlockStyleVariation, setCurrentBlockStyleVariation } =
		useGlobalStylesPanelContext();

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

	return (
		<>
			<Fill name={`blockera-block-card-content-${clientId}`}>
				{!insideBlockInspector && (
					<StateContainer
						name={blockProps.name}
						clientId={clientId}
						isGlobalStylesCardWrapper={!insideBlockInspector}
						blockeraUnsavedData={
							blockProps.attributes?.blockeraUnsavedData
						}
						insideBlockInspector={insideBlockInspector}
						availableStates={
							isInnerBlock(currentBlock)
								? availableInnerStates
								: availableStates
						}
					>
						<BlockCard
							isActive={isActive}
							setActive={setActive}
							notice={notice}
							blockStyleVariationsProps={
								blockStyleVariationsProps
							}
							setCurrentTab={blockProps.setCurrentTab}
							insideBlockInspector={insideBlockInspector}
							clientId={clientId}
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
						/>

						{Boolean(currentBlockStyleVariation?.name) && (
							<StyleVariationBlockCard
								insideBlockInspector={insideBlockInspector}
								isActive={isActive}
								clientId={clientId}
								blockName={blockProps.name}
								handleOnClick={updateBlockEditorSettings}
								currentBlock={currentBlock}
								currentState={currentState}
								availableStates={availableInnerStates}
								currentBreakpoint={currentBreakpoint}
								currentInnerBlock={currentInnerBlock}
								currentInnerBlockState={currentInnerBlockState}
								currentStateAttributes={
									blockProps.currentStateAttributes
								}
								additional={blockProps.additional}
								supports={blockProps.supports}
								setAttributes={blockProps.setAttributes}
								handleOnChangeAttributes={
									blockProps.handleOnChangeAttributes
								}
								setCurrentBlockStyleVariation={
									setCurrentBlockStyleVariation
								}
								currentBlockStyleVariation={
									currentBlockStyleVariation
								}
							/>
						)}

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
								currentInnerBlockState={currentInnerBlockState}
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
								currentInnerBlockState={currentInnerBlockState}
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
			{insideBlockInspector && isActive && (
				<Fill name={`blockera-block-edit-content-${clientId}`}>
					<FeatureSearchContextProvider value={searchContextValue}>
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

			{!insideBlockInspector &&
				currentBlockStyleVariation?.name &&
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
