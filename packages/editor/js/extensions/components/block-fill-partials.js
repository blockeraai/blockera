// @flow

/**
 * External dependencies
 */
import memoize from 'fast-memoize';
import { select } from '@wordpress/data';
import type { ComponentType, Element } from 'react';
import { Fill } from '@wordpress/components';
import { useEffect, memo } from '@wordpress/element';

/**
 * Blockera dependencies
 */
import { unregisterControl } from '@blockera/controls';

/**
 * Internal dependencies
 */
import { isInnerBlock } from './utils';
import {
	BlockCard,
	InnerBlockCard,
	StyleVariationBlockCard,
} from '../libs/block-card';
import StateContainer from './state-container';

const excludedControls = ['canvas-editor'];

export const BlockFillPartials: ComponentType<any> = memo(
	({
		notice,
		clientId,
		isActive,
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
	}): Element<any> => {
		// prevent memory leak, componentDidMount.
		useEffect(() => {
			const others = select('blockera/controls').getControls();
			const repeaters = select(
				'blockera/controls/repeater'
			).getControls();

			const getMemoizedControlNames = memoize((controls) =>
				controls
					.filter((c) => !excludedControls.includes(c?.name))
					.map((c) => c?.name)
			);

			unregisterControl(
				getMemoizedControlNames(others),
				'blockera/controls'
			);
			unregisterControl(
				getMemoizedControlNames(repeaters),
				'blockera/controls/repeater'
			);
		}, [isActive]);

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
								notice={notice}
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
								additional={blockProps.additional}
								blockeraInnerBlocks={blockeraInnerBlocks}
								supports={blockProps.supports}
								setAttributes={blockProps.setAttributes}
								handleOnChangeAttributes={
									blockProps.controllerProps
										.handleOnChangeAttributes
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
										blockProps.controllerProps
											.handleOnChangeAttributes
									}
								/>
							)}

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
								currentInnerBlockState={currentInnerBlockState}
								currentStateAttributes={
									blockProps.currentStateAttributes
								}
								additional={blockProps.additional}
								supports={blockProps.supports}
								setAttributes={blockProps.setAttributes}
								handleOnChangeAttributes={
									blockProps.controllerProps
										.handleOnChangeAttributes
								}
							/>
						</StateContainer>
					)}

					{insideBlockInspector && (
						<>
							<BlockCard
								isActive={isActive}
								notice={notice}
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
								additional={blockProps.additional}
								blockeraInnerBlocks={blockeraInnerBlocks}
								supports={blockProps.supports}
								setAttributes={blockProps.setAttributes}
								handleOnChangeAttributes={
									blockProps.controllerProps
										.handleOnChangeAttributes
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
										blockProps.controllerProps
											.handleOnChangeAttributes
									}
								/>
							)}
						</>
					)}
				</Fill>
				{isActive && (
					<Fill name={`blockera-block-edit-content-${clientId}`}>
						<BlockEditComponent
							{...{ ...blockProps, insideBlockInspector }}
							availableStates={
								isInnerBlock(currentBlock)
									? availableInnerStates
									: availableStates
							}
						/>
					</Fill>
				)}
			</>
		);
	}
);
