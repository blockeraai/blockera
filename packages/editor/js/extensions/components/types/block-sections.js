// @flow

export type BlockSections = {
	blockSections: {
		expandAll: boolean,
		focusMode: boolean,
		collapseAll: boolean,
	},
	updateBlockSections: (newBlockSections: Object) => void,
};

export type BlockSection = {
	initialOpen: boolean,
	onToggle: (isOpen: boolean) => void,
};
