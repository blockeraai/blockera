// @flow

import type { MixedElement } from 'react';
import type { TBlockProps } from '../../../libs/types';

export type TGridBuilderProps = {
	type: string,
	id: string,
	children: MixedElement,
	position: { top: number, left: number },
	dimension: { width: number, height: number },
	block: TBlockProps,
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
	type: 'column' | 'row',
	attribute: TAttribute,
	setHovered: (string | null) => {},
	block: TBlockProps,
	attributeId: 'publisherGridColumns' | 'publisherGridRows',
	hovered: string | null,
	createVirtualAreas: () => {},
};

export type TSizeSettingProps = {
	item: Object,
	block: TBlockProps,
	popoverTitle: 'column' | 'row',
	items: TAttribute,
	attributeId: 'publisherGridColumns' | 'publisherGridRows',
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
