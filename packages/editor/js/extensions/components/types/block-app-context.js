// @flow

/**
 * Internal dependencies
 */
import type { BlockBaseProps } from './';

export type BlockAppContextType = {
	props: BlockBaseProps,
	settings: {
		blockSections: {
			expandAll: boolean,
			focusMode: boolean,
			collapseAll: boolean,
		},
		sections: {
			[key: string]: Object,
		},
		focusedSection: string,
	},
	setSettings: (newSettings: Object) => void,
};
