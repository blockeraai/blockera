// @flow

/**
 * External dependencies
 */
import type { ComponentType, Element } from 'react';
import { useState, useMemo } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { isInnerBlock } from './utils';
import { FeatureSearchContextProvider } from './feature-search-context';

/**
 * Block inspector extension UI (SharedBlockExtension / InspectorControls).
 * Rendered outside BlockPartials SlotFillProvider (InspectorControls uses its own).
 */
export const BlockInspectorEditContent: ComponentType<any> = ({
	isActive,
	blockProps,
	currentBlock,
	BlockEditComponent,
	availableStates,
	availableInnerStates,
	insideBlockInspector,
}): Element<any> | null => {
	const [searchQuery, setSearchQuery] = useState('');

	const searchContextValue = useMemo(
		() => ({
			searchQuery,
			setSearchQuery,
			activeSearchMode: Boolean(searchQuery && searchQuery.trim()),
		}),
		[searchQuery]
	);

	if (!insideBlockInspector || !isActive) {
		return null;
	}

	return (
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
	);
};
