// @flow

/**
 * External dependencies
 */
import memoize from 'fast-memoize';
import { select, useDispatch } from '@wordpress/data';
import type { ComponentType, Element } from 'react';
import { Fill } from '@wordpress/components';
import { useEffect, memo, useMemo } from '@wordpress/element';

/**
 * Blockera dependencies
 */
import { unregisterControl } from '@blockera/controls';

/**
 * Internal dependencies
 */
import { isInnerBlock } from './utils';
import { useExtensionsStore } from '../../hooks';
import { BlockCard, InnerBlockCard } from '../libs/block-card';
import { isVirtualBlock } from '../libs/block-card/inner-blocks/helpers';

const excludedControls = ['canvas-editor'];

export const BlockFillPartials: ComponentType<any> = memo(
	({
		notice,
		clientId,
		isActive,
		blockProps,
		currentBlock,
		currentState,
		currentBreakpoint,
		currentInnerBlock,
		BlockEditComponent,
		blockeraInnerBlocks,
		currentInnerBlockState,
		updateBlockEditorSettings,
	}): Element<any> => {
		const { getBlockExtensionBy } = useExtensionsStore();
		const { getStates, getInnerStates } = select('blockera/editor');
		const { updateBlockAttributes } = useDispatch('core/block-editor');
		const availableStates =
			blockProps?.additional?.availableBlockStates || getStates();
		const availableInnerStates = useMemo(() => {
			let blockStates =
				(
					blockProps?.additional?.blockeraInnerBlocks[currentBlock] ||
					{}
				)?.availableBlockStates || getInnerStates();

			if (isInnerBlock(currentBlock)) {
				if (!isVirtualBlock(currentBlock)) {
					const { availableBlockStates } =
						getBlockExtensionBy('targetBlock', currentBlock) || {};

					if (Object.keys(availableBlockStates || {}).length) {
						blockStates = availableBlockStates;
					}
				}
			}

			return blockStates;
			// eslint-disable-next-line react-hooks/exhaustive-deps
		}, [currentBlock, blockProps]);

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

		const handleOnChangeAttributes = (
			attribute: string,
			value: any
		): void => {
			if (attribute === 'name') {
				if (value === '' || value === null) {
					value = undefined;
				}

				updateBlockAttributes(clientId, { metadata: { name: value } });
			} else {
				updateBlockAttributes(clientId, { [attribute]: value });
			}
		};

		return (
			<>
				<Fill name={`blockera-block-card-content-${clientId}`}>
					<BlockCard
						notice={notice}
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
						handleOnChangeAttributes={handleOnChangeAttributes}
					/>

					{isInnerBlock(currentBlock) && (
						<InnerBlockCard
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
							handleOnChangeAttributes={handleOnChangeAttributes}
						/>
					)}
				</Fill>
				{isActive && (
					<Fill name={`blockera-block-edit-content-${clientId}`}>
						<BlockEditComponent
							{...blockProps}
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
