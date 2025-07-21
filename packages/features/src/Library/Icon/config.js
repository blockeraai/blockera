// @flow

export const icon = {
	block: {
		status: true,
		inspector: {
			status: true,
			tabPosition: 'blockera-inspector-settings-start',
			innerBlocks: {},
			blockStates: {},
		},
		htmlEditable: {
			status: true,
			selector:
				'{{ BLOCK_SELECTOR }} div[role="textbox"][contenteditable="true"]',
		},
		contextualToolbar: {
			status: false,
			type: 'none',
		},
	},
};
