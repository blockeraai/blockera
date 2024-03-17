// @flow

import type { MixedElement } from 'react';
import type { TBlockProps } from '../../../libs/types';

export type TGridBuilderProps = {
	children: MixedElement,
	block: TBlockProps,
	extensionProps: {
		publisherDisplay: Object,
		publisherFlexLayout: Object,
		publisherGap: Object,
		publisherFlexWrap: Object,
		publisherAlignContent: Object,
		publisherGridAlignItems: Object,
		publisherGridJustifyItems: Object,
		publisherGridAlignContent: Object,
		publisherGridJustifyContent: Object,
		publisherGridGap: Object,
		publisherGridDirection: Object,
		publisherGridColumns: Object,
		publisherGridRows: Object,
		publisherGridAreas: Object,
	},
};

export type TCellsProps = {
	hoveredColumn: string | null,
	hoveredRow: string | null,
	virtualMergedAreas: Array<Object>,
	setVirtualMergedAreas: ([]) => {},
	setVirtualTargetAreaId: (number | null) => {},
	virtualTargetAreaId: number | null,
	activeAreaId: number | null,
	setActiveAreaId: (number | null) => {},
	targetAreaId: number | null,
	setTargetAreaId: (number | null) => {},
	createVirtualAreas: () => {},
	newMergedArea: Object,
	setNewMergedArea: (Object | null) => {},
};

export type TGapHandlerProps = {
	type: 'column' | 'row',
	style: Object,
	styles: Object,
};

type TAttribute = { length: number, value: Array<Object> };

export type TGridSizeHandlerProps = {
	item: TItem,
	index: number,
	type: 'column' | 'row',
	attribute: TAttribute,
	setHovered: (string | null) => {},
	block: TBlockProps,
	attributeId: 'publisherGridColumns' | 'publisherGridRows',
	hovered: string | null,
	createVirtualAreas: () => {},
	extensionProps: Object,
};

export type TItem = {
	'sizing-mode': string,
	size: string,
	'min-size': string,
	'max-size': string,
	'auto-fit': boolean,
	isVisible: boolean,
	id: number,
};

export type TSizeSettingProps = {
	item: TItem,
	block: TBlockProps,
	popoverTitle: 'column' | 'row',
	items: TAttribute,
	attributeId: 'publisherGridColumns' | 'publisherGridRows',
	extensionProps: Object,
	onClose: () => void,
};

export type TAreaMergeHandlerProps = {
	id: number,
	setTargetAreaId: (number | null) => {},
	activeAreaId: number,
	mergeArea: (string) => {},
	setVirtualMergedAreas: ([]) => {},
	setVirtualTargetAreaId: (number | null) => {},
	createVirtualAreas: () => {},
	highlightHandler: (string) => {},
};
export type TAddButtonProps = {
	type: 'column' | 'row',
	gridTemplate: Array<Object>,
	onClick: () => {},
	columnGap: string | null,
	rowGap: string | null,
};
