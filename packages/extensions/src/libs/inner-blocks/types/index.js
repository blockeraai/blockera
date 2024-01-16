// @flow

export type InnerBlockType = 'heading' | 'paragraph' | 'icon' | 'button';

export type InnerBlockModel = {
	id: number,
	name: string,
	type: InnerBlockType,
	label: string,
	icon: {
		name: string,
		lib: string,
	},
	attributes: Object,
};

export type InnerBlocksProps = { innerBlocks: Array<Object> };
