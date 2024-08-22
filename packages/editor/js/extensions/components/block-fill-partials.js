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
import { BlockCard, InnerBlockCard } from '../libs/block-card';

const excludedControls = ['canvas-editor'];

export const BlockFillPartials: ComponentType<any> = memo(
	({
		clientId,
		isActive,
		blockProps,
		currentBlock,
		currentInnerBlock,
		BlockEditComponent,
		blockeraInnerBlocks,
		updateBlockEditorSettings,
	}): Element<any> => {
		const { isActiveBlockExtensions } = select('blockera/extensions');

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
					<BlockCard
						clientId={clientId}
						blockName={blockProps.name}
						innerBlocks={blockeraInnerBlocks}
						currentInnerBlock={currentInnerBlock}
						handleOnClick={updateBlockEditorSettings}
					/>

					{isInnerBlock(currentBlock) && (
						<InnerBlockCard
							clientId={clientId}
							activeBlock={currentBlock}
							blockName={blockProps.name}
							innerBlocks={blockeraInnerBlocks}
							handleOnClick={updateBlockEditorSettings}
						/>
					)}
				</Fill>
				{isActiveBlockExtensions() && (
					<Fill name={`blockera-block-edit-content-${clientId}`}>
						<BlockEditComponent {...blockProps} />
					</Fill>
				)}
			</>
		);
	}
);
