// @flow

export type BlockAppContextType = {
	settings: {
		key: number,
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
