// @flow

/**
 * Blocks that should show flex child extension regardless of the parent block are flex blocks
 */
export const flexChildBlocks: {
	[key: string]: { direction: 'row' | 'column' },
} = {
	'core/column': {
		direction: 'row',
	},
};
