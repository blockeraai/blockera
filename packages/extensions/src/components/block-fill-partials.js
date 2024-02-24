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
 * Publisher dependencies
 */
import { unregisterControl } from '@publisher/controls';

/**
 * Internal dependencies
 */
import { BlockCard } from '../libs/block-card';

export const BlockFillPartials: ComponentType<any> = memo(
	({
		states,
		clientId,
		blockProps,
		currentState,
		currentBlock,
		currentInnerBlock,
		BlockEditComponent,
		publisherInnerBlocks,
		currentInnerBlockState,
		updateBlockEditorSettings,
	}): Element<any> => {
		// prevent memory leak, componentDidUnmount.
		useEffect(() => {
			return () => {
				const others = select('publisher-core/controls').getControls();
				const repeaters = select(
					'publisher-core/controls/repeater'
				).getControls();

				const getMemoizedControlNames = memoize((controls) =>
					controls.map((c) => c?.name)
				);

				unregisterControl(
					getMemoizedControlNames(others),
					'publisher-core/controls'
				);
				unregisterControl(
					getMemoizedControlNames(repeaters),
					'publisher-core/controls/repeater'
				);
			};
			// eslint-disable-next-line
		}, []);

		return (
			<>
				<Fill name={`publisher-block-card-content-${clientId}`}>
					<BlockCard
						states={states}
						clientId={clientId}
						activeState={currentState}
						activeBlock={currentBlock}
						innerBlocks={publisherInnerBlocks}
						currentInnerBlock={currentInnerBlock}
						handleOnClick={updateBlockEditorSettings}
						activeInnerBlockState={currentInnerBlockState}
					/>
				</Fill>
				<Fill name={`publisher-block-edit-content-${clientId}`}>
					<BlockEditComponent {...blockProps} />
				</Fill>
			</>
		);
	}
);
