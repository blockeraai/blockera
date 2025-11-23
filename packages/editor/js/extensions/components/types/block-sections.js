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
	status: boolean,
	initialOpen: boolean,
	onToggle: (
		isOpen: boolean,
		action?: 'switch-to-parent' | 'switch-to-inner',
		targetBlock?: string
	) => void,
};
