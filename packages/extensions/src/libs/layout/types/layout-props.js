// @flow
/**
 * External dependencies
 */
import type { MixedElement } from 'react';

/**
 * Internal dependencies
 */
import type { TBlockProps, THandleOnChangeAttributes } from '../../types';

export type TCssProps = {
	display?: string,
	'flex-direction'?: string,
	'align-items'?: string,
	'justify-content'?: string,
	'row-gap'?: string,
	gap?: string,
	'column-gap'?: string,
	'flex-wrap'?: string,
	'align-content'?: string,
	'justify-items'?: string,
	'grid-auto-flow'?: string,
};

export type TLayoutProps = {
	values: {
		gap: { lock: boolean, gap: string, columns: string, rows: string },
		display: string,
		flexWrap: { value: string, reverse: boolean },
		alignItems: string,
		alignContent: string,
		flexDirection: { value: string, reverse: boolean },
		justifyContent: string,
		gridAlignItems: string,
		gridJustifyItems: string,
		gridAlignContent: string,
		gridJustifyContent: string,
		gridGap: { lock: boolean, gap: string, columns: string, rows: string },
		gridDirection: { value: string, dense: boolean },
		gridColumns: Array<Object>,
		gridRows: Array<Object>,
		gridAreas: Array<Object>,
	},
	// defaultValue: {
	// 	type?: string,
	// 	wideSize?: string,
	// 	contentSize?: string,
	// 	justifyContent?: string,
	// },
	block: TBlockProps,
	config: Object,
	children?: MixedElement,
	handleOnChangeAttributes: THandleOnChangeAttributes,
};

export type TItem = {
	'sizing-mode': string,
	size: string,
	'min-size': string,
	'max-size': string,
	'auto-fit': boolean,
	'auto-generated'?: boolean,
	isVisible: boolean,
};

export type TFieldItem = {
	item: TItem,
	itemId: number,
};

export type THeaderItem = {
	item: TItem,
	itemId: number,
	isOpen: boolean,
	setOpen: (isOpen: boolean) => void,
	children?: any,
	isOpenPopoverEvent: (event: Object) => void,
};

export type TAreaItem = {
	name: string,
	'column-start': number,
	'column-end': number,
	'row-start': number,
	'row-end': number,
	isVisible: boolean,
};

export type TAreasFieldItem = {
	item: TAreaItem,
	itemId: number,
};

export type TAreasHeaderItem = {
	item: TAreaItem,
	itemId: number,
	isOpen: boolean,
	setOpen: (isOpen: boolean) => void,
	children?: any,
	isOpenPopoverEvent: (event: Object) => void,
};
