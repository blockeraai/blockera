// @flow

/**
 * External dependencies
 */
import type { MixedElement } from 'react';

/**
 * Internal dependencies
 */
import { InnerBlocksExtension } from '../../inner-blocks';
import type { BlockCompositeInserterProps } from '../types';
import { Inserter } from './inserter';
import { AvailableItems } from './available-items';
import StatesManager from '../../block-states/components/states-manager';

export const BlockCompositeInserter = ({
	blockStates,
	innerBlocks,
	inserterProps,
}: BlockCompositeInserterProps): MixedElement => {
	const InserterComponent = (props: Object) => (
		<Inserter
			{...{
				...props,
				maxItems:
					inserterProps?.innerBlocksLength +
					Object.keys(inserterProps?.states).length,
				Items: () => (
					<AvailableItems
						blocks={inserterProps?.blocks}
						elements={inserterProps?.elements}
						states={inserterProps?.states}
						setBlockState={inserterProps?.setBlockState}
						setCurrentBlock={inserterProps?.setCurrentBlock}
						setBlockClientInners={
							inserterProps?.setBlockClientInners
						}
						clientId={inserterProps?.clientId || ''}
						getBlockInners={inserterProps?.getBlockInners}
					/>
				),
			}}
		/>
	);

	return (
		<StatesManager
			{...{
				...blockStates,
				InserterComponent,
			}}
		>
			<InnerBlocksExtension {...(innerBlocks || {})} />
		</StatesManager>
	);
};
