// @flow

export type BlockAppContextType = {
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
